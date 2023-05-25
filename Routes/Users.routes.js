const express = require("express");
const router = express.Router();
const usersController = require("../Controller/User.controller");
const modelController = require("../Controller/Model.controller");
const categoriesController = require("../Controller/Categories.controller");
const licenceController = require("../Controller/License.controller")
const authMiddleware = require("../middleware/authMiddleware")



router.post("/registration", usersController.registration);
router.post("/login", usersController.login);
router.get("/auth", authMiddleware, usersController.check);


router.post("/categories", categoriesController.create);
router.get("/categories", categoriesController.getAll);

router.post("/license", licenceController.create);
router.get("/license", licenceController.getAll);

router.post("/model", modelController.create);
router.get("/model", modelController.getAll);

// router.post("/categories", usersController.login);
////
router.get("/users", usersController.getUsers);
router.get("/user/:id", usersController.getOneUser);
router.post("/user", usersController.createUser);
router.put("/user", usersController.updateUser)
router.delete("/user/:id", usersController.deleteUser);

router.get("/models", modelController.getModels);
router.get("/model/:id", modelController.getOneModel);
// router.post("/model", modelController.createModel);
router.put("/model", modelController.updateModel)
router.delete("/model/:id", modelController.deleteModel);

module.exports = router;