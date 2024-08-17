import path from 'path'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config({ path: path.resolve('./config/.env') })
export const sendEmail = async ({ to = '', subject = '', html = '' }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_EAMIL_USER,
            pass: process.env.SEND_EAMIL_PASSWORD
        },
    });
    const info = await transporter.sendMail({
        from: 'e-commerce', // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
    });
}