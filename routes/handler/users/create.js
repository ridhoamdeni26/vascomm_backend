const { User } = require("../../../models");
const bycrpt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();
const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs-extra");
const path = require("path");

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

module.exports = async (req, res) => {
  try {
    const schema = {
      username: { type: "string", min: 3, max: 255 },
      email: { type: "email", max: 255 },
      phone: { type: "number", min: 2 },
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: validate,
      });
    }

    const __dirname = path.resolve();
    const filePath = path.join(
      __dirname,
      "/routes/handler/users/templateEmail.html"
    );

    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = Handlebars.compile(source);

    const subject = "Confirmation User";
    const randomPassword = generateRandomPassword(10);
    const password = await bycrpt.hash(randomPassword, 10);

    const data = {
      username: req.body.username,
      email: req.body.email,
      password,
      phone: req.body.phone,
      role: "user",
      user_active: true,
    };

    const registerUser = await User.create(data);

    const replacements = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: randomPassword,
    };

    const htmlToSend = template(replacements);

    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "c43966911d4589",
        pass: "62e829476c17e7",
      },
    });

    const mailOptions = {
      from: '"Vascomm" <vascomm@gmail.com>',
      to: req.body.email,
      subject: subject,
      html: htmlToSend,
    };

    if (registerUser) {
      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            code: 200,
            status: "success",
            data: registerUser,
          });
        }
      });
    } else {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Register User not Successfully",
      });
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "service unavailable",
      });
    }
  }
};
