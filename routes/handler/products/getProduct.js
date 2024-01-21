const { Product, Sequelize } = require("../../../models");
const Op = Sequelize.Op;

module.exports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const userIds = req.query.userIds || [];
    var queryInside;

    const sqlOptions = ["id", "name", "product_active", "price", "description"];

    // * check search Input
    if (userIds.length) {
      queryInside = {
        id: userIds,
      };
    }

    if (search.length) {
      queryInside = {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      };
    }

    const totalProduct = await Product.count({
      where: {
        [Op.and]: [queryInside, { product_active: 1 }, { deleted_at: null }],
      },
    });

    //* Total Page
    const totalPage = Math.ceil(totalProduct / limit);

    if (page >= totalPage) {
      return res.status(404).json({
        status: "error",
        message: "No page found",
      });
    }

    const products = await Product.findAll({
      attributes: sqlOptions,
      where: {
        [Op.and]: [queryInside, { product_active: 1 }, { deleted_at: null }],
      },
      offset: offset,
      limit: limit,
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      data: {
        page: page,
        limit: limit,
        totalProduct: totalProduct,
        totalPage: totalPage,
        result: products,
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
