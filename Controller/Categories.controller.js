const {Category} = require('../models/models')
const ApiError = require('../error/ApiError')
const db = require("../db");

class CategoriesController {
    async create(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        const {name} = req.body
        const category = await Category.create({name})
        return res.json(category)
    }
    async getAll(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        const categories = await Category.findAll()
        return res.json(categories)
    }
    async delete(req, res, next) {
        const id = req.params.id
        const model = await db.query(`DELETE FROM category where id = $1`,[id])
        res.json(model[0])
    }
}

module.exports = new CategoriesController();