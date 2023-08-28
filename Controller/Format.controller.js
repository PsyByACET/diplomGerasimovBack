const { Format} = require("../models/models");
const db = require("../db");

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
    async delete(req, res, next) {
        const id = req.params.id
        const model = await db.query(`DELETE FROM format where id = $1`,[id])
        res.json(model[0])
    }
}

module.exports = new FormatController();