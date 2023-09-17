const router = require("express").Router();
const usersController = require("../../controllers/usersController");

router
	.route("/")
	.get(usersController.allUsers)
	.post(usersController.addUser)
	.put(usersController.updateUser)
	.delete(usersController.deleteAllUsers);

router.route("/:id").get(usersController.oneUser).delete(usersController.deleteUser);

module.exports = router;
