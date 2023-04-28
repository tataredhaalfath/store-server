const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };
    const transaction = await Transaction.find();

    try {
      res.render("admin/transaction/view_transaction", {
        transaction,
        alert,
        name: req.session.user.name,
        title: "Halaman Metode Pembayaran",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.body;
      const { status } = req.query;

      await Transaction.findOneAndUpdate({ _id: id }, { status });
      req.flash("alertMessage", "Status transaksi berhasil dirubah");
      req.flash("alertStatus", "success");
      res.redirect("/transaction");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
    }
  },
};
