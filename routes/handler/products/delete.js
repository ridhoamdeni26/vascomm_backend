const { Product } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const deletedAt = new Date();
    const productId = req.params.id;

    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Product not found",
      });
    }

    await Product.update(
      { deletedAt: deletedAt },
      {
        where: { id: productId },
      }
    );

    return res.status(200).json({
      code: "200",
      status: "error",
      message: "Product successfully deleted",
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
