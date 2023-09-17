const router = require("express").Router();
const CartController = require("../controllers/CartController");

router
	.route("/")
	.get(CartController.getAllItems)
	.post(CartController.addItem)
	.delete(CartController.clearAllItem);

router.route("/:id").delete(CartController.deleteItem).put(CartController.updateItems);

module.exports = router;
