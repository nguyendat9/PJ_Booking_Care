import { emit } from 'nodemon';
import db from '../models/index';
require('dotenv').config();
import _, { assign, create, includes } from 'lodash';
import emailService from '../service/emailService';


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findAll({
                limit: limitInput,
                // where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcodes, as: 'positionData', attributes: ['value_Vi'] },
                    { model: db.Allcodes, as: 'genderData', attributes: ['value_Vi'] }
                ],
                raw: true,
                nest: true

            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.Users.findAll({
                where: { roles: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })


        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic',
        'addressClinic', 'note', 'specialtyId'

    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {

        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `missing param: ${checkObj.element}`
                })
            } else {

                //upsert markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdowns.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId

                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdowns.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }


                //upsert doctorinfor table
                let doctorinfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,

                    },
                    raw: false
                })
                if (doctorinfor) {
                    //update
                    doctorinfor.doctorId = inputData.doctorId;
                    doctorinfor.priceId = inputData.selectedPrice;
                    doctorinfor.provinceId = inputData.selectedProvince;
                    doctorinfor.paymentId = inputData.selectedPayment;
                    doctorinfor.nameClinic = inputData.nameClinic;
                    doctorinfor.addressClinic = inputData.addressClinic;
                    doctorinfor.note = inputData.note;
                    doctorinfor.specialtyId = inputData.specialtyId;
                    doctorinfor.clinicId = inputData.clinicId

                    await doctorinfor.save()
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'save successd !'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required params'
                })
            } else {
                let data = await db.Users.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password',]
                    },
                    include: [
                        { model: db.Markdowns, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcodes, as: 'positionData', attributes: ['value_Vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId',]
                            },
                            include: [

                                { model: db.Allcodes, as: 'priceTypeData', attributes: ['value_Vi'] },
                                { model: db.Allcodes, as: 'provinTypeData', attributes: ['value_Vi'] },
                                { model: db.Allcodes, as: 'paymentTypeData', attributes: ['value_Vi'] },

                            ]

                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};


                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item
                    })
                }
                //get all data
                let existing = await db.Schedules.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                );

                //compare difference
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedules.bulkCreate(toCreate);

                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}


let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                let dataSchedule = await db.Schedules.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcodes, as: 'timeTypeData', attributes: ['value_Vi'] },
                        { model: db.Users, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [

                        { model: db.Allcodes, as: 'priceTypeData', attributes: ['value_Vi'] },
                        { model: db.Allcodes, as: 'provinTypeData', attributes: ['value_Vi'] },
                        { model: db.Allcodes, as: 'paymentTypeData', attributes: ['value_Vi'] },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                let data = await db.Users.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password',]
                    },
                    include: [
                        { model: db.Markdowns, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcodes, as: 'positionData', attributes: ['value_Vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId',]
                            },
                            include: [

                                { model: db.Allcodes, as: 'priceTypeData', attributes: ['value_Vi'] },
                                { model: db.Allcodes, as: 'provinTypeData', attributes: ['value_Vi'] },
                                { model: db.Allcodes, as: 'paymentTypeData', attributes: ['value_Vi'] },

                            ]

                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};


                resolve({
                    errCode: 0,
                    data: data
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required params'
                })
            } else {
                let data = await db.Bookings.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Users, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [

                                { model: db.Allcodes, as: 'genderData', attributes: ['value_Vi'] }
                            ],
                        },

                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.customerId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required params'
                })
            } else {

                //update patient status
                let appointment = await db.Bookings.findOne({
                    where: {

                        doctorId: data.doctorId,
                        customerId: data.customerId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                //send email remedy

                await emailService.sendAttachmetsEmail(data);
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome, getAllDoctors, saveDetailInforDoctor, getDetailDoctorById, bulkCreateSchedule,
    getScheduleByDate, getExtraInforDoctorById, getProfileDoctorById, getListPatientForDoctor,
    sendRemedy
}