import nodemailer from 'nodemailer';

// Initialize the transporter lazily to ensure environment variables are loaded
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is missing in environment variables');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
}

export async function sendWelcomeEmail(customerEmail: string, customerName: string, customContent?: string, customSubject?: string) {
  const mailer = getTransporter();
  
  const trackerUrl = process.env.TRACKER_URL || process.env.APP_URL || "https://momentum-tracker.onrender.com";
  const senderName = "Momentum Tracker";

  // Use custom content if provided, otherwise use default welcome message
  const mainContent = customContent || `
    <p>You've successfully joined the <strong>Momentum Inner Circle</strong>.</p>
    <p>From now on, you'll be the first to know whenever we release new features, performance updates, or high-performance systems for the tracker.</p>
    <p>Stay focused. Stay consistent. Build your momentum.</p>
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Momentum</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #000000;
          -webkit-font-smoothing: antialiased;
        }
        
        .wrapper {
          width: 100%;
          background-color: #ffffff;
          padding-bottom: 60px;
        }
        
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #0A0A0A;
          border: 1px solid #1F1F1F;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }
        
        .header {
          padding: 60px 40px 30px;
          text-align: center;
        }
        
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 15px;
          display: inline-block;
          color: #3B82F6;
        }
        
        .logo-text {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
          display: inline-block;
        }
        
        .content {
          padding: 0 50px 50px;
        }
        
        h1 {
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
          color: #FFFFFF;
          letter-spacing: -0.5px;
        }
        
        p {
          font-size: 17px;
          line-height: 1.7;
          color: #94A3B8;
          margin-bottom: 28px;
        }
        
        .highlight-box {
          background: linear-gradient(145deg, #111827, #0F172A);
          border: 1px solid #1E293B;
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 40px;
        }
        
        .highlight-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #3B82F6;
          margin-bottom: 10px;
        }
        
        .highlight-text {
          font-size: 16px;
          color: #F1F5F9;
          margin: 0;
          line-height: 1.5;
        }
        
        .button-container {
          text-align: center;
          margin: 40px 0;
        }
        
        .button {
          display: inline-block;
          padding: 22px 50px;
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%) !important;
          color: #FFFFFF !important;
          text-decoration: none;
          font-weight: 700;
          font-size: 19px;
          border-radius: 18px;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }
        
        .footer {
          padding: 40px 50px;
          background-color: #0D0D0D;
          border-top: 1px solid #1F1F1F;
          text-align: center;
        }
        
        .footer-text {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          line-height: 1.6;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-link {
          color: #475569;
          text-decoration: none;
          margin: 0 10px;
          font-size: 12px;
          font-weight: 600;
        }

        @media only screen and (max-width: 600px) {
          .container {
            margin: 20px 10px;
            border-radius: 24px;
          }
          .content {
            padding: 0 30px 40px;
          }
          h1 {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo"><span class="logo-text">MOMENTUM <span style="color: #4F46E5;">.</span></span></div>
          </div>
          <div class="content">
            <h1>Welcome to the Inner Circle, ${customerName}.</h1>
            ${mainContent}
            
            <div class="highlight-box">
              <div class="highlight-title">Stay Updated</div>
              <p class="highlight-text">
                You will receive a notification at <strong>${customerEmail}</strong> whenever a new update is deployed to the Momentum Tracker.
              </p>
            </div>

            <div class="button-container">
              <a href="${trackerUrl}/login" class="button">Access Tracker</a>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #475569; margin-top: 0;">
              Your journey begins now.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} Momentum Performance Systems. All rights reserved.</p>
            <div class="social-links">
              <a href="${trackerUrl}/dashboard" class="social-link">DASHBOARD</a>
              <a href="${trackerUrl}/support" class="social-link">SUPPORT</a>
              <a href="${trackerUrl}/community" class="social-link">COMMUNITY</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: `"${senderName}" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: customSubject || "Welcome to the Momentum Inner Circle",
      html: htmlContent,
    });
    
    console.log("Email sent successfully via Nodemailer:", info.messageId);
    return true;
  } catch (error) {
    console.error("Nodemailer Email send failed:", error);
    return false;
  }
}
