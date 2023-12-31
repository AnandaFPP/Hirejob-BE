const nodemailer = require("nodemailer");

module.exports = async (
  recruiter_compname,
  worker_email,
  worker_name,
  hire_title,
  hire_desc,
  subject
) => {
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
      html: `<div style="background-color: #FBF7F5; display:flex;">
      <img src="https://cdn.discordapp.com/attachments/1118733891738554480/1147721385767080047/Screenshot_119-removebg-preview.png" style="width: 200px;height: 100%;"/>
    </div>
    <div style="padding:20px">
      <p>
        Dear ${worker_name}
      </p>
      <p>
        We are delighted to offer you the position of ${hire_title} at ${recruiter_compname}. Your qualifications and experience have impressed us, and we believe you would be a valuable addition to our team.
      </p>
      <p>
        Position: ${hire_title}
      </p>
    <p>
        Description: ${hire_desc}
      </p>
      <p>
        Please let us know your acceptance by replying to this email. If you have any questions or need further information, feel free to reach out to us at [Contact Email] or [Contact Phone Number].
      </p>
      <p>
        We look forward to your positive response and the possibility of you joining our team.
      </p>
      <p>
      ${recruiter_compname}
      </p>
      <p>
        If you believe you received this email in error, or if you did not register for an account on Peworld, please disregard this message.
      </p>
      <p>
        Thank you for choosing Peworld. We look forward to serving you!
      </p>
      <p>
        Best regards,
      </p>
      <p>
        ${recruiter_compname}
      </p>
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