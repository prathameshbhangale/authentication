import nodemailer from 'nodemailer'


const mailSender = async (email, title, body) => {
    try {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: false,
      })
  
      let info = await transporter.sendMail({
        from: `"Coder" <${process.env.EMAIL_ADDRESS}>`, // sender address
        to: `${email}`, // list of receivers
        subject: `${title}`, // Subject line
        html: `${body}`, // html body
      })
      console.log(info.response)
      return info
    } catch (error) {
      console.log(error.message)
      return error.message
    }
  }
  
export default mailSender