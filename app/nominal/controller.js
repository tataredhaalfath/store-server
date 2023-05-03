const Nominal = require("./model");
const { fnumber } = require("../../libs/currency");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      Nominal.find()
        .then((response) => {
          response = JSON.parse(JSON.stringify(response));
          const nominal = response.map((data) => {
            data.price = fnumber(parseInt(data.price));
            return {
              ...data,
            };
          });

          res.render("admin/nominal/view_nominal", {
            nominal,
            alert,
            name: req.session.user.name,
            title: "Halaman Nominal",
          });
        })
        .catch((err) => {
          console.log(err);
          req.flash("alertMessage", `${err.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/nominal");
        });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create", {
        name: req.session.user.name,
        title: "Halaman Tambah Nominal",
      });
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

      let nominal = new Nominal({ coinName, coinQuantity, price });
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
      res.render("admin/nominal/edit", {
        nominal,
        name: req.session.user.name,
        title: "Halaman Ubah Nominal",
      });
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
