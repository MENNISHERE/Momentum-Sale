
export const generateEmailTemplate = (customerName: string, content?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kanon Update</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; }
    .wrapper { width: 100%; background-color: #ffffff; padding-bottom: 60px; }
    .container { max-width: 600px; margin: 40px auto; background-color: #0A0A0A; border: 1px solid #1F1F1F; border-radius: 32px; overflow: hidden; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2); }
    .header { padding: 60px 40px 30px; text-align: center; }
    .logo { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; letter-spacing: -2px; color: #3B82F6; }
    .content { padding: 0 50px 50px; text-align: center; }
    p { font-size: 17px; line-height: 1.7; color: #94A3B8; margin-bottom: 28px; }
    .footer { padding: 40px 50px; background-color: #0D0D0D; border-top: 1px solid #1F1F1F; text-align: center; }
    .footer-text { font-size: 13px; color: #64748B; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">KANON <span style="color: #4F46E5; font-size: 1.2em;">.</span></div>
      </div>
      <div class="content">
        <h1 style="color: #FFFFFF; font-size: 24px; margin-bottom: 20px;">Hello, ${customerName}</h1>
        <p style="color: #FFFFFF;">
          ${content || "whenever is there is any update in kanon u will get it thanks for joining inner circle"}
        </p>
      </div>
      <div class="footer">
        <p class="footer-text">© 2026 Kanon Performance Systems. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
