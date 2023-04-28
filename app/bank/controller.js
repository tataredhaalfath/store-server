const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };
    const bank = await Bank.find();

    try {
      res.render("admin/bank/view_bank", { bank, alert });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, bankName, noRekening } = req.body;

      let bank = await Bank({ name, bankName, noRekening });
      await bank.save();

      req.flash("alertMessage", "Bank Berhasil Ditambah");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.body;
      const bank = await Bank.findOne({ _id: id });
      res.render("admin/bank/edit", { bank });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id, name, bankName, noRekening } = req.body;
      await Bank.findOneAndUpdate(
        { _id: id },
        {
          name,
          bankName,
          noRekening,
        }
      );
      req.flash("alertMessage", "Bank Berhasil Diubah");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.body;
      await Bank.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Kategori Berhasil Dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};
