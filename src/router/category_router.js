const { Router } = require("express");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");
const { imageUploader } = require("../middleware/upload");
const { createCategory, getAllCategories, getCategory, deleteCategory, updateCategory } = require("../controller/category_controller");
const { createCategoryValidation } = require("../validation/category_validation");
const { bodyValidation } = require("../middleware/validation");


const router = Router();

router.post("/", verifyUser([USER_ROLE.USER]), imageUploader.single("icon"), bodyValidation(createCategoryValidation),createCategory);
router.get("/", verifyUser([USER_ROLE.USER]), getAllCategories);
router.get("/:id", verifyUser([USER_ROLE.USER]), getCategory);
router.put("/:id", verifyUser([USER_ROLE.USER]), imageUploader.single("icon"), bodyValidation(createCategoryValidation), updateCategory);
router.delete("/:id", verifyUser([USER_ROLE.USER]), deleteCategory);

module.exports = router;