import userService from '../service/userService';



let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;


    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: '<<< Opps! ... Errorr !!....'
        })
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}

    })


}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id; //ALL, id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Erorr missing required params',
            user: []
        })
    }

    let user = await userService.getAllUser(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        user
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.UpdateUser(data);
    return res.status(200).json(message)

}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'missing required params'
        })
    }
    let message = await userService.DeleteUser(req.body.id);
    return res.status(200).json(message);
}

let GetAllCode = async (req, res) => {
    try {
        let data = await userService.GetAllCodeService(req.query.type);
        return res.status(200).json(data);

    } catch (e) {
        console.log('get all code:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = { handleLogin, handleGetAllUser, handleCreateNewUser, handleEditUser, handleDeleteUser, GetAllCode }