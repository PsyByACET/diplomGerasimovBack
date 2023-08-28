const db = require("../db")
const uuid = require('uuid')
const path = require('path')
const {Model, Basket_items, User, License, Basket, Model_format, Format_model, Format, Category} = require("../models/models")
const ApiError = require('../error/ApiError')
const { Op, DataTypes} = require("sequelize");
const multer = require("multer")


const {errors} = require("pg-promise");



class ModelController {

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


    async deleteModel(req, res, next) {
        const id = req.params.id
        const model = await db.query(`DELETE FROM model where id = $1`,[id])
        res.json(model[0])
    }
    async create(req, res, next) {

        try {
            let {name, license, description, tags, price, likes, size, status, licenseId, categoryId, formatArr} = req.body

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
            console.log(model.dataValues.id)
            const model_format = await Model_format.create({modelId: model.dataValues.id})
            formatArr.forEach((f)=> {
                 Format_model.create({modelFormatId:model_format.id, formatId:f})
            })

            console.log("test")
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

                            },

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
            let {name, description, tags, price, likes, size, status, licenseId, categoryId, id} = req.body

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
                    description: description,
                    tags: tagsArray,
                    price: price,
                    likes: likes,
                    status: status,
                    status_des: "dasdsadasd",
                    size: size,
                    categoryId: categoryId,
                    licenseId: licenseId,
                    link_photo: fileName,
                    link_download: fileNameR,
                    model3d:fileNameModel
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

    async updateStatusModel(req, res, next) {
        try {
            const {name,  link_photo, description, tags, price, likes, link_download, model3d, status, status_des, size, categoryId, licenseId, id} = req.body



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
                    tags: tags,
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
                "status",
                "status_des",
                "model3d",
                "size",
                "categoryId",
            ],
            where: {
                [Op.and]: [
                    userId && {userId},
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
                {
                    model: Category,
                    as: "category",
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
            const {categoryId, licenseId, formatId, searchField, status, sort} = req.query
            let models = await Model.findAll({
                attributes: [
                    "id",
                    "name",
                    "link_photo",
                    "description",
                    "tags",
                    "price",
                    "likes",
                    "status_des",
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
                        // formatId && { "$model_formats.format_models.formatId$": formatId },
                        // formatId && {
                        //     "$model_formats.format_models.formatId$": {
                        //         [Op.in]: formatId
                        //     }
                        // },
                        formatId && {
                            "$model_formats.format_models.formatId$": {
                                [Op.in]: Array.isArray(formatId) ? formatId : [formatId]
                            }
                        },
                        // formatId && {
                        //     "$model_formats.format_models.formatId$": {
                        //         [Op.any]: {
                        //             [Op.contains]: formatId
                        //         }
                        //     }
                        // },
                        searchField && {
                            [Op.or]:[
                                {name: { [Op.iLike]: `%${searchField}%`}},
                                {tags: { [Op.contains]: [searchField.toLowerCase()] }},
                            ]
                        },
                    ],
                },
                order:
                    sort === "pricedown"
                        ? [["price", "DESC"]]
                        : sort === "priceup"
                            ? [["price"]]
                            : sort === "alphabetdown"
                                ? [["name", "DESC"]]
                                : [["name"]],

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
                    {
                        model: Category,
                        as: "category",
                        attributes: [
                            "id",
                            "name",
                        ],
                    },
                    {
                        model: Model_format,

                        attributes: [
                            "id",
                            "modelId",
                        ],
                        include: [
                            {
                                model: Format_model,
                                attributes: [
                                    "id",
                                    "modelFormatId",
                                    "formatId"
                                ],
                                include: [
                                    {
                                        model: Format,
                                        as: "idformat",
                                        attributes: [
                                            "id",
                                            "name"
                                        ]
                                    }
                                ]
                            }
                        ]
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