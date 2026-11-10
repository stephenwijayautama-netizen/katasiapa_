import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  const mailOptions = {
    from: `"Kata Siapa" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Kode Verifikasi OTP Anda - Kata Siapa',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; background: #0B0B0F; color: #ffffff; border-radius: 16px;">
        <h2 style="color: #ec4899; margin-bottom: 8px;">Kata Siapa Game</h2>
        <p style="color: #a1a1aa; font-size: 14px;">Gunakan kode verifikasi berikut untuk masuk ke permainan:</p>
        <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ffffff; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #71717a; font-size: 12px;">Kode ini berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
