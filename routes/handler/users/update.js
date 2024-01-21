const { User } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = async (req, res) => {
  try {
    const schema = {
      username: { type: "string", min: 3, max: 255, optional: true },
      email: { type: "email", max: 255, optional: true },
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: validate,
      });
    }

    const id = req.params.id;
    const user = await User.findOne({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }

    //* Check Username
    const username = req.body.username;
    if (username) {
      const checkUsername = await User.findOne({
        where: { username },
      });

      if (checkUsername && username == user.username) {
        return res.status(409).json({
          code: 409,
          status: "error",
          message: "Username already exist",
        });
      }
    }

    //* Check Email
    const email = req.body.email;
    if (email) {
      const checkEmail = await User.findOne({
        where: { email },
      });

      if (checkEmail && email == user.email) {
        return res.status(409).json({
          code: 409,
          status: "error",
          message: "Email already exist",
        });
      }
    }

    const data = {
      username: username,
      email: email,
      role: req.body.role,
    };

    const updateUser = await user.update(data);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "User update successfully!",
      data: {
        id: updateUser.id,
        username: updateUser.username,
        email: updateUser.email,
        role: updateUser.role,
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
