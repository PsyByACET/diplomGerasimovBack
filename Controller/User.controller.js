const db = require("../db")
class UserController {
    async getUsers(req, res) {
        const users = await db.query(`SELECT * FROM users ORDER BY id`)
        res.json(users)
    }

    async createUser(req, res) {
        const {name, mail, password, username, picture, basket, buy, likes, about
        } = req.body
        const users = await db.query(`INSERT INTO users (name, mail, password, username, picture, basket, buy, likes, about) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,[name, mail, password, username, picture, basket, buy, likes, about
        ])
        res.json(users[0])
    }

    async getOneUser(req, res) {
        const id = req.params.id
        const users = await db.query(`SELECT * FROM users where id = $1`,[id])
        res.json(users[0])
    }
    async updateUser(req, res) {
        const {name, mail, password, username, picture, basket, buy, likes, about, id} = req.body
        const user = await db.query(
            `UPDATE users set name=$1, mail=$2, password=$3, username=$4, picture=$5, basket=$6, buy=$7, likes=$8, about=$9 where id=$10 RETURNING *`,
            [name, mail, password, username, picture, basket, buy, likes, about, id]
        )
        res.json(user[0])
    }
    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query(`DELETE FROM users where id = $1`,[id])
        res.json(user[0])
    }

}
module.exports = new UserController();