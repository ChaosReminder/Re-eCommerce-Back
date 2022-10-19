const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')

const emailRegister = async (datos) => {
    // const transport = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     }
    //   });

      const {username,email , token } = datos

    //   const info = await transport.sendMail({
    //     from : "CellStore - eCommerce celulares",
    //     to: email,
    //     subject : "Comprueba tu cuenta en CellStore",
    //     text : "Comprueba tu cuenta en CellStore",
    //     html : `<p>Hola ${username}, comprueba tu cuenta de CellStore.</p>
    //     <p> Tu cuenta esta lista, solo debes comprobarla en el siguiente enlace</p>
    //      <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar cuenta</a>
    //      <p>Si tu no creaste esta cuenta, puedes ignorar este email</p>`

         
    //   })
      
    sgMail.setApiKey(process.env.SENDGRID_APY_KEY);
    const msg = {
        to: email,
       from: 'tomikapo1160@gmail.com',
        subject: 'Comprueba tu cuenta en Cell-store',
        text: 'Comprueba tu cuenta en cell store',
        html: `<p>Hola ${username}, comprueba tu cuenta de CellStore.</p>
                <p> Tu cuenta ya esta lista, solo debes comprobarla con el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar Cuenta</a> </p>
                <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>`
        };

        await sgMail.send(msg);
} 

const forgotPasswordSendEmail = async(datos) => { 
        
   const {email, token } = datos

   sgMail.setApiKey(process.env.SENDGRID_APY_KEY);
    const msg = {
        to: email,
       from: 'tomikapo1160@gmail.com',
        subject: 'Olvidaste tu Contraseña',
        text: 'cambia tu constraseña',
        html: `<p>Hola, accede al link de abajo para cambiar tu contraseña.</p>
                <a href="${process.env.FRONTEND_URL}/changePassword/${token}">Cambiar la password</a> </p>
                <p> Si tu no solicitaste el cambio de contraseña por "olvidaste tu contraseña", alguien intenta hackearte </p>`
        };

        await sgMail.send(msg);

} 

const emailPayment = async (link,local, email) => {
        sgMail.setApiKey(process.env.SENDGRID_APY_KEY);
        const msg = {
            to: email,
           from: 'tomikapo1160@gmail.com',
            subject: 'Tu orden',
            text: 'Tu compra',
            html: `<p>Hola, aqui esta tu orden.</p>
            <p>elegiste el local ${local}.</p>
                    <a href="${link}">proceder a comprar</a> </p>
                    <p> Si tu ya hiciste la compra , puedes obviar este email</p>`
            };
    
            await sgMail.send(msg);
}



module.exports = {emailRegister, forgotPasswordSendEmail, emailPayment}