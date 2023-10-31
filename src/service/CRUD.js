import bcrypt from 'bcryptjs';
import db from '../models';
import { where } from 'sequelize';
import { raw } from 'mysql2';
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hasPasswordBcrypt = await hashUserPassword(data.password);
            await db.Users.create({
                email: data.email,
                password: hasPasswordBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roles: data.roles,
                phoneNumber: data.phoneNumber,
            })
            resolve('ok')
        } catch (e) {
            reject(e)
        }
    })
}
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
let GetAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = db.Users.findAll({ raw: true });
            resolve(user)
        } catch (e) {
            reject(e)
        }
    })
}

let GetIDUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user)
            } else {
                resolve([])
            }

        } catch (e) {
            reject(e)
        }
    })
}


let UpdateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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

                    await user.save();
                let AllUser = await db.User.findAll();
                resolve(AllUser)
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}

let DeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },

            })
            if (user) {
                await user.destroy()
            }
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}








module.exports = { createNewUser, GetAllUser, GetIDUser, UpdateUser, DeleteUser }