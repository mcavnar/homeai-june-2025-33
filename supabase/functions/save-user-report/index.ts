
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create client with anon key for user verification
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseClient = createClient(supabaseUrl!, anonKey!, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify the user's session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('User verification failed:', userError);
      throw new Error('Invalid user session');
    }

    console.log('Verified user:', user.id);

    // Get the report data from the request
    const { 
      analysis_data, 
      property_data, 
      negotiation_strategy, 
      pdf_file_path, 
      pdf_text, 
      pdf_metadata, 
      property_address, 
      inspection_date 
    } = await req.json();

    if (!analysis_data) {
      throw new Error('Analysis data is required');
    }

    // Create service role client for database operations
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const serviceClient = createClient(supabaseUrl!, serviceRoleKey!);

    console.log('Deactivating existing active reports for user:', user.id);
    
    // First, mark any existing reports as inactive using service role
    const { error: deactivateError } = await serviceClient
      .from('user_reports')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (deactivateError) {
      console.error('Error deactivating existing reports:', deactivateError);
      throw deactivateError;
    }

    console.log('Creating new active report for user:', user.id);

    // Create new active report using service role
    const insertData = {
      user_id: user.id,
      analysis_data,
      property_data,
      negotiation_strategy,
      pdf_file_path,
      pdf_text,
      pdf_metadata,
      property_address,
      inspection_date,
      is_active: true,
      processing_status: 'completed'
    };

    const { data, error: insertError } = await serviceClient
      .from('user_reports')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting new report:', insertError);
      throw insertError;
    }

    console.log('Successfully saved user report:', data.id);

    return new Response(
      JSON.stringify({
        success: true,
        report: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in save-user-report function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
