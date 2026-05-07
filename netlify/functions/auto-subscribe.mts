import { Config } from "@netlify/functions";
import { sendWelcomeEmail } from "../../src/lib/email";

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let email: string, name: string;
  try {
    const body = await req.json();
    email = body.email;
    name = body.name;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  try {
    const updateContent = `
      <p>It's a privilege to welcome you to the <strong>Momentum Inner Circle</strong>.</p>
      <p>You've joined an elite group dedicated to mastering their habits. From now on, you will be the first to know whenever we release new features, performance updates, or high-performance systems for the Momentum Tracker.</p>
      <p>We'll keep you informed so you can stay at the top of your game.</p>
      <p>Stay focused. Stay consistent. Build your momentum.</p>
    `;

    // Process.env might not be populated in Edge. But in Netlify Functions V2, Netlify.env shouldn't be relied upon.
    // Standard process.env works in Netlify Functions.
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.error("Missing Gmail credentials in env (GMAIL_USER or GMAIL_APP_PASSWORD).");
      return new Response(JSON.stringify({ success: false, error: 'Email service not configured on server.' }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const success = await sendWelcomeEmail(email, name, updateContent, "Welcome to the Inner Circle - Stay Updated");

    if (success) {
      return new Response(JSON.stringify({ success: true, message: "Professional update email sent." }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: "Failed to send email. Ensure Gmail App Password is correct." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/auto-subscribe"
};
