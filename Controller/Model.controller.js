const db = require("../db")

class ModelController {
    async getModels(req, res) {
        const models = await db.query(`SELECT * FROM model`)
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
        const users = await db.query(`SELECT * FROM users where id = $1`,[id])
        res.json(users[0])
    }
    async updateModel(req, res) {
        const {name, mail, password, username, picture, basket, buy, likes, about, id} = req.body
        const user = await db.query(
            `UPDATE users set name=$1, mail=$2, password=$3, username=$4, picture=$5, basket=$6, buy=$7, likes=$8, about=$9 where id=$10 RETURNING *`,
            [name, mail, password, username, picture, basket, buy, likes, about, id]
        )
        res.json(user[0])
    }
    async deleteModel(req, res) {
        const id = req.params.id
        const user = await db.query(`DELETE FROM users where id = $1`,[id])
        res.json(user[0])
    }
}
module.exports = new ModelController();