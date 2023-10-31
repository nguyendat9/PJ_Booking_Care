import express from "express";
import HomeController from "../controllers/homeController";
import UserController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import handbookController from "../controllers/handbookController";


let router = express.Router();
let initWedRouter = (app) => {

    router.get('/', HomeController.getHomePage)
    router.get('/create', HomeController.getAPI)
    router.post('/post_api', HomeController.Post_API)
    router.get('/get_read', HomeController.Get_Read)
    router.get('/edit-user/:id', HomeController.Get_Edit)
    router.post('/put_api', HomeController.Put_API)
    router.get('/delete-user/:id', HomeController.Delete_API)



    router.post('/api/login', UserController.handleLogin)
    //restAPI: get, post, put, delete
    router.get('/api/get-all-user', UserController.handleGetAllUser); // R
    router.post('/api/create-new-user', UserController.handleCreateNewUser); //C
    router.put('/api/edit_user', UserController.handleEditUser); //U
    router.delete('/api/delete_user', UserController.handleDeleteUser);//D
    router.get('/api/allcode', UserController.GetAllCode)



    router.get('/api/top_doctor_home', doctorController.getTopDoctorHome)
    router.get('/api/get_all_doctors', doctorController.getAllDoctors)
    router.post('/api/save_infor_doctors', doctorController.postInforDoctors)
    router.get('/api/get_detail_doctor_by_id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get_schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);


    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)

    router.post('/api/create-new-specialty', specialtyController.createSpecialty)
    router.get('/api/get-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

    router.post('/api/create-new-clinic', clinicController.createClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)

    router.post('/api/create-new-handbook', handbookController.createHandBook)
    router.get('/api/get-handbook', handbookController.getAllHandBook)
    // router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)




    return app.use('/', router)
}
module.exports = initWedRouter;
