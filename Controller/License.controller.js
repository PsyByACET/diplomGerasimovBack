const {License} = require('../models/models')
const ApiError = require('../error/ApiError')
const db = require("../db");

class LicenseController {
    async create(req, res) {
        // res.setHeader('Access-Control-Allow-Origin', '*');
        const {name} = req.body
        const license = await License.create({name})
        return res.json(license)
    }
    async getAll(req, res) {
        // res.setHeader('Access-Control-Allow-Origin', '*');
        const licenses = await License.findAll({attributes: ["id", "name"]})
        return res.json(licenses)
    }
    async delete(req, res, next) {
        const id = req.params.id
        const model = await db.query(`DELETE FROM license where id = $1`,[id])
        res.json(model[0])
    }
}

module.exports = new LicenseController();