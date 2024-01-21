const { Product } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = async (req, res) => {
  try {
    const schema = {
      name: { type: "string", min: 3, max: 255 },
      price: { type: "number", positive: true, integer: true },
      description: { type: "string", min: 10 },
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: validate,
      });
    }

    const data = {
      name: req.body.name,
      product_active: 1,
      price: req.body.price,
      description: req.body.description,
    };

    const createProduct = await Product.create(data);

    return res.json({
      code: 200,
      status: "success",
      data: createProduct,
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
