import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({email , emailType, userId}:any) => {
    try{

        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId,
                {verifyToken: hashedToken, verifyTokenExpire: Date.now()+3600000}
            )   
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken: hashedToken, forgotPasswordExpire: Date.now()+3600000}
            )  
        };

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "6c5ee00daa1c91",
              pass: "42dc63082682c9"
            }
          });
          
          const mailOptions = {
            from: 'surajrandhari@gmail.cpm', 
            to: email, 
            subject: emailType === 'VERIFY'? "Verify your email": "Reset your password",
           
            html: `<p>Click <a href='${process.env.DOMAIN}/verifyemail?token=${hashedToken}'>here  </a> to ${emailType === "VERIFY" ? "verify your email ": 'reset your Paassword'} or copy and paste the link in your browser 
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, 
          };
          

          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse


    }
    catch(error:any){
        throw new Error(error.message);
    }
}