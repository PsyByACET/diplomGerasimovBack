const {Category} = require('../models/models')
const ApiError = require('../error/ApiError')

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
}

module.exports = new CategoriesController();