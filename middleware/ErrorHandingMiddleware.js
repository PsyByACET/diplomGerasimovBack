const ApiError = require('../error/ApiError')

module.exports = function (err, req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*"); // Здесь можно указать конкретный домен, с которого разрешены запросы
    // res.header(
    //     "Access-Control-Allow-Methods",
    //     "GET, POST, PUT, DELETE, OPTIONS"
    // ); // Перечислите разрешенные методы запросов
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // ); // Перечислите разрешенные заголовки запросов
    //
    // if (req.method === "OPTIONS") {
    //     res.sendStatus(200); // Отправляем успешный ответ для запросов OPTIONS
    // } else {
    //     next(); // Передаем обработку запроса следующему middleware
    // }
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: "непредвиденная ошибка"})
}