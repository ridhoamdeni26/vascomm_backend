const bycrpt = require("bcrypt");
const { User } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();
const passport = require("../../../config/passport-config");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env;

module.exports = async (req, res) => {
  try {
    const schema = {
      email: { type: "email", max: 255 },
      password: { type: "string", min: 6 },
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: validate,
      });
    }

    passport.authenticate("oauth2");

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "The provided email is not registered.",
      });
    }

    const isValidPassword = await bycrpt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message:
          "Invalid password. Please double-check your password and try again.",
      });
    }

    const token = jwt.sign({ user }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
    });

    return res.json({
      status: "success",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
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
