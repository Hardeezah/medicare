import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services or a custom SMTP server
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Receiver address
      subject: 'Your OTP for Account Verification', // Subject line
      text: `Your OTP for account verification is ${otp}. It is valid for the next 10 minutes.`,
      html: `<p>Your OTP for account verification is <strong>${otp}</strong>. It is valid for the next 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Error sending OTP to ${to}: `, error);
    return false;
    
  }
};

export const sendEmail = async (to: string, text: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Receiver address
      subject: 'Notification from Medicare', // Subject line
      text: `${text}`,
      html: `<p>${text}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: `, error);
    throw new Error('Failed to send Email. Please try again later.');
    
  }
};
