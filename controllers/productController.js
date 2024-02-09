const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

require("dotenv/config");
const multer = require("multer");

// Multer configuration
const storage = multer.diskStorage({
  destination: "./public/images", // Specify the destination folder
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (optional)
});

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

const AddProducts = asyncHandler(async (req, res) => {
  const { type, name, Unit, Selling_Price, Account, Description, provider } =
    req.body;
  console.log(type, name, Unit, Selling_Price, Account, Description, provider);
  let imageUrl; // to store the Cloudinary image URL

  const file = req.file;

  if (file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Products", // Specify your Cloudinary folder
        resource_type: "auto",
      });
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }

  const existingProduct = await Product.findOne({ name: name });

  if (!existingProduct) {
    const newProduct = await Product.create({
      name: name,
      type,
      Unit,
      Selling_Price,
      Account,
      Description,
      provider,
      image: imageUrl, // add the Cloudinary image URL to the newProduct object
    });

    res.status(201).json({
      message: "Product Successfully Added!",
      success: true,
    });
  } else {
    const message =
      existingProduct.name === name
        ? "Name is already exists."
        : "Product with the same title already exists.";

    res.status(409).json({
      message,
      success: false,
    });
  }
});

const AllProducts = async (req, res) => {
  try {
    const patients = await Product.find()
      .populate("provider")
      .sort({ createdAt: -1 }); // Exclude the 'password' field;
    const length = patients.length;
    res.status(200).json([
      {
        message: "All Products data retrieved successfully!",
        data: patients,
        status: true,
        length,
      },
    ]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const editProduct = await Product.findById(id)
      .populate("provider")
      // Exclude the 'password' field
    if (!editProduct) {
      res.status(200).json({
        message: "Product was not found!",
      });
    } else {
      res.status(201).json({
        message: "Data successfully Retrieved!",
        success: true,
        data: editProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve Data!",
      status: false,
    });
  }
};

const UpdateProducts = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body

  // Make sure to exclude the 'role' field from the updateData

  try {
    const editProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!editProduct) {
      res.status(200).json({
        message: "Product was not found!",
      });
    } else {
      res.status(201).json({
        message: "Data successfully updated!",
        success: true,
        data: editProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update data!",
      status: false,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const editProduct = await Product.findByIdAndDelete(id); // Exclude the 'password' field
    if (!editProduct) {
      res.status(200).json({
        message: "Product was not found!",
      });
    } else {
      res.status(201).json({
        message: "Data successfully Deleted!",
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to Deleted Data!",
      status: false,
    });
  }
};

module.exports = {
  AddProducts,
  AllProducts,
  editProduct,
  UpdateProducts,
  deleteProduct,
};
