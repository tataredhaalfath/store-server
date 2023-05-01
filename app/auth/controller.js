const Player = require("../player/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/upload/players/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            let player = new Player({ ...payload, avatar: filename });

            await player.save();
            delete player._doc.password;

            res.status(201).json({
              data: player,
            });
          } catch (err) {
            console.log(err);
            if (err && err.name === "ValidationError") {
              return res.status(433).json({
                error: 1,
                message: err.message,
                fields: err.errors,
              });
            }
          }
        });
      } else {
        let player = new Player(payload);
        await player.save();

        delete player._doc.password;

        res.status(201).json({
          data: player,
        });
      }
    } catch (err) {
      console.log(err);
      if (err && err.name === "ValidationError") {
        return res.status(433).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }

      // validate unique field
      if (err && err.name === "MongoServerError") {
        let value = "";
        for (let key in err.keyValue) {
          value = err.keyValue[key];
        }
        return res.status(433).json({
          error: "error validation",
          message: `${Object.keys(err.keyValue)} : ${value} sudah terdaftar`,
        });
      }

      next(err);
    }
  },

  signin: (req, res, next) => {
    try {
      const { email, password } = req.body;
      Player.findOne({ email })
        .then((player) => {
          if (player) {
            const checkPass = bcrypt.compareSync(password, player.password);
            if (checkPass) {
              const token = jwt.sign(
                {
                  player: {
                    id: player._id,
                    name: player.name,
                    username: player.username,
                    email: player.email,
                    phoneNumber: player.phoneNumber,
                    avatar: player.avatar,
                  },
                },
                config.jwtKey
              );

              res.status(200).json({
                data: token,
              });
            } else {
              res.status(403).json({
                message: "Password yang anda masukan salah",
              });
            }
          } else {
            res.status(404).json({
              message: "Email yang anda masukan belum terdaftar",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message || "Terjadi kesalahan pada server ",
          });
        });
    } catch (err) {
      console.log(err);
    }
  },
};
