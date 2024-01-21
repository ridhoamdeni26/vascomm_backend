var express = require("express");
var router = express.Router();

const userHandler = require("./handler/users");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", userHandler.register);
router.post("/login", userHandler.login);
router.get("/get-user", verifyToken, userHandler.getUser);
router.put("/update-user/:id", verifyToken, userHandler.update);
router.delete("/deleted-user/:id", verifyToken, userHandler.deleted);

module.exports = router;
