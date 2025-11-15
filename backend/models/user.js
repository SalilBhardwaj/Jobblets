const mongoose = require("mongoose");
const { createHash, randomBytes } = require("crypto");
const tokenUtils = require("../utils/token");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    profile_complete: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be 10 digits"],
    },
    role: {
      type: String,
      enum: ["worker", "client", "admin"],
      default: "worker",
    },
    address: {
      address: { type: String },
      pincode: { type: String },
      location: pointSchema,
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dwadgr8xu/image/upload/v1752552411/blue-circle-with-white-user_78370-4707_sdbdrj.avif",
    },
  },
  { timestamps: true }
);

userSchema.index({ "address.location": "2dsphere" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = randomBytes(10);
  const hash = createHash("sha256", salt);
  const hashedPassword = hash.update(this.password).digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("validateUserLogin", async function (email, phone, password) {
  let user;
  // console.log(email, phone, password);
  if (email) user = await this.findOne({ email: email });
  else user = await this.findOne({ phone: phone });
  // console.log(user, typeof user);
  if (!user) {
    throw new Error("User not found!");
  }
  const hash = createHash("sha256", user.salt);
  const hashedPassword = hash.update(password).digest("hex");
  if (hashedPassword !== user.password) {
    throw new Error("Incorrect Password");
  }
  const payload = {
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    phone: user.phone,
    id: user._id,
    role: user.role,
    address: user.address,
  };
  const token = tokenUtils.createToken(payload);
  const responsePayload = {
    user: {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      phone: user.phone,
      id: user._id,
      role: user.role,
      address: user.address,
    },
    token: token,
  };
  return responsePayload;
});
const User = mongoose.model("User", userSchema);
module.exports = User;
