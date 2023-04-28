const User = require("./model");
const bcrypt = require("bcrypt");

module.exports = {
  viewSignIn: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    try {
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/user/view_signin", {
          alert,
          title: "Halaman SignIn",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        if (user.status === "Y") {
          const checkPass = await bcrypt.compare(password, user.password);
          if (checkPass) {
            req.session.user = {
              id: user._id,
              email: user.email,
              status: user.status,
              name: user.name,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", "Password yang anda masukan salah");
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "Mohon Maaf status akun anda belum aktif");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", "Email yang anda masukan salah");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  actionLogOut: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
