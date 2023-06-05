const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false},
    mail: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
    picture: { type: DataTypes.STRING},
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    about: { type: DataTypes.STRING },
    likes: { type: DataTypes.ARRAY(DataTypes.STRING) },
})

const Model = sequelize.define('model', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    link_photo: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
    price: { type: DataTypes.INTEGER, allowNull: false },
    likes: { type: DataTypes.INTEGER },
    link_download: { type: DataTypes.STRING },
    model3d: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    status_des: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
})

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false },
    like: { type: DataTypes.INTEGER },
})

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Basket_items = sequelize.define('basket_items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Buy = sequelize.define('buy', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Buy_items = sequelize.define('buy_items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})


const License = sequelize.define('license', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})


const Format = sequelize.define('format', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

const Link = sequelize.define('link', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    youtube: { type: DataTypes.STRING },
    vk: { type: DataTypes.STRING },
    tg: { type: DataTypes.STRING },
    twitter: { type: DataTypes.STRING },
    facebook: { type: DataTypes.STRING },
    deviant_art: { type: DataTypes.STRING },
    art_station: { type: DataTypes.STRING },

})
const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: {type: DataTypes.INTEGER, allowNull: false }
})
//////////////////

const Format_model = sequelize.define('format_model', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})
////////////////////////////////
User.hasOne(Basket)
Basket.belongsTo(User)//корзина принадлежит пользователю

User.hasOne(Buy)
Buy.belongsTo(User)

User.hasOne(Link)
Link.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

User.hasMany(Model)
Model.belongsTo(User, { foreignKey: "userId", as: "artist" })
////////////////////////////////
Category.hasMany(Model)
Model.belongsTo(Category)

License.hasOne(Model)
Model.belongsTo(License,{ foreignKey: "licenseId", as: "license" })

Format.belongsToMany(Model, {through: Format_model})
Model.belongsToMany(Format, {through: Format_model})
////////////////////////////////
Buy.hasMany(Basket_items)
Buy_items.belongsTo(Basket)
////////////////////////////////
Basket.hasMany(Basket_items)
Basket_items.belongsTo(Basket)
////////////////////////////////
Model.hasMany(Basket_items)
Basket_items.belongsTo(Model, { foreignKey: "modelId", as: "idmodel" })

Model.hasMany(Buy_items)
Buy_items.belongsTo(Model)

Model.hasMany(Comment)
Comment.belongsTo(Model)

module.exports = {
    User,
    Model,
    Comment,
    Basket,
    Basket_items,
    Format,
    Category,
    License,
    Link,
    Rating,
    Format_model
}


