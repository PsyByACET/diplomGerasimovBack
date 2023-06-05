const { Format} = require("../models/models");

class FormatController {
    async create(req, res) {
        const {name} = req.body
        const format = await Format.create({name})
        return res.json(format)
    }
    async getAll(req, res) {
        const licenses = await Format.findAll({attributes: ["id", "name"]})
        return res.json(licenses)
    }
}

module.exports = new FormatController();