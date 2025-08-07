
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

    // Get OAuth2 credentials
    const clientId = Deno.env.get('THUMBTACK_DEV_CLIENT_ID');
    const clientSecret = Deno.env.get('THUMBTACK_DEV_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Thumbtack credentials not configured');
    }

    // Step 1: Get access token using OAuth2 client credentials flow
    const tokenResponse = await fetch('https://pro-api.thumbtack.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', errorText);
      throw new Error(`Failed to get access token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
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

    const searchResponse = await fetch('https://api.thumbtack.com/api/v4/businesses/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(searchRequestBody)
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Search request failed:', errorText);
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
