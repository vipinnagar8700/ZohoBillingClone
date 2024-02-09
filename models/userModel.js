const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    otp:String,
    // Common user fields
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    permission: {
      type: Boolean,
      default: false,
    },
  
    address: String,
    city: String,
    state: String,
    refreshToken: String,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["admin", "customer", "provider","subadmin"],
      required: true,
    },
    image: {
      default: null,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // Corrected variable name
  console.log("Generated Reset Token:", resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};



const User = mongoose.model("User", userSchema);

const customerSchema = new mongoose.Schema(
  {
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "provider",required:true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // customer-specific fields
    Salutaion: String,
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    
    status: {
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
  },
    address: String,
    city: String,
    state: String,
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    company_Name: {
      type: String,
      default: null,
    },
    FullName: {
      type: String,
      default: null,
    },
    PAN : {
      type: String,
      default: null,
    },
    Currency: {
      type: String,
      default: null,
    },
    Payment_Terms
: {
      type: String,
      default: null,
    },
    Enable_Portal: {
      type: String,
      default: null,
    },
    Portal_Language : {
    type: String
   
    },
    dob: {
      type: String,
      default: null,
    },
    pincode: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    Documents:{
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);


const providerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Pharmacy-specific fields
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    permission: {
      type: Boolean,
      default: false,
    },
    company_Name :{
      type:String,
      default:null
    },
    GSTIN :{
      type:String,
      default:null
    },
    Currency:{
      type:String,
      default:null
    },
    fiscal_Year:{
      type:String,
      default:null
    },
    Industry_Type:{
      type:String,
      default:null
    },
    biling_Process:{
      type:String,
      default:null
    },
    current_bill:{
      type:String,
      default:null
    },
    import_data:{
      type:String,
      default:null
    },
    Language:{
      type:String,
      default:null
    },
    Time_zone:{
      type:String,
      default:null
    },
    Date_format:{
      type:String,
      default:null
    },
    Company_ID:{
      type:String,
      default:null
    },
    Tax_ID:{
      type:String,
      default:null
    },
    Label_Details:{
      type:String,
      default:null
    },
    Organization_Logo:{
      type:String,
      default:null
    },
    subscription:{
      type:String,
      default:null
    },
    status: {
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
  },
    dob: {
      type: String,
      default: null,
    },
    address: String,
    city: String,
    state: String,
  
   
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    Pincode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const customer = mongoose.model("customer", customerSchema);
const provider = mongoose.model("provider", providerSchema);

module.exports = {User,  customer, provider };
