function calculatePrice(details) {
	let newPrice;

	switch (details.size) {
		case "small-15cm":
			newPrice = price;
			toppingPrice();
			break;

		case "medium-20cm":
			newPrice = price + 300;
			toppingPrice();
			break;

		case "large-25cm":
			newPrice = price + 500;
			toppingPrice();
			break;

		case "x-large-30cm":
			newPrice = price + 700;
			toppingPrice();
	}

	function toppingPrice() {
		switch (details.topping) {
			case "none":
				break;

			case "1-number":
				newPrice += 45;
				break;

			case "2-numbers":
				newPrice += 90;
				break;

			case "3-numbers":
				newPrice += 120;
				break;

			case "4-numbers":
				newPrice += 180;
				break;
		}
	}

	return newPrice;
}

module.exports = calculatePrice;
