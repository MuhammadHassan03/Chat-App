const express = require("express");
const { protect } = require("../middlewares/AuthMiddleware");
const { sendMessage, allMessages } = require("./Controllers/messageControllers");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;