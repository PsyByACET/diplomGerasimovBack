const db = require("../db")
const uuid = require('uuid')
const path = require('path')
const {Model, Basket_items, User, License} = require("../models/models")
const ApiError = require('../error/ApiError')
const { Op, DataTypes} = require("sequelize");

class ModelController {
    async getModels(req, res) {
        const models = await db.query(`SELECT * FROM model ORDER BY id`)
        res.json(models)
    }
    async getOneModel(req, res) {
        const idn = req.params.id
        // const models = await db.query(`SELECT * FROM model where id = $1`,[id])
        const model = await Model.findOne({
            where: {
                id:idn
            }
        })
        // res.json(models[0])
        return res.json(model)

    }
    // async updateModel(req, res) {
    //     const {name, license, link_photo, id_artist, description, categories, formats, tags, price, like_count, link_download, size, id} = req.body
    //     const model = await db.query(
    //         `UPDATE model set name=$1, license=$2, link_photo=$3, id_artist=$4, description=$5, categories=$6, formats=$7, tags=$8, price=$9, like_count=$10, link_download=$11, size=$12 where id=$13 RETURNING *`,
    //         [name, license, link_photo, id_artist, description, categories, formats, tags, price, like_count, link_download, size, id]
    //     )
    //     res.json(model[0])
    // }
    async deleteModel(req, res, next) {
        const id = req.params.id
        const model = await db.query(`DELETE FROM model where id = $1`,[id])
        res.json(model[0])
    }
    async create(req, res, next) {

        try {
            let {name, license, description, tags, price, likes, size, status, licenseId, categoryId} = req.body
            const {link_photo} = req.files
            let fileName = uuid.v4() + ".jpg"
            link_photo.mv(path.resolve(__dirname, '..', 'static/photoModel', fileName))

            const {link_download} = req.files
            let fileNameR = uuid.v4() + ".rar"
            link_download.mv(path.resolve(__dirname, '..', 'static/rar', fileNameR))

            const {model3d} = req.files
            let fileNameModel = uuid.v4() + ".glb"
            model3d.mv(path.resolve(__dirname, '..', 'static/3dModel', fileNameModel))

            let tagsArray = []
            if (Array.isArray(tags)) {
                tagsArray = tags
            } else {
                tagsArray.push(tags)
            }

            const model = await Model.create({name, license, description, tags:tagsArray, price, likes, size, userId: req.user.id, categoryId, licenseId, status, link_photo: fileName, link_download: fileNameR, model3d:fileNameModel})
            return res.json(model)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async createBasketItem(req, res, next) {
        try {
            let {basketId, modelId} = req.body
            const model = await Basket_items.create({basketId:basketId, modelId:modelId})
            return res.json(model)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllBasketItems (req, res, next) {
        try {
            const {basketId} = req.params
            let items = await Basket_items.findAll( {
                attributes: [
                    "id",
                    "basketId"
                ],
                where: {
                    basketId: basketId,
                },
                include: [
                    {
                        model: Model,
                        as: "idmodel",
                        attributes: [
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

                        ],
                        include: [
                            {
                                model: User,
                                as: "artist",
                                attributes: [
                                    "id",
                                    "name",
                                    "mail",
                                    "username",
                                    "picture",
                                    "role",
                                    "about",
                                    "likes",
                                ],
                            }
                        ],
                    },
                ],
            })
            return res.json(items)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteBasketItem (req, res) {
        const {basketId} = req.params
        // const product = await Basket_items.findOne({
        //     where: { id: basketId },
        // });
        //
        // if (!product) {
        //     throw new Error("There is no such product with this id to delete");
        // }
        await Basket_items.destroy({
            where: { id: basketId },
        });
        return res.json("удалено")
    }

    async updateModel(req, res, next) {
        try {
            const {name,  link_photo, description, tags, price, likes, link_download, model3d, status, status_des, size, categoryId, licenseId, id} = req.body

            let tagsArray = []
            if (Array.isArray(tags)) {
                tagsArray = tags
            } else {
                tagsArray.push(tags)
            }

            const existProduct = await Model.findOne({
                attributes: ["id", "name", "link_photo", "description", "tags", "price", "likes", "link_download", "model3d", "status", "status_des", "size", "categoryId", "licenseId"],
                where: { id: id },
            });
            if (!existProduct) {
                throw new Error("There is no product with this id");
            }
            if (existProduct.status === "closed") {
                throw new Error("Status is closed. You can't change product anymore");
            }
            let model = await Model.update(
                {
                    name: name,
                    link_photo: link_photo,
                    description: description,
                    tags: tagsArray,
                    price: price,
                    likes: likes,
                    link_download: link_download,
                    model3d: model3d,
                    status: status,
                    status_des: status_des,
                    size: size,
                    categoryId: categoryId,
                    licenseId: licenseId,
                },
                {
                    where: { id: id},
                }
            );
            return res.json(model)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }



    async getUserModels (req, res) {
        const {userId} = req.params

        let models = await Model.findAll({
            attributes: [
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
                "categoryId",
            ],
            where: {
                userId: userId
            },
            include: [
                {
                    model: User,
                    as: "artist",
                    attributes: [
                        "id",
                        "name",
                        "mail",
                        "username",
                        "picture",
                        "role",
                        "about",
                        "likes",
                    ],
                },
                {
                    model: License,
                    as: "license",
                    attributes: [
                        "id",
                        "name",
                    ],
                },

            ],
        })

        return res.json(models)
    }

    async getAll(req, res, next) {
        try {

            const {categoryId, licenseId, searchField, status} = req.query
            let models = await Model.findAll({
                attributes: [
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
                    "categoryId",
                ],
                where: {
                    [Op.and]: [
                        status && { status: status },
                        categoryId && { categoryId: categoryId },
                        licenseId && { licenseId: licenseId },
                        searchField && {
                            [Op.or]:[
                                {name: { [Op.iLike]: `%${searchField}%`}},
                                {tags: { [Op.contains]: [searchField.toLowerCase()] }},
                            ]
                        },
                    ],
                },
                include: [
                    {
                        model: User,
                        as: "artist",
                        attributes: [
                            "id",
                            "name",
                            "mail",
                            "username",
                            "picture",
                            "role",
                            "about",
                            "likes",
                        ],
                    },
                    {
                        model: License,
                        as: "license",
                        attributes: [
                            "id",
                            "name",
                        ],
                    },

                ],
            })

            return res.json(models)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}
module.exports = new ModelController();