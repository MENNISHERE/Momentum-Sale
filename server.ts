import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { sendWelcomeEmail } from "./src/lib/email.ts";
import { getSubscribers } from "./src/lib/firebase.ts";
import { generateEmailTemplate } from "./src/lib/emailTemplates.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize all routes
app.use(express.json());

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok",
    emailConfigured: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD
  });
});

// 2. Arrival Email (Manual Send from Admin)
app.post("/api/send-arrival-email", async (req, res) => {
  const { content, email } = req.body;
  
  if (!content || !email) {
    return res.status(400).json({ success: false, error: "Content and email are required." });
  }

  try {
    const success = await sendWelcomeEmail(email, "Champion", content);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: "Failed to send email via Nodemailer." });
    }
  } catch (error: any) {
    console.error("Email Send Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Bulk Email (Send to All Subscribers)
app.post("/api/send-bulk-email", async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ success: false, error: "Content is required." });
  }

  try {
    const subscribers = await getSubscribers() as any[];
    if (!subscribers || subscribers.length === 0) {
      return res.status(400).json({ success: false, error: "No subscribers found." });
    }

    // Return 200 immediately and process in background to avoid timeout
    res.json({ success: true, message: `Started sending to ${subscribers.length} subscribers.` });

    // Process in background
    (async () => {
      console.log(`Starting bulk send to ${subscribers.length} users...`);
      let successCount = 0;
      let failCount = 0;

      for (const sub of subscribers) {
        try {
          // Add a small delay between emails to avoid Gmail spam filters (1 second)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const success = await sendWelcomeEmail(sub.email, sub.name || "Champion", content);
          if (success) successCount++;
          else failCount++;
        } catch (err) {
          console.error(`Failed to send bulk email to ${sub.email}:`, err);
          failCount++;
        }
      }
      console.log(`Bulk send complete. Success: ${successCount}, Failed: ${failCount}`);
    })();

  } catch (error: any) {
    console.error("Bulk Email Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// 4. Auto-Subscribe Email (Send when user joins Inner Circle)
app.post("/api/auto-subscribe", async (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ success: false, error: "Email and name are required." });
  }

  try {
    const updateContent = `
      <p>It's a privilege to welcome you to the <strong>Momentum Inner Circle</strong>.</p>
      <p>You've joined an elite group dedicated to mastering their habits. From now on, you will be the first to know whenever we release new features, performance updates, or high-performance systems for the Momentum Tracker.</p>
      <p>We'll keep you informed so you can stay at the top of your game.</p>
      <p>Stay focused. Stay consistent. Build your momentum.</p>
    `;

    const success = await sendWelcomeEmail(email, name, updateContent, "Welcome to the Inner Circle - Stay Updated");
    
    if (success) {
      res.json({ success: true, message: "Professional update email sent." });
    } else {
      res.status(500).json({ success: false, error: "Failed to send email." });
    }
  } catch (error: any) {
    console.error("Auto-Subscribe Email Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Whop Webhook (Automatic Send on Payment)
app.post("/api/webhook/whop", async (req, res) => {
  // Return 200 immediately to Whop
  res.status(200).send("Webhook received");

  const event = req.body;
  const signature = req.headers['x-whop-signature'] as string;
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

  // Verify signature if secret is provided
  if (webhookSecret && signature) {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    if (signature !== digest) {
      console.error("Invalid Whop Webhook Signature");
      return;
    }
  }
  
  console.log("Whop Webhook Received:", event.action || event.type);

  // Check for payment or membership activation
  const action = event.action || event.type;
  
  if (action === 'membership.went_active' || action === 'payment.succeeded') {
    const customerEmail = event.data?.user?.email || event.data?.email;
    const customerName = event.data?.user?.username || event.data?.user?.name || "Champion";

    if (customerEmail) {
      try {
        const purchaseContent = `
          <p>Your payment was successful. Your commitment to excellence has been recognized.</p>
          <p>We've initialized your high-performance environment and unlocked full access to the Momentum Tracker.</p>
          <p>To ensure data integrity, please authenticate using the exact same email associated with your payment: <strong>${customerEmail}</strong></p>
        `;
        await sendWelcomeEmail(customerEmail, customerName, purchaseContent, "Your Momentum Tracker Access is Ready!");
        console.log(`Welcome email sent to ${customerEmail} via Nodemailer`);
      } catch (error) {
        console.error("Error processing email in webhook:", error);
      }
    }
  }
});

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Always start the server
startServer();

export { app };
