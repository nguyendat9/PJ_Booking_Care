import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';


let buildUrlEmail = (doctorId, token) => {


    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;

}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email
                || !data.doctorId
                || !data.timeType
                || !data.date
                || !data.fullName
                || !data.selectedGender
                || !data.address) {
                //  
                resolve({
                    errCode: 1,
                    errMessage: 'Lỗi đường dẫn. Không thể tìm thấy đường dẫn này !!'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                //upsert patient
                let user = await db.Users.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roles: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    },

                });


                //create booking record
                if (user && user[0]) {
                    await db.Bookings.findOrCreate({
                        where: { customerId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            customerId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        },
                    })
                }


                resolve({
                    errCode: 0,
                    errMessage: 'Lưu thông tin thành công !!'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                //  
                resolve({
                    errCode: 1,
                    errMessage: 'Lỗi đường dẫn. Không thể tìm thấy đường dẫn này !!'
                })
            } else {
                let appointment = await db.Bookings.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật lịch hẹn thành công !'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Lịch hẹn đã được kích hoạt hoặc không tồn tại !'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment, postVerifyBookAppointment
}