const express = require("express");
const router = express.Router();
const usersController = require("../Controller/User.controller");
const modelController = require("../Controller/Model.controller");

router.get("/users", usersController.getUsers);
router.get("/user/:id", usersController.getOneUser);
router.post("/user", usersController.createUser);
router.put("/user", usersController.updateUser)
router.delete("/user/:id", usersController.deleteUser);

router.get("/models", modelController.getModels);
router.get("/model/:id", modelController.getOneModel);
router.post("/model", modelController.createModel);
router.put("/model", modelController.updateModel)
router.delete("/model/:id", modelController.deleteModel);

module.exports = router;