
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
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    fbclid?: string;
    gclid?: string;
  };
  event_source_url?: string;
  action_source: string;
}

// Helper function to extract client IP from request headers
function getClientIP(request: Request): string | null {
  // Try multiple header sources for client IP
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const forwarded = request.headers.get('forwarded');
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  if (forwarded) {
    // Parse forwarded header format: for=ip
    const match = forwarded.match(/for=([^;,]+)/);
    if (match) {
      return match[1].replace(/"/g, '');
    }
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const metaPixelId = Deno.env.get('HOMEAI_META_PIXEL_ID');
    const metaAccessToken = Deno.env.get('HOMEAI_META_ACCESS_TOKEN');
    const testEventCode = Deno.env.get('META_TEST_EVENT_CODE');

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
      value,
      currency = 'USD',
      contentName,
      eventSourceUrl,
      attributionData = {}
    } = await req.json();

    // Extract client IP from request headers
    const clientIp = getClientIP(req);

    console.log('Processing Meta conversion:', { 
      eventName, 
      eventId, 
      hasEmail: !!userEmail,
      clientIp,
      testEventCode: !!testEventCode
    });

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
    if (value || contentName || Object.keys(attributionData).length > 0) {
      conversionData.custom_data = {
        ...(value && { value, currency }),
        ...(contentName && { content_name: contentName }),
        // Include attribution data in custom_data
        ...(attributionData.utm_source && { utm_source: attributionData.utm_source }),
        ...(attributionData.utm_medium && { utm_medium: attributionData.utm_medium }),
        ...(attributionData.utm_campaign && { utm_campaign: attributionData.utm_campaign }),
        ...(attributionData.utm_term && { utm_term: attributionData.utm_term }),
        ...(attributionData.utm_content && { utm_content: attributionData.utm_content }),
        ...(attributionData.fbclid && { fbclid: attributionData.fbclid }),
        ...(attributionData.gclid && { gclid: attributionData.gclid }),
      };
    }

    // Prepare request body for Meta API
    const requestBody = {
      data: [conversionData],
      ...(testEventCode && { test_event_code: testEventCode })
    };

    console.log('Sending to Meta API:', JSON.stringify(requestBody, null, 2));

    // Send to Meta Conversions API (updated to v20.0)
    const metaResponse = await fetch(
      `https://graph.facebook.com/v20.0/${metaPixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${metaAccessToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const metaResult = await metaResponse.json();

    console.log('Meta API Response Status:', metaResponse.status);
    console.log('Meta API Response:', JSON.stringify(metaResult, null, 2));

    if (!metaResponse.ok) {
      console.error('Meta API error:', metaResult);
      return new Response(
        JSON.stringify({ 
          error: 'Meta API error', 
          details: metaResult,
          status: metaResponse.status,
          requestSent: requestBody
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Meta conversion sent successfully:', metaResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        eventId,
        metaResponse: metaResult,
        debugInfo: {
          clientIp,
          hasTestEventCode: !!testEventCode,
          apiVersion: 'v20.0'
        }
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
