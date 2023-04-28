const mongoose = require("mongoose");
let userSchama = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email harus diisi"],
      unique: [true, "Email sudah digunakan"],
    },
    name: {
      type: String,
      require: [true, "Nama harus diisi"],
    },
    password: {
      type: String,
      require: [true, "Password harus diisi"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    phoneNumber: {
      type: String,
      require: [true, "Nomor telpon harus diisi"],
      minlength: [9, "Panjang nomor telpon harus antara 9 - 13 karakter"],
      maxlength: [13, "Panjang nomor telpon harus antara 9 - 13 karakter"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchama);
