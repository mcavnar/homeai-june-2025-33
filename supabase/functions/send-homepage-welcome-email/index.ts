import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from 'npm:react@18.3.1';
import { HomepageWelcomeEmail } from './_templates/homepage-welcome-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HomepageEmailRequest {
  email: string;
  sessionId: string;
  currentUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sessionId, currentUrl }: HomepageEmailRequest = await req.json();

    console.log('Sending homepage welcome email to:', email);

    // Create the upload URL with tracking parameters
    const uploadUrl = `${new URL(currentUrl).origin}/anonymous-upload?source=homepage_popup&session_id=${sessionId}`;

    // Render the email template
    const emailHtml = await renderAsync(
      React.createElement(HomepageWelcomeEmail, {
        uploadUrl,
      })
    );

    const emailResponse = await resend.emails.send({
      from: "HomeAI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to HomeAI -- Your Home Condition Dashboard",
      html: emailHtml,
    });

    console.log("Homepage welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-homepage-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);