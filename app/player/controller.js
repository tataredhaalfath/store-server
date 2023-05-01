const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const players = await Player.find();

      res.render("admin/player/view_player", {
        players,
        alert,
        name: req.session.username,
        title: "Halaman Pemain",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/player");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.body;
      const player = await Player.findOne({ _id: id });
      const status = player.status == "Y" ? "N" : "Y";

      await Player.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", "Status player berhasil dirubah");
      req.flash("alertStatus", "success");
      res.redirect("/player");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/player");
    }
  },

  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");
      res.status(200).json({
        data: voucher,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.body;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({
          message: "Voucher game tidak ditemukan!",
        });
      }

      res.status(200).json({
        data: voucher,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },

  category: async (req, res) => {
    try {
      const category = await Category.find();
      if (!category) {
        return res.status(404).json({
          message: "Voucher game tidak ditemukan!",
        });
      }

      res.status(200).json({
        data: category,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },
};
