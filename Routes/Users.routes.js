const express = require("express");
const router = express.Router();
const usersController = require("../Controller/User.controller");
const modelController = require("../Controller/Model.controller");
const categoriesController = require("../Controller/Categories.controller");
const licenceController = require("../Controller/License.controller");
const formatController = require("../Controller/Format.controller")
const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer")

const upload = multer({storage:multer.memoryStorage()})


router.post("/registration", usersController.registration);
router.post("/login", usersController.login);
router.get("/auth", authMiddleware, usersController.check);
router.get("/users", usersController.getUsers);
router.get("/user/:id", usersController.getOneUser);
// router.delete("/user/:id", usersController.deleteUser);
router.put("/user", usersController.updateUser)

router.get("/user_models/:userId", modelController.getUserModels);


router.post("/categories", categoriesController.create);
router.get("/categories", categoriesController.getAll);

router.post("/license", licenceController.create);
router.get("/license", licenceController.getAll);
// router.delete("/license/:id", licenceController.delete);

router.post("/formats", formatController.create);
router.get("/formats", formatController.getAll);
// router.delete("/formats/:id", formatController.delete);

router.post("/model", authMiddleware, modelController.create);
router.get("/model", modelController.getAll);
router.put("/model", modelController.updateModel);
router.put("/modelst", modelController.updateStatusModel);
// router.delete("/model/:id", modelController.deleteModel);



router.post("/basket_item", modelController.createBasketItem)
router.get("/basket_items/:basketId", modelController.getAllBasketItems)
router.delete("/basket_items/:basketId", modelController.deleteBasketItem)

router.get("/model/:id", modelController.getOneModel);

module.exports = router;