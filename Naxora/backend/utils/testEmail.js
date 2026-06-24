import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import nodemailer from 'nodemailer';

console.log('Testing email with:');
console.log('HOST:', process.env.EMAIL_HOST);
console.log('PORT:', process.env.EMAIL_PORT);
console.log('USER:', process.env.EMAIL_USER);
console.log('PASS:', process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0,4)}****` : 'NOT SET');
console.log('FROM:', process.env.EMAIL_FROM);
console.log('');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   
  port: 587,                 
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

try {
  await transporter.verify();
  console.log(' SMTP Connection successful!');

  await transporter.sendMail({
    from: `Payal&Co <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Test - Payal&Co',
    html: '<h1>Email working! </h1>',
  });

  console.log(' Test email sent! Check inbox of:', process.env.EMAIL_USER);
} catch (err) {
  console.log(' ERROR:', err.message);
}