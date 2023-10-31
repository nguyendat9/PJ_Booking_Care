import db from "../models/index";
require('dotenv').config();


let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                // || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                //  
                resolve({
                    errCode: 1,
                    errMessage: 'Lỗi đường dẫn. Không thể tìm thấy đường dẫn này !!'
                })
            } else {
                await db.Handbooks.create({
                    name: data.name,
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


let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbooks.findAll({

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

module.exports = {
    createHandBook, getAllHandBook
}