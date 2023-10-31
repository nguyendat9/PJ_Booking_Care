import doctorService from "../service/doctorService"

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;

    if (!limit) limit = 10;
    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(doctors);
    } catch (e) {

        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...'
        })
    }

}


let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(200).jsom({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInforDoctors = async (req, res) => {
    try {
        let responses = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(responses)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200), json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log('check loi', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Erorr from server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(infor)
    } catch (e) {
        console.log('check loi', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Erorr from server'
        })
    }
}


let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(infor)
    } catch (e) {
        console.log('check loi', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Erorr from server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor)
    } catch (e) {
        console.log('check loi', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Erorr from server'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(infor)
    } catch (e) {
        console.log('check loi', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Erorr from server'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedy(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log('check loi', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Erorr from server'
        })
    }
}

module.exports = {
    getTopDoctorHome, getAllDoctors, postInforDoctors, getDetailDoctorById, bulkCreateSchedule,
    getScheduleByDate, getExtraInforDoctorById, getProfileDoctorById, getListPatientForDoctor, sendRemedy
}