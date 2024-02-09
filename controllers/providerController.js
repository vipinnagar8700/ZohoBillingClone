const { provider, User } = require("../models/userModel");
const asyncHandler = require("express-async-handler");
require("dotenv/config");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});



const Allproviders = async (req, res) => {
  try {
    const provideres = await provider.find()
      .select("-password")
     .sort({ createdAt: -1 }); // Exclude the 'password' field;
    const length = provideres.length;
    res.status(200).json([
      {
        message: "All provider data retrieved successfully!",
        data: provideres,
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



const editprovider = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const providerData = await provider.findOne({ user_id: id }).select('-password');
    console.log(providerData); // Exclude the 'password' field
    if (!providerData) {
      res.status(404).json({
        // Correct the status code to 404 (Not Found)
        message: "provider was not found!",
        success: false,
      });
    } else {
      res.status(200).json({
        // Correct the status code to 200 (OK)
        message: "Data successfully Retrieved!",
        success: true,
        data: providerData,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve Data!",
      success: false, // Correct the key to 'success'
    });
  }
};

const Updateprovider = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const imageFile = req.files["image"]; // Use req.files to get multiple files
  

  if (imageFile) {
    try {
      const result = await cloudinary.uploader.upload(imageFile[0].path, {
        folder: "Zoho", // Optional: You can specify a folder in your Cloudinary account
        resource_type: "auto", // Automatically detect the file type
      });

      updateData.image = result.secure_url;
      console.log("Updated Image:", updateData.image);

      // Optional: Delete the local file after successfully uploading to Cloudinary
      // fs.unlinkSync(imageFile[0].path);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      // Handle the error appropriately
    }
  } else {
    console.log("No image file found in req.files");
  }

 
  delete updateData.role;

  try {
    const finding = await provider.findOne({ user_id: id });
    const editprovider = await provider.findByIdAndUpdate(finding._id, updateData, {
      new: true,
    }).select("-password");

    if (!editprovider) {
      res.status(200).json({
        message: "provider was not found!",
        status: false,
      });
    } else {
      res.status(201).json({
        message: "Data successfully updated!",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update data!",
      status: false,
    });
  }
};



const deleteprovider = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the provider by ID
    const provider = await provider.findById(id);

    if (!provider) {
      return res.status(200).json({
        message: "provider was not found!",
      });
    }

    if (provider.role === "admin") {
      return res.status(403).json({
        message: "Admin provider cannot be deleted.",
        status: false,
      });
    }

    // If the provider is not an admin, proceed with the deletion
    const deletedprovider = await provider.findByIdAndDelete(id);

    if (!deletedprovider) {
      return res.status(200).json({
        message: "provider was not found!",
      });
    } else {
      return res.status(201).json({
        message: "Data successfully deleted!",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete data!",
      status: false,
    });
  }
};








module.exports = {
  Allproviders,
  editprovider,
  Updateprovider,
  deleteprovider,
};
