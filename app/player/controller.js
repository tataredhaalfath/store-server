const Player = require("./model");

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
};
