
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

  // Declare variables at function scope so they're available in catch block
  let category: string;
  let zip: string;

  try {
    const requestBody = await req.json();
    category = requestBody.category;
    zip = requestBody.zip;
    
    if (!category || !zip) {
      throw new Error('Category and zip code are required');
    }

    console.log('Searching Thumbtack for:', { category, zip });

    // Use staging environment only
    const clientId = Deno.env.get('THUMBTACK_DEV_CLIENT_ID');
    const clientSecret = Deno.env.get('THUMBTACK_DEV_CLIENT_SECRET');
    const oauthUrl = 'https://staging-auth.thumbtack.com/oauth/token';
    const apiUrl = 'https://staging-api.thumbtack.com';

    if (!clientId || !clientSecret) {
      console.log('No staging Thumbtack credentials found, returning mock data');
      const mockProviders: ThumbTackProvider[] = [
        {
          name: "Demo Lawn Care Pro",
          rating: 4.8,
          reviewCount: 127,
          location: `${zip}`,
          profileUrl: "https://www.thumbtack.com",
          description: "Professional lawn care services with 10+ years experience"
        },
        {
          name: "Green Thumb Services",
          rating: 4.9,
          reviewCount: 89,
          location: `${zip}`,
          profileUrl: "https://www.thumbtack.com",
          description: "Eco-friendly lawn maintenance and landscaping"
        }
      ];

      return new Response(
        JSON.stringify({
          success: true,
          providers: mockProviders,
          total: mockProviders.length,
          note: "Demo data - Thumbtack staging credentials not configured"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Using staging environment with clientId:', clientId?.substring(0, 8) + '...');
    console.log('OAuth URL:', oauthUrl);
    console.log('API URL:', apiUrl);

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
        utm_source: 'cma-fivefourventures'
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
    
    // Return mock data as fallback when API fails
    console.log('API failed, returning mock data as fallback');
    
    // Add null checks for variables that might be undefined
    const safeCategory = category || 'Service';
    const safeZip = zip || '00000';
    
    const mockProviders: ThumbTackProvider[] = [
      {
        name: `Professional ${safeCategory} Service`,
        rating: 4.7,
        reviewCount: 95,
        location: safeZip,
        profileUrl: "https://www.thumbtack.com",
        description: `Reliable ${safeCategory.toLowerCase()} services in your area`
      },
      {
        name: `Expert ${safeCategory} Solutions`,
        rating: 4.9,
        reviewCount: 143,
        location: safeZip,
        profileUrl: "https://www.thumbtack.com", 
        description: `Professional ${safeCategory.toLowerCase()} with excellent customer reviews`
      },
      {
        name: `Local ${safeCategory} Specialists`,
        rating: 4.6,
        reviewCount: 78,
        location: safeZip,
        profileUrl: "https://www.thumbtack.com",
        description: `Trusted ${safeCategory.toLowerCase()} providers serving your neighborhood`
      }
    ];

    return new Response(
      JSON.stringify({
        success: true,
        providers: mockProviders,
        total: mockProviders.length,
        note: "Fallback data - Thumbtack API temporarily unavailable",
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
