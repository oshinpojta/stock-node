const router = require("express").Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/authenticate");

router.get("/login", userController.loginUser);

router.get("/stocks", authMiddleware.authenticateToken, userController.getUserStocks);

router.get("/auth/google/callback", userController.handleGoogleCallback)

router.get("/logout", authMiddleware.authenticateToken, userController.logoutUser);

module.exports = router