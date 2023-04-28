const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };
    const category = await Category.find();

    try {
      res.render("admin/category/view_category", {
        category,
        alert,
        name: req.session.user.name,
        title: "Halaman Kategori",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", {
        name: req.session.user.name,
        title: "Halaman Tambah Kategori",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;

      let category = await Category({ name });
      await category.save();

      req.flash("alertMessage", "Kategori Berhasil Ditambah");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.body;
      const category = await Category.findOne({ _id: id });
      res.render("admin/category/edit", {
        category,
        name: req.session.user.name,
        title: "Halaman Ubah Kategori",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id, name } = req.body;
      await Category.findOneAndUpdate(
        { _id: id },
        {
          name,
        }
      );
      req.flash("alertMessage", "Kategori Berhasil Diubah");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.body;
      await Category.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Kategori Berhasil Dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
};
