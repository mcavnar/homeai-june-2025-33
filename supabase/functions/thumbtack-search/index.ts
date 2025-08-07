
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThumbTackProvider {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  image?: string;
  profileUrl: string;
  phone?: string;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, zip } = await req.json();
    
    if (!category || !zip) {
      throw new Error('Category and zip code are required');
    }

    console.log('Searching Thumbtack for:', { category, zip });

    // Determine environment and get appropriate credentials
    let clientId, clientSecret, oauthUrl, apiUrl, environment;
    
    // Try staging first (recommended for integration), then production
    const stagingClientId = Deno.env.get('THUMBTACK_DEV_CLIENT_ID');
    const stagingClientSecret = Deno.env.get('THUMBTACK_DEV_CLIENT_SECRET');
    const prodClientId = Deno.env.get('THUMBTACK_PROD_CLIENT_ID');
    const prodClientSecret = Deno.env.get('THUMBTACK_PROD_CLIENT_SECRET');

    if (stagingClientId && stagingClientSecret) {
      clientId = stagingClientId;
      clientSecret = stagingClientSecret;
      oauthUrl = 'https://staging-auth.thumbtack.com/oauth/token';
      apiUrl = 'https://staging-api.thumbtack.com';
      environment = 'staging';
    } else if (prodClientId && prodClientSecret) {
      clientId = prodClientId;
      clientSecret = prodClientSecret;
      oauthUrl = 'https://auth.thumbtack.com/oauth/token';
      apiUrl = 'https://api.thumbtack.com';
      environment = 'production';
    } else {
      console.error('Missing credentials. Available env vars:', Object.keys(Deno.env.toObject()));
      throw new Error('Thumbtack credentials not configured. Need either staging or production credentials.');
    }

    console.log(`Using ${environment} environment with clientId:`, clientId?.substring(0, 8) + '...');
    console.log(`OAuth URL: ${oauthUrl}`);
    console.log(`API URL: ${apiUrl}`);

    // Step 1: Get access token using OAuth2 client credentials flow
    const tokenResponse = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      })
    });

    console.log('Token response status:', tokenResponse.status);
    console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', tokenResponse.status, errorText);
      throw new Error(`Failed to get access token: ${tokenResponse.status} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Token response data:', tokenData);
      throw new Error('No access token received from Thumbtack');
    }

    console.log('Successfully obtained access token');

    // Step 2: Create a business search
    const searchRequestBody = {
      zipCode: zip,
      utmData: {
        utm_source: 'cma-integration'
      },
      searchQuery: category,
      limit: 10
    };

    console.log('Creating business search with:', searchRequestBody);

    const searchResponse = await fetch(`${apiUrl}/api/v4/businesses/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(searchRequestBody)
    });

    console.log('Search response status:', searchResponse.status);
    console.log('Search response headers:', Object.fromEntries(searchResponse.headers.entries()));

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Search request failed:', searchResponse.status, errorText);
      throw new Error(`Search request failed: ${searchResponse.status} - ${errorText}`);
    }

    const searchData = await searchResponse.json();
    console.log('Search response:', JSON.stringify(searchData, null, 2));

    // Transform the response to match our interface
    const businesses = searchData.data || [];
    const providers: ThumbTackProvider[] = businesses.map((business: any) => ({
      name: business.businessName || 'Unknown Provider',
      rating: business.rating || 0,
      reviewCount: business.numberOfReviews || 0,
      location: business.businessLocation || `${zip}`,
      image: business.businessImageURL || null,
      profileUrl: business.servicePageURL || `https://www.thumbtack.com/profile/${business.businessID}`,
      phone: business.phone || null,
      description: business.businessIntroduction || business.featuredReview || null
    }));

    return new Response(
      JSON.stringify({
        success: true,
        providers,
        total: providers.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Thumbtack search error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        providers: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
