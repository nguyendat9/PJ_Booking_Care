import db from '../models/index';
import CRUD from '../service/CRUD';

let getHomePage = async (req, res) => {
    try {
        let data = await db.Users.findAll();

        return res.render('HomePage.ejs', { data: JSON.stringify(data) })

    } catch (e) {
        console.log(e)
    }


}
let getAPI = async (req, res) => {
    return res.render('API.ejs')
}
let Post_API = async (req, res) => {
    let message = await CRUD.createNewUser(req.body);
    console.log('ok', message)
    return res.send('Create new User Successful !!!')
}
let Get_Read = async (req, res) => {
    let data = await CRUD.GetAllUser();

    // console.log(data)

    return res.render('get_Read.ejs', {
        dataTable: data
    })
}
let Get_Edit = async (req, res) => {
    let userId = req.params.id;
    if (userId) {
        let userData = await CRUD.GetIDUser(userId);

        return res.render('edit.ejs', { user: userData });
    } else {
        return res.send('Opps! Error not user !!!')
    }


}

let Put_API = async (req, res) => {
    let data = req.body;
    let AllUser = await CRUD.UpdateUser(data);
    return res.render('get_Read.ejs', {
        dataTable: AllUser
    })

}
let Delete_API = async (req, res) => {
    let id = req.params.id;
    if (id) {
        await CRUD.DeleteUser(id)

        return res.send('Delete user success ')
    } else {
        return res.send('Opps errorr')
    }


}
module.exports = { getHomePage, getAPI, Post_API, Get_Read, Get_Edit, Put_API, Delete_API }