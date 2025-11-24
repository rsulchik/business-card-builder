import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  budget?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received contact form submission");
    const { name, email, phone, serviceType, budget, message }: ContactEmailRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending email for order from: ${name} (${email})`);

    // Create professional HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .field {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
            border-left: 4px solid #667eea;
          }
          .field-label {
            font-weight: bold;
            color: #2c3e50;
            display: block;
            margin-bottom: 5px;
          }
          .field-value {
            color: #555;
          }
          .message-box {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
            border-left: 4px solid #764ba2;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 New Order Received!</h1>
          <p>You have a new project inquiry</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="field-label">👤 Name:</span>
            <span class="field-value">${name}</span>
          </div>
          
          <div class="field">
            <span class="field-label">📧 Email:</span>
            <span class="field-value">${email}</span>
          </div>
          
          ${phone ? `
          <div class="field">
            <span class="field-label">📱 Phone:</span>
            <span class="field-value">${phone}</span>
          </div>
          ` : ''}
          
          ${serviceType ? `
          <div class="field">
            <span class="field-label">🔧 Service Type:</span>
            <span class="field-value">${serviceType}</span>
          </div>
          ` : ''}
          
          ${budget ? `
          <div class="field">
            <span class="field-label">💰 Budget:</span>
            <span class="field-value">$${budget}</span>
          </div>
          ` : ''}
          
          <div class="message-box">
            <span class="field-label">💬 Project Description:</span>
            <p class="field-value">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="text-align: center; color: #7f8c8d; margin-top: 30px;">
            <em>Please respond to this client promptly!</em>
          </p>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const plainTextContent = `
New Order Received!

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${serviceType ? `Service Type: ${serviceType}` : ''}
${budget ? `Budget: $${budget}` : ''}

Project Description:
${message}

---
Please respond to this client promptly!
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Professional Services <onboarding@resend.dev>",
      to: ["resulsopyyev71@gmail.com"],
      replyTo: email,
      subject: `🎯 New Order from ${name}`,
      html: htmlContent,
      text: plainTextContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your order has been sent successfully! We'll contact you shortly."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email. Please try again later.",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
