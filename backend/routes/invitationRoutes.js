const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const invitationController = require("../contollers/invitationController");

router.post("/send", authMiddleware, invitationController.sendInvitation);
router.get("/received", authMiddleware, invitationController.getReceivedInvitations);
router.post("/:invitationId/respond", authMiddleware, invitationController.respondInvitation);

module.exports = router;