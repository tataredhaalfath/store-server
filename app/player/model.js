const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      minlength: [3, "Panjang username harus antara 3 - 225 karakter"],
      maxlength: [225, "Panjang username harus antara 3 - 225 karakter"],
      unique: [true, "Username sudah terdaftar"],
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
      minlength: [9, "Panjang nomor telpon harus antara 9 - 13 karakter"],
      maxlength: [13, "Panjang nomor telpon harus antara 9 - 13 karakter"],
      unique: [true, "Nomor telpon sudah terdaftar"],
      // sparse: true,
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

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
