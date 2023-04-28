const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Player = require("../player/model");
const Category = require("../category/model");
module.exports = {
  index: async (req, res) => {
    try {
      const transaction = await Transaction.count();
      const voucher = await Voucher.count();
      const player = await Player.count();
      const category = await Category.count();
      res.render("admin/dashboard/view_dashboard", {
        name: req.session.user.name,
        title: "Halaman Dashboard",
        count: {
          transaction,
          voucher,
          player,
          category,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};
