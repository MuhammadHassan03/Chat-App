const express = require("express");
const { protect } = require("../middlewares/AuthMiddleware");
const {acessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("./Controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, acessChat).get(protect, fetchChat)
router.route("/group").post(protect, createGroupChat)
router.route("/renameGroup").put(protect, renameGroup);
router.route("/removeFromGroup").put(protect, removeFromGroup);
router.route("/addtogroup").put(protect, addToGroup);

module.exports = router;