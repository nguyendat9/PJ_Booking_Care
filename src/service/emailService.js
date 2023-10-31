require('dotenv').config();
import nodemailer from 'nodemailer'




let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },

    });

    let info = await transporter.sendMail({
        from: '"aasd"<dat807282@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Khi mà bạn nhận được email này. Bạn đã đặt thành công lịch khám bệnh online trên website thành công.</p>
        <p>Thông tin về lịch khám: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu thông tin trên là thật! vui lòng nhấn vào đường link dưới để xác nhận và hoàn tất việc đặt lịch khám.</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank" >Nhấn vào đây</a>
        </div>

        <div>Cảm ơn bạn đã sử dụng dịch vụ !</div>
        `
        ,
    })
}

let sendAttachmetsEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },

    });

    let info = await transporter.sendMail({
        from: '"aasd"<dat807282@gmail.com>',
        to: dataSend.email,
        subject: "Kết quả thông tin đặt lịch khám bệnh",
        html: `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Khi mà bạn nhận được email này. Bạn đã đặt thành công lịch khám bệnh online trên website thành công.</p>
        <p>Thông tin hóa đơn được gửi trong file đính kèm: </p>

        <div>Cảm ơn bạn đã sử dụng dịch vụ !</div>
        `
        ,
        attachments: [
            {
                filename: `remedy-${dataSend.customerId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split('base64,')[1],
                encoding: 'base64'
            }
        ],
    })
}


module.exports = {
    sendSimpleEmail, sendAttachmetsEmail
}
