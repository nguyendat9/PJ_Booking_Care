import handbookService from '../service/handbookService';


let createHandBook = async (req, res) => {
    try {
        let infor = await handbookService.createHandBook(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server !!'
        })
    }
}

let getAllHandBook = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandBook();
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server !!'
        })
    }
}

module.exports = {
    createHandBook, getAllHandBook
}