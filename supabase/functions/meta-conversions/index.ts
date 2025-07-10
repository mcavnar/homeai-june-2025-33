
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversionData {
  event_name: string;
  event_id: string;
  event_time: number;
  user_data: {
    em?: string; // hashed email
    client_user_agent?: string;
    client_ip_address?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
  };
  event_source_url?: string;
  action_source: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const metaPixelId = Deno.env.get('HOMEAI_META_PIXEL_ID');
    const metaAccessToken = Deno.env.get('HOMEAI_META_ACCESS_TOKEN');

    if (!metaPixelId || !metaAccessToken) {
      console.error('Meta credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Meta credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      eventName,
      eventId,
      userEmail,
      userAgent,
      clientIp,
      value,
      currency = 'USD',
      contentName,
      eventSourceUrl
    } = await req.json();

    console.log('Processing Meta conversion:', { eventName, eventId, hasEmail: !!userEmail });

    // Hash email if provided (SHA-256)
    let hashedEmail;
    if (userEmail) {
      const encoder = new TextEncoder();
      const data = encoder.encode(userEmail.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hashedEmail = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Prepare conversion data
    const conversionData: ConversionData = {
      event_name: eventName,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        ...(hashedEmail && { em: hashedEmail }),
        ...(userAgent && { client_user_agent: userAgent }),
        ...(clientIp && { client_ip_address: clientIp }),
      },
      action_source: 'website',
      ...(eventSourceUrl && { event_source_url: eventSourceUrl })
    };

    // Add custom data if provided
    if (value || contentName) {
      conversionData.custom_data = {
        ...(value && { value, currency }),
        ...(contentName && { content_name: contentName })
      };
    }

    // Send to Meta Conversions API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${metaPixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${metaAccessToken}`,
        },
        body: JSON.stringify({
          data: [conversionData],
          test_event_code: Deno.env.get('META_TEST_EVENT_CODE') // Optional for testing
        }),
      }
    );

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta API error:', metaResult);
      return new Response(
        JSON.stringify({ error: 'Meta API error', details: metaResult }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Meta conversion sent successfully:', metaResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        eventId,
        metaResponse: metaResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in meta-conversions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
