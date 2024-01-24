const { User, Sequelize } = require("../../../models");
const Op = Sequelize.Op;

module.exports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const userIds = req.query.userIds || [];
    const isActive = req.query.isActive;
    var queryInside;

    const sqlOptions = [
      "id",
      "username",
      "email",
      "phone",
      "role",
      "user_active",
    ];

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
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      };
    }

    if (isActive !== undefined) {
      if (isActive === "true") {
        queryInside = {
          ...queryInside,
          user_active: true,
        };
      } else if (isActive === "false") {
        queryInside = {
          ...queryInside,
          user_active: false,
        };
      }
    }

    //* Total User
    const totalUser = await User.count({
      where: {
        [Op.and]: [queryInside, { role: "user" }, { deleted_at: null }],
      },
    });

    //* Total Page
    const totalPage = Math.ceil(totalUser / limit);

    if (page >= totalPage) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "No page found",
      });
    }

    const users = await User.findAll({
      attributes: sqlOptions,
      where: {
        [Op.and]: [queryInside, { role: "user" }, { deleted_at: null }],
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
        totalUser: totalUser,
        totalPage: totalPage,
        result: users,
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
