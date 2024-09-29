
import nodemailer from 'nodemailer'
import config from '../config'


export const sendEmail = async (receiverEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.nodeEnv === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'mdbinshahed5@gmail.com',
      pass: 'opkm gjwb fvqs wtrn',
    },
  })

  // send mail with defined transport object
  await transporter.sendMail({
    from: 'mdbinshahed5@gmail.com', // sender address
    to: receiverEmail, // list of receivers
    subject: 'Reset Your Password', // Subject line
    text: 'Hello world?', // plain text body
    html, // html body
  })

  // opkm gjwb fvqs wtrn
  //   console.log('Message sent: %s', info.messageId)
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
