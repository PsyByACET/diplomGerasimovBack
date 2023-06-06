const {License} = require('../models/models')
const ApiError = require('../error/ApiError')

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
}

module.exports = new LicenseController();