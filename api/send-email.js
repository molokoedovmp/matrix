import sgMail from '@sendgrid/mail';

export default async function handler(request, response) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  // Остальной код аналогичен, но используйте sgMail.send() вместо transporter.sendMail()
} 