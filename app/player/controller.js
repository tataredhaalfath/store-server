const Bank = require("../bank/model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Player = require("./model");
const Voucher = require("../voucher/model");
const Transaction = require("../transaction/model");

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
    }
  },

  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;
      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      if (!res_voucher)
        return res
          .status(404)
          .json({ message: "Voucher game tidak ditemukan" });

      const res_nominal = await Nominal.findOne({ _id: nominal });
      if (!res_nominal)
        return res.status(404).json({ message: "Nominal tidak ditemukan" });

      const res_payment = await Payment.findOne({ _id: payment });
      if (!res_payment)
        return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

      const res_bank = await Bank.findOne({ _id: bank });
      if (!res_bank)
        return res.status(404).json({ message: "Bank tidak ditemukan" });

      const tax = (10 / 100) * parseInt(res_nominal._doc.price);
      const value = parseInt(res_nominal._doc.price) - tax;
      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : "",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bankName: res_bank._doc.bankName,
          noRekening: res_bank._doc.noRekening,
        },
        name: name,
        accountUser: accountUser,
        tax,
        value,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },
        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res.status(201).json({
        data: payload,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },

  history: async (req, res) => {
    try {
      const { status = "" } = req.query;
      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);
      const amount = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);
      res.status(200).json({
        data: history,
        amount: amount.length ? amount[0].value : 0,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },

  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findOne({ _id: id });

      if (!history)
        return res.status(404).json({ message: "History tidak ditemukan" });

      res.status(200).json({ data: history });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },

  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        {
          $match: {
            player: req.player._id,
          },
        },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const category = await Category.find();

      category.forEach((element) => {
        count.forEach((data) => {
          if (data._id.toString() === element._id.toString()) {
            data.name = element.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({
        data: history,
        count,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message || "Terjadi kesalahan pada server",
      });
    }
  },
};
