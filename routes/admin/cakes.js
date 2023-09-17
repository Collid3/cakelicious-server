const router = require("express").Router();
const cakesController = require("../../controllers/cakesController");
const roles = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJWT = require("../../middleware/verifyJWT");

router
	.route("/")
	.get(cakesController.allCakes)
	.post(verifyJWT, verifyRoles([roles.Admin]), cakesController.addCake)
	.delete(verifyJWT, verifyRoles([roles.Admin]), cakesController.deleteAllCakes);

router
	.route("/:id")
	.get(cakesController.oneCake)
	.put(verifyJWT, verifyRoles([roles.Admin]), cakesController.updateCake)
	.delete(verifyJWT, verifyRoles([roles.Admin]), cakesController.deleteCake);

module.exports = router;
