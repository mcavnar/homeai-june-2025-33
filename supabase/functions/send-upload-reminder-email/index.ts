import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";
import { ReminderEmail } from "./_templates/reminder-email.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
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
    const { email, sessionId, currentUrl }: EmailRequest = await req.json();

    if (!email || !sessionId) {
      throw new Error("Email and sessionId are required");
    }

    // Generate the upload URL (preserve the origin but change the path)
    const url = new URL(currentUrl);
    url.pathname = '/anonymous-upload';
    const uploadUrl = url.toString();

    // Render the email template
    const html = await renderAsync(
      React.createElement(ReminderEmail, { uploadUrl })
    );

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "HomeAI <onboarding@resend.dev>",
      to: [email],
      subject: "Your Home Inspection Report Analysis",
      html,
    });

    // Update the email_sent_at timestamp
    // Use the 'as any' typecast to avoid TypeScript errors with the table name
    const { error: updateError } = await supabase
      .from('upload_reminder_emails' as any)
      .update({ email_sent_at: new Date().toISOString() })
      .eq('session_id', sessionId)
      .eq('email', email);

    if (updateError) {
      console.error("Error updating email_sent_at:", updateError);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-upload-reminder-email function:", error);
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