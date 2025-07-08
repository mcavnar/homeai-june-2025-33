
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    
    // Get the user from the auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user has an active report
    const { data: userReport, error: reportError } = await supabaseClient
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (reportError || !userReport) {
      return new Response(
        JSON.stringify({ error: 'No active report found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user already has a shared report
    const { data: existingShare, error: shareError } = await supabaseClient
      .from('shared_reports')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    let shareToken: string

    if (existingShare) {
      // Update existing share to be active
      const { error: updateError } = await supabaseClient
        .from('shared_reports')
        .update({ is_active: true })
        .eq('id', existingShare.id)

      if (updateError) {
        throw updateError
      }
      
      shareToken = existingShare.report_token
    } else {
      // Create new shared report
      const { data: newShare, error: createError } = await supabaseClient
        .from('shared_reports')
        .insert({
          user_id: user.id,
          is_active: true
        })
        .select()
        .single()

      if (createError || !newShare) {
        throw createError
      }
      
      shareToken = newShare.report_token
    }

    const shareUrl = `${req.headers.get('origin')}/shared/${shareToken}`

    return new Response(
      JSON.stringify({ 
        shareUrl,
        token: shareToken
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating share link:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
