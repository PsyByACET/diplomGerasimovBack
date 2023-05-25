const db = require("../db")
const uuid = require('uuid')
const path = require('path')
const {Model} = require("../models/models")
const ApiError = require('../error/ApiError')
const {request} = require("express");

class ModelController {
    async getModels(req, res) {
        const models = await db.query(`SELECT * FROM model ORDER BY id`)
        res.json(models)
    }
    async createModel(req, res) {
        const {
            name,
            license,
            link_photo,
            id_artist,
            description,
            categories,
            formats,
            tags,
            price,
            like_count,
            link_download,
            size
        } = req.body
        const models = await db.query(`INSERT INTO model (name, license, link_photo, id_artist, description, categories, formats, tags, price, like_count, link_download, size) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,[
            name,
            license,
            link_photo,
            id_artist,
            description,
            categories,
            formats,
            tags,
            price,
            like_count,
            link_download,
            size
        ])
        res.json(models[0])
    }
    async getOneModel(req, res) {
        const id = req.params.id
        const models = await db.query(`SELECT * FROM model where id = $1`,[id])
        res.json(models[0])
    }
    async updateModel(req, res) {
        const {name, license, link_photo, id_artist, description, categories, formats, tags, price, like_count, link_download, size, id} = req.body
        const model = await db.query(
            `UPDATE model set name=$1, license=$2, link_photo=$3, id_artist=$4, description=$5, categories=$6, formats=$7, tags=$8, price=$9, like_count=$10, link_download=$11, size=$12 where id=$13 RETURNING *`,
            [name, license, link_photo, id_artist, description, categories, formats, tags, price, like_count, link_download, size, id]
        )
        res.json(model[0])
    }
    async deleteModel(req, res, next) {
        const id = req.params.id
        const model = await db.query(`DELETE FROM model where id = $1`,[id])
        res.json(model[0])
    }
    async create(req, res, next) {

        try {

            let {name, license, description, tags, price, likes, size, userId, licenseId, categoryId} = req.body
            const {link_photo} = req.files
            let fileName = uuid.v4() + ".jpg"
            link_photo.mv(path.resolve(__dirname, '..', 'static/photoModel', fileName))

            const {link_download} = req.files
            let fileNameR = uuid.v4() + ".rar"
            link_download.mv(path.resolve(__dirname, '..', 'static/rar', fileNameR))
            console.log('1')
            const {model3d} = req.files
            let fileNameModel = uuid.v4() + ".glb"
            model3d.mv(path.resolve(__dirname, '..', 'static/3dModel', fileNameModel))
            console.log('2')

            let tagsArray = []
            if (Array.isArray(tags)) {
                tagsArray = tags
            } else {
                tagsArray.push(tags)
            }

            console.log('3')
            console.log(link_download)
            console.log('-------------------------------')
            console.log(model3d)
            const model = await Model.create({name, license, description, tags:tagsArray, price, likes, size, userId, categoryId, licenseId, link_photo: fileName, link_download: fileNameR, model3d:fileNameModel})
            console.log('4')
            return res.json(model)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async getAll(req, res) {
        const {categoryId, licenseId} = req.body
        let models;
        if (!categoryId && !licenseId) {
            models = await Model.findAll({attributes: [
                    "id",
                    "name",
                    "link_photo",
                    "description",
                    "tags",
                    "price",
                    "likes",
                    "link_download",
                    "model3d",
                    "size",
                    "userId",
                    "categoryId",
                    "licenseId"
                ]})
        }
        if (categoryId && !licenseId) {
            models = await Model.findAll({where:{categoryId}})
        }
        if (!categoryId && licenseId) {
            models = await Model.findAll({where:{licenseId}})
        }
        if (categoryId && licenseId) {
            models = await Model.findAll({where:{categoryId, licenseId}})
        }
        return res.json(models)
    }

    async getOne(req, res) {

    }

}
module.exports = new ModelController();