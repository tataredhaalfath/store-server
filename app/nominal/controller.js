const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };
    const nominal = await Nominal.find();

    try {
      res.render("admin/nominal/view_nominal", { nominal, alert });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;

      let nominal = await Nominal({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertMessage", "Nominal Berhasil Ditambah");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.body;
      const nominal = await Nominal.findOne({ _id: id });
      res.render("admin/nominal/edit", { nominal });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id, coinName, coinQuantity, price } = req.body;
      await Nominal.findOneAndUpdate(
        { _id: id },
        {
          coinName,
          coinQuantity,
          price,
        }
      );
      req.flash("alertMessage", "Nominal Berhasil Diubah");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.body;
      await Nominal.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Kategori Berhasil Dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
};
