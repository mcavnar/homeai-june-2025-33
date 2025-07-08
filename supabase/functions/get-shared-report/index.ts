
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get the shared report by token
    const { data: sharedReport, error: shareError } = await supabaseClient
      .from('shared_reports')
      .select('*')
      .eq('report_token', token)
      .eq('is_active', true)
      .single()

    if (shareError || !sharedReport) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive share token' }),
        { 
          status: 200, 
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
      .single()

    if (reportError || !userReport) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return the report data (same structure as the private version)
    return new Response(
      JSON.stringify({
        analysis: userReport.analysis_data,
        propertyData: userReport.property_data,
        negotiationStrategy: userReport.negotiation_strategy,
        pdfText: userReport.pdf_text,
        propertyAddress: userReport.property_address,
        inspectionDate: userReport.inspection_date,
        pdfPath: userReport.pdf_file_path
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error fetching shared report:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
