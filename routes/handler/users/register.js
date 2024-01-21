const { User } = require("../../../models");
const bycrpt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = async (req, res) => {
  try {
    const schema = {
      username: { type: "string", min: 3, max: 255 },
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

    // Check Email exists
    const checkEmail = await User.findOne({
      where: { email: req.body.email },
    });

    if (checkEmail) {
      return res.status(409).json({
        code: 409,
        status: "error",
        message: "Email already exists",
      });
    }

    const password = await bycrpt.hash(req.body.password, 10);

    const data = {
      username: req.body.username,
      email: req.body.email,
      password,
      role: "user",
    };

    const createUser = await User.create(data);

    return res.json({
      code: 200,
      status: "success",
      data: createUser,
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
