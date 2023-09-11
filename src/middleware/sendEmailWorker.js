const nodemailer = require("nodemailer");

module.exports = async (worker_name, worker_email, subject, url) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.SMTP_HOST,
      // service: process.env.SMTP_SERVICE,
      // port: Number(process.env.SMTP_EMAIL_PORT),
      // secure: Boolean(process.env.SMTP_SECURE),
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL_USER,
      to: worker_email,
      subject: subject,
      html: `<div style="background-color: #F4F4F4; font-family: Arial, sans-serif; padding: 20px;">
      <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);">
        <img src="https://cdn.discordapp.com/attachments/1118733891738554480/1147721385767080047/Screenshot_119-removebg-preview.png" alt="Company Logo" style="max-width: 100%; height: auto;">
        <h1 style="font-size: 24px; color: #333; font-weight: bold; margin-top: 20px;">Confirm Your Registration</h1>
        <p>Hello ${worker_name},</p>
        <p>Thank you for choosing Peworld! We're delighted to have you as a new member.</p>
        <p>To activate your account, please click the button below:</p>
        <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
          <a href="${url}" style="background-color: #5e50a1; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Activate Your Account</a>
        </div>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p><a href="${url}" style="color: #007BFF; text-decoration: none;">${url}</a></p>
        <p>Please complete your registration within the next 24 hours to ensure your account is activated.</p>
        <p>If you didn't register for an account on Peworld or received this email in error, please disregard this message.</p>
        <p>Thank you for joining Peworld! We're excited to have you on board.</p>
        <p>Best regards,</p>
        <p>Peworld Team</p>
        <p><a href="https://blanja-be-alpha.vercel.app/" style="color: #007BFF; text-decoration: none;">https://blanja-be-alpha.vercel.app/</a></p>
      </div>
    </div>
    
`,
    });
    // console.log("email sent successfully");
  } catch (error) {
    // console.log("email not sent!");
    console.log(error);
    return error;
  }
};