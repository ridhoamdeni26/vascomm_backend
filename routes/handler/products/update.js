const { Product } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = async (req, res) => {
  try {
    const schema = {
      name: { type: "string", min: 3, max: 255, optional: true },
      product_active: { type: "boolean", optional: true },
      price: {
        type: "number",
        positive: true,
        integer: true,
        optional: true,
      },
      description: { type: "string", min: 10, optional: true },
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
    const product = await Product.findOne({
      where: { id: id },
    });

    if (!product) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Product not found",
      });
    }

    const name = req.body.name;
    if (name) {
      const checkName = await Product.findOne({
        where: { name },
      });

      if (checkName && name == product.name) {
        return res.status(409).json({
          code: 409,
          status: "error",
          message: "Name already exist",
        });
      }
    }

    const data = {
      name: name,
      product_active: req.body.product_active,
      price: req.body.price,
      description: req.body.description,
    };

    const updateProduct = await product.update(data);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Product update successfully!",
      data: {
        id: updateProduct.id,
        name: updateProduct.name,
        product_active: updateProduct.product_active,
        price: updateProduct.price,
        description: updateProduct.description,
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
