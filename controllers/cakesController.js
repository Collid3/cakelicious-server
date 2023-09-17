const Cakes = require("../model/Cake");
const cloudinary = require("../config/cloudinary");

const allCakes = async (req, res) => {
  const cakes = await Cakes.find();
  return res.json({ cakes });
};

const oneCake = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Invalid Id" });
  }
  const cake = await Cakes.findOne({ _id: id }).exec();
  res.json({ cake });
};

const addCake = async (req, res) => {
  const { name, price, category, description, image } = req.body;
  if (!name || !price || !description || !category) {
    return res
      .status(400)
      .json({ error: "Name, price, category and description are required" });
  }

  try {
    const duplicate = await Cakes.findOne({ name: name }).exec();
    if (duplicate) {
      return res
        .status(401)
        .json({ error: "Cake with the name " + name + " already exists" });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "cakes",
    });

    if (!result) return;

    const newCake = {
      name,
      price,
      description,
      category,
      image: image
        ? {
            public_id: result.public_id,
            url: result.secure_url,
          }
        : "",
    };

    const response = await Cakes.create(newCake);
    res.status(201).json(response);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateCake = async (req, res) => {
  const { id } = req.params;

  const cake = await Cakes.findOne({ _id: id }).exec();
  if (!cake) {
    return res.status(401).json({ error: "Cake not found" });
  }

  if (req.body.name !== cake.name) cake.name = req.body.name;
  if (req.body.price !== cake.price) cake.price = req.body.price;
  if (req.body.category !== cake.category) cake.category = req.body.category;
  if (req.body.description !== cake.description)
    cake.description = req.body.description;
  if (req.body.image === "delete") {
    await cloudinary.uploader.destroy(cake.image.public_id);
    cake.image = { public_id: "default", url: "default" };
  } else if (
    (!req.body.image?.public_id || !req.body.image?.url) &&
    req.body.image !== ""
  ) {
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: "cakes",
      public_id: id,
    });
    cake.image = { public_id: result.public_id, url: result.url };
  }

  const result = await cake.save();
  return res.json(result);
};

const deleteCake = async (req, res) => {
  const { id } = req.params;

  const cake = await Cakes.findOne({ _id: id }).exec();
  if (!cake) return res.status(401).json({ error: "Cake not found" });

  await cloudinary.uploader.destroy(cake.image.public_id);
  const response = await Cakes.deleteOne({ _id: id });
  return res.json(response);
};

const deleteAllCakes = async (req, res) => {
  const response = await Cakes.deleteMany({});
  res.json({ response });
};

module.exports = {
  allCakes,
  oneCake,
  addCake,
  updateCake,
  deleteCake,
  deleteAllCakes,
};
