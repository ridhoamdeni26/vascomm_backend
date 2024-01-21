const { User } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const deletedAt = new Date();
    // Get user from request body or params
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId, role: "user" },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }

    await User.update(
      { deletedAt: deletedAt },
      {
        where: { id: userId, role: "user" },
      }
    );

    return res.status(200).json({
      code: "200",
      status: "error",
      message: "User successfully deleted",
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
