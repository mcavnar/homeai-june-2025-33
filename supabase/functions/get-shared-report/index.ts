
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('=== get-shared-report function started ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response('ok', { headers: corsHeaders })
    }

    // Parse request body with improved error handling
    let requestBody = {};
    let token = null;

    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      
      if (bodyText && bodyText.trim()) {
        try {
          requestBody = JSON.parse(bodyText);
          console.log('Parsed request body:', requestBody);
          token = requestBody.token;
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          console.log('Body text that failed to parse:', bodyText);
        }
      }
    } catch (bodyError) {
      console.error('Error reading request body:', bodyError);
    }

    // Try to extract token from URL if not in body
    if (!token) {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      console.log('URL path segments:', pathSegments);
      
      // Look for token in path segments
      const tokenFromPath = pathSegments.find(segment => 
        segment.length === 36 && segment.includes('-')
      );
      
      if (tokenFromPath) {
        token = tokenFromPath;
        console.log('Token extracted from URL path:', token);
      }
    }

    console.log('Final token value:', token);

    if (!token) {
      console.log('No token found in request body or URL');
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

    // Create Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created successfully');

    // Get the shared report by token
    console.log('Querying shared_reports table with token:', token);
    
    const { data: sharedReport, error: shareError } = await supabaseClient
      .from('shared_reports')
      .select('*')
      .eq('report_token', token)
      .eq('is_active', true)
      .maybeSingle()

    console.log('Shared report query result:', { data: sharedReport, error: shareError });

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
    
    const { data: userReport, error: reportError } = await supabaseClient
      .from('user_reports')
      .select('*')
      .eq('user_id', sharedReport.user_id)
      .eq('is_active', true)
      .maybeSingle()

    console.log('User report query result:', { data: userReport, error: reportError });

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
