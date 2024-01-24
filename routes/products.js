var express = require("express");
var router = express.Router();

const productHandler = require("./handler/products");
const verifyToken = require("../middleware/verifyToken");

router.get("/get-product-user", productHandler.getProductUser);
router.get("/get-product", verifyToken, productHandler.getProduct);
router.post("/create-product", verifyToken, productHandler.create);
router.put("/update-product/:id", verifyToken, productHandler.update);
router.delete(
  "/deleted-product/:id",
  verifyToken,
  productHandler.deleteProduct
);

module.exports = router;
