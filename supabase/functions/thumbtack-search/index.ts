
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
  requestFlowUrl?: string;
  phone?: string;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Declare variables at function scope so they're available in catch block
  let searchQuery: string;
  let zipCode: string;

  try {
    const requestBody = await req.json();
    searchQuery = requestBody.searchQuery;
    zipCode = requestBody.zipCode;
    
    if (!searchQuery || !zipCode) {
      throw new Error('Search query and zip code are required');
    }

    console.log('Searching Thumbtack for:', { searchQuery, zipCode });

    // Use production environment as primary
    let clientId = Deno.env.get('THUMBTACK_PROD_CLIENT_ID');
    let clientSecret = Deno.env.get('THUMBTACK_PROD_CLIENT_SECRET');
    let oauthUrl = 'https://auth.thumbtack.com/oauth2/token';
    let apiUrl = 'https://api.thumbtack.com';
    
    if (!clientId || !clientSecret) {
      // Fallback to development environment
      clientId = Deno.env.get('THUMBTACK_DEV_CLIENT_ID');
      clientSecret = Deno.env.get('THUMBTACK_DEV_CLIENT_SECRET');
      oauthUrl = 'https://staging-auth.thumbtack.com/oauth2/token';
      apiUrl = 'https://staging-api.thumbtack.com';
      console.log('Using development environment with clientId:', clientId?.substring(0, 8) + '...');
    } else {
      console.log('Using production environment with clientId:', clientId?.substring(0, 8) + '...');
    }

    console.log('Environment check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdLength: clientId?.length || 0,
      clientSecretLength: clientSecret?.length || 0,
      oauthUrl,
      apiUrl
    });

    if (!clientId || !clientSecret) {
      console.log('No Thumbtack credentials found, returning mock data');
      const mockProviders: ThumbTackProvider[] = [
        {
          name: "Demo Lawn Care Pro",
          rating: 4.8,
          reviewCount: 127,
          location: `${zipCode}`,
          profileUrl: "https://www.thumbtack.com",
          description: "Professional lawn care services with 10+ years experience"
        },
        {
          name: "Green Thumb Services",
          rating: 4.9,
          reviewCount: 89,
          location: `${zipCode}`,
          profileUrl: "https://www.thumbtack.com",
          description: "Eco-friendly lawn maintenance and landscaping"
        }
      ];

      return new Response(
        JSON.stringify({
          success: true,
          providers: mockProviders,
          total: mockProviders.length,
          note: "Demo data - Thumbtack development credentials not configured"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('OAuth URL:', oauthUrl);
    console.log('API URL:', apiUrl);

    // Step 1: Get access token using OAuth2 client credentials flow
    const authString = `${clientId}:${clientSecret}`;
    const encodedAuth = btoa(authString);
    
    console.log('OAuth request details:', {
      method: 'POST',
      url: oauthUrl,
      authStringLength: authString.length,
      encodedAuthLength: encodedAuth.length,
      encodedAuthPreview: encodedAuth.substring(0, 20) + '...',
      contentType: 'application/x-www-form-urlencoded',
      grantType: 'client_credentials'
    });

    const tokenResponse = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedAuth}`
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'audience': 'urn:partner-api'
      })
    });

    console.log('Token response status:', tokenResponse.status);
    console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));
    console.log('Token response URL attempted:', oauthUrl);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', tokenResponse.status, errorText);
      console.error('Full response details:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        url: tokenResponse.url,
        headers: Object.fromEntries(tokenResponse.headers.entries())
      });
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
      searchQuery: searchQuery,
      zipCode: zipCode,
      utmData: {
        utm_source: 'cma-fivefourventures'
      },
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
      location: business.businessLocation || `${zipCode}`,
      image: business.businessImageURL || null,
      profileUrl: business.servicePageURL || `https://www.thumbtack.com/profile/${business.businessID}`,
      requestFlowUrl: business.requestFlowURL,
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
    const safeSearchQuery = searchQuery || 'Service';
    const safeZipCode = zipCode || '00000';
    
    const mockProviders: ThumbTackProvider[] = [
      {
        name: `Professional ${safeSearchQuery} Service`,
        rating: 4.7,
        reviewCount: 95,
        location: safeZipCode,
        profileUrl: "https://www.thumbtack.com",
        requestFlowUrl: "https://www.thumbtack.com/quote",
        description: `Reliable ${safeSearchQuery.toLowerCase()} services in your area`
      },
      {
        name: `Expert ${safeSearchQuery} Solutions`,
        rating: 4.9,
        reviewCount: 143,
        location: safeZipCode,
        profileUrl: "https://www.thumbtack.com", 
        requestFlowUrl: "https://www.thumbtack.com/quote",
        description: `Professional ${safeSearchQuery.toLowerCase()} with excellent customer reviews`
      },
      {
        name: `Local ${safeSearchQuery} Specialists`,
        rating: 4.6,
        reviewCount: 78,
        location: safeZipCode,
        profileUrl: "https://www.thumbtack.com",
        requestFlowUrl: "https://www.thumbtack.com/quote",
        description: `Trusted ${safeSearchQuery.toLowerCase()} providers serving your neighborhood`
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
