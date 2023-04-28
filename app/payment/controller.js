const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };
    const payment = await Payment.find().populate("banks");

    try {
      res.render("admin/payment/view_payment", { payment, alert });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render("admin/payment/create", { banks });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;

      let payment = await Payment({ type, banks });
      await payment.save();

      req.flash("alertMessage", "Payment Berhasil Ditambah");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.body;
      const payment = await Payment.findOne({ _id: id }).populate("banks");
      const banks = await Bank.find();
      res.render("admin/payment/edit", { payment, banks });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id, type, banks } = req.body;
      await Payment.findOneAndUpdate({ _id: id }, { type, banks });
      req.flash("alertMessage", "Payment Berhasil Diubah");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.body;
      await Payment.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Kategori Berhasil Dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
};
