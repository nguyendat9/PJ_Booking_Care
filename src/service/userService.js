import { Association } from 'sequelize';
import db from '../models/index';
import bcrypt, { hash } from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user da ton tai
                let user = await db.Users.findOne({
                    attributes: ['id', 'email', 'roles', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    //check xem nguoi dung co ton tai khong
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0,
                            userData.errMessage = 'ok',
                            delete user.password,
                            userData.user = user;

                    } else {
                        userData.errCode = 3,
                            userData.errMessage = 'Wrong password !!'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `user not found`;


                }

            } else {
                //return err
                userData.errCode = 1;
                userData.errMessage = `pls try other email`;


            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { email: userEmail },
                raw: true
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = '';
            if (userId === 'ALL') {
                user = db.Users.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } if (userId && userId !== 'ALL') {
                user = db.Users.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(user)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email co ton tai khong
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'email da ton tai'
                })
            } else {
                let hasPasswordBcrypt = await hashUserPassword(data.password);
                await db.Users.create({
                    email: data.email,
                    password: hasPasswordBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roles: data.roles,
                    phoneNumber: data.phoneNumber,
                    positionId: data.positionId,
                    image: data.avatar
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let DeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'Nguoi dung khong ton tai'
                })
            }
            await user.destroy();
            resolve({
                errCode: 0,
                errMessage: 'user is deleted success !'
            })
        } catch (e) {
            reject(e)
        }
    })
}
let UpdateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roles || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing requered params'
                })
            }
            let user = await db.Users.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {

                user.email = data.email,
                    user.password = data.password,
                    user.firstName = data.firstName,
                    user.lastName = data.lastName,
                    user.address = data.address,
                    user.phoneNumber = data.phoneNumber,
                    user.roles = data.roles,
                    user.positionId = data.positionId,
                    user.gender = data.gender,
                    user.image = data.avatar

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update user succedss !'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found !'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
let GetAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'missng req params !'
                })
            } else {
                let res = {};
                let allCode = await db.Allcodes.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res)
            }

        } catch (e) {
            reject(e)
        }
    })
}
module.exports = { handleUserLogin, checkUserEmail, getAllUser, createNewUser, DeleteUser, UpdateUser, GetAllCodeService }