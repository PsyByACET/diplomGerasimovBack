const db = require("../db")
const fileService = require("../fileService");
const ApiError = require('../error/ApiError')
const {User, Basket} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {DataTypes} = require("sequelize");
const uuid = require("uuid");
const path = require("path");

const generateJwt = (id, mail, role) => {
    return jwt.sign(
        {id, mail, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async getUsers(req, res) {
        // const users = await db.query(`SELECT * FROM users ORDER BY id `)
        const users = await User.findAndCountAll({
            attributes: ["id", "name", "mail", "password", "username", "picture", "role", "about", "likes"]
        })
        res.json(users)
    }

    async getOneUser(req, res) {
        const id = req.params.id
        const user = await User.findOne({
            attributes: ["id", "name", "mail", "password", "username", "picture", "role", "about", "likes"],
            where: { id: id },
        })
        res.json(user)
    }



    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query(`DELETE FROM users where id = $1`,[id])
        res.json(user[0])
    }
    async registration(req, res, next) {
        const {mail, password, role, name, username} = req.body
        if(!mail || !password) {
            return next(ApiError.badRequest('Некорректный эмейл или пароль'))
        }
        const candidate = await User.findOne({where: {mail}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким mail уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({mail, role, password: hashPassword, name, username})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.mail, user.role)
        return res.json({token})
    }
    async login(req, res, next) {
        const {mail, password} = req.body
        const user = await User.findOne({where: {mail}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.mail, user.role)
        return res.json({token})
    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.mail, req.user.role)
        return res.json({token})
    }

    async updateUser(req, res, next) {
        try {
            const {username, about, id} = req.body

            const {picture} = req.files
            console.log(picture)
            let fileName = uuid.v4() + ".jpg"
            picture.mv(path.resolve(__dirname, '..', 'static/photoUser', fileName))

            const existProduct = await User.findOne({
                attributes: ["id", "username", "picture", "about"],
                where: { id: id },
            });


            let user = await User.update(
                {
                    username: username,
                    picture: fileName,
                    about: about,
                },
                {
                    where: { id: id},
                }
            );
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}
module.exports = new UserController();