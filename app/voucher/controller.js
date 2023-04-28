const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };
    const voucher = await Voucher.find()
      .populate("category")
      .populate("nominals");
    try {
      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        name: req.session.user.name,
        title: "Halaman Voucher",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render("admin/voucher/create", {
        category,
        nominal,
        name: req.session.user.name,
        title: "Halaman Tambah Voucher",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/upload/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            await voucher.save();

            req.flash("alertMessage", "Voucher Berhasil Ditambah");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (err) {
            console.log(err);
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        let voucher = await Voucher({ name, category, nominals });
        await voucher.save();

        req.flash("alertMessage", "Voucher Berhasil Ditambah");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.body;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("nominals")
        .populate("category");

      const nominal = await Nominal.find();
      const category = await Category.find();
      res.render("admin/voucher/edit", {
        voucher,
        nominal,
        category,
        name: req.session.user.name,
        title: "Halaman Ubah Voucher",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id, name, category, nominals } = req.body;
      console.log("req bodyu", req.body);
      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/upload/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const voucer = await Voucher.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/upload/${voucer.thumbnail}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }
            await Voucher.findOneAndUpdate(
              { _id: id },
              {
                name,
                category,
                nominals,
                thumbnail: filename,
              }
            );

            req.flash("alertMessage", "Voucher Berhasil Diubah");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (err) {
            console.log(err);
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          { _id: id },
          {
            name,
            category,
            nominals,
          }
        );

        req.flash("alertMessage", "Voucher Berhasil Ditambah");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.body;
      const voucer = await Voucher.findOne({ _id: id });
      await Voucher.findOneAndRemove({ _id: id });

      let currentImage = `${config.rootPath}/public/upload/${voucer.thumbnail}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash("alertMessage", "Voucher Berhasil Dihapus");
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.body;
      const voucher = await Voucher.findOne({ _id: id });
      const status = voucher.status === "Y" ? "N" : "Y";

      await Voucher.findOneAndUpdate(
        { _id: id },
        {
          status,
        }
      );

      req.flash("alertMessage", "Status Voucher Berhasil Diubah");
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
};
