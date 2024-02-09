const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    Unit: { type: String, required: true },
    Selling_Price: { type: String, required: true },
    image: {
      type: String,
      default: null,
    },
    Account: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      default: null,
    },
    provider:{type: mongoose.Schema.Types.ObjectId, ref: "provider",required:true

    }
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", ProductSchema);
