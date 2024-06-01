const express = require("express");
const {registerUser, authUser, allUsers} = require("../routes/Controllers/userControllers");
const {protect} = require("../middlewares/AuthMiddleware")


const router = express.Router();


router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser)

module.exports = router;