
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('get-shared-report function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json();
    console.log('Token received:', token);

    if (!token) {
      console.log('No token provided');
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the shared report by token
    const { data: sharedReport, error: shareError } = await supabaseClient
      .from('shared_reports')
      .select('*')
      .eq('report_token', token)
      .eq('is_active', true)
      .maybeSingle()

    if (shareError) {
      console.error('Error querying shared_reports:', shareError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!sharedReport) {
      console.log('No shared report found for token:', token);
      return new Response(
        JSON.stringify({ error: 'Share link not found or expired' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the user's active report
    const { data: userReport, error: reportError } = await supabaseClient
      .from('user_reports')
      .select('*')
      .eq('user_id', sharedReport.user_id)
      .eq('is_active', true)
      .maybeSingle()

    if (reportError) {
      console.error('Error querying user_reports:', reportError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userReport) {
      console.log('No user report found for user_id:', sharedReport.user_id);
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

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

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
