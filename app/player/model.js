const mongoose = require("mongoose");
let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email harus diisi"],
      unique: [true, "Email sudah digunakan"],
    },
    name: {
      type: String,
      require: [true, "Nama harus diisi"],
      minlength: [3, "Panjang nama harus antara 3 - 225 karakter"],
      maxlength: [225, "Panjang nama harus antara 3 - 225 karakter"],
    },
    username: {
      type: String,
      require: [true, "Username harus diisi"],
      minlength: [3, "Panjang username harus antara 3 - 225 karakter"],
      maxlength: [225, "Panjang username harus antara 3 - 225 karakter"],
    },
    password: {
      type: String,
      require: [true, "Nama harus diisi"],
      minlength: [5, "Panjang password harus antara 5 - 225 karakter"],
      maxlength: [225, "Panjang password harus antara 5 - 225 karakter"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
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
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
