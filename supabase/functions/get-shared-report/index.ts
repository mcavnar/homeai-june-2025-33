
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('=== get-shared-report function started ===');
  
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response('ok', { headers: corsHeaders })
    }

    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    // Parse request body with error handling
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { token } = requestBody;
    console.log('Extracted token:', token);

    if (!token) {
      console.log('No token provided');
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check - SUPABASE_URL exists:', !!supabaseUrl);
    console.log('Environment check - SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseServiceKey);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with error handling
    let supabaseClient;
    try {
      supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
      console.log('Supabase client created successfully');
    } catch (clientError) {
      console.error('Error creating Supabase client:', clientError);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize database connection' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the shared report by token
    console.log('Querying shared_reports table with token:', token);
    
    let sharedReport;
    try {
      const { data, error: shareError } = await supabaseClient
        .from('shared_reports')
        .select('*')
        .eq('report_token', token)
        .eq('is_active', true)
        .maybeSingle()

      console.log('Shared report query result:', { data, error: shareError });

      if (shareError) {
        console.error('Error querying shared_reports:', shareError);
        return new Response(
          JSON.stringify({ error: 'Database error while fetching shared report' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      sharedReport = data;
    } catch (queryError) {
      console.error('Exception during shared_reports query:', queryError);
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!sharedReport) {
      console.log('No shared report found for token:', token);
      return new Response(
        JSON.stringify({ error: 'Share link not found or expired' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Found shared report for user_id:', sharedReport.user_id);

    // Get the user's active report
    console.log('Querying user_reports table for user_id:', sharedReport.user_id);
    
    let userReport;
    try {
      const { data, error: reportError } = await supabaseClient
        .from('user_reports')
        .select('*')
        .eq('user_id', sharedReport.user_id)
        .eq('is_active', true)
        .maybeSingle()

      console.log('User report query result:', { data, error: reportError });

      if (reportError) {
        console.error('Error querying user_reports:', reportError);
        return new Response(
          JSON.stringify({ error: 'Database error while fetching user report' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      userReport = data;
    } catch (queryError) {
      console.error('Exception during user_reports query:', queryError);
      return new Response(
        JSON.stringify({ error: 'User report query failed' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userReport) {
      console.log('No user report found for user_id:', sharedReport.user_id);
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully found user report, preparing response data');

    // Return the report data
    const responseData = {
      analysis: userReport.analysis_data,
      propertyData: userReport.property_data,
      negotiationStrategy: userReport.negotiation_strategy,
      pdfText: userReport.pdf_text,
      propertyAddress: userReport.property_address,
      inspectionDate: userReport.inspection_date,
      pdfPath: userReport.pdf_file_path
    };

    console.log('Response data prepared successfully');

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('=== CRITICAL ERROR IN EDGE FUNCTION ===');
    console.error('Error type:', typeof error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error object:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error?.message || 'Unknown error occurred'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
