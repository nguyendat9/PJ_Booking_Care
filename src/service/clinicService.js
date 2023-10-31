import db from "../models/index";
require('dotenv').config();


let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.address
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                //  
                resolve({
                    errCode: 1,
                    errMessage: 'Lỗi đường dẫn. Không thể tìm thấy đường dẫn này !!'
                })
            } else {
                await db.Clinics.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllClinic = () => {

    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinics.findAll({

            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Lỗi đường dẫn. Không thể tìm thấy đường dẫn này !!'
                })
            }

            else {
                let data = {};
                data = await db.Clinics.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                    raw: true

                })
                if (data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId'],
                        raw: true
                    })

                    data.doctorClinic = doctorClinic;
                } else {
                    data = {}
                }

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createClinic, getAllClinic, getDetailClinicById
}