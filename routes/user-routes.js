const router = require("express").Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/authenticate");

router.get("/login", userController.getUser);

router.get("/logout", authMiddleware.authenticateToken, userController.logoutUser);

module.exports = router