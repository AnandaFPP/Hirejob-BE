const {
  selectAllCategory,
  selectCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
  countCategory,
  findIdCategory,
  searchCategory,
} = require("../models/category");

const commonHelper = require("../helper/common");

let categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const search = req.query.search || "";
      const result = await selectAllCategory({
        limit,
        offset,
        sortby,
        sort,
        search,
      });
      const {
        rows: [count],
      } = await countCategory();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "Get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  getDetailCategory: async (req, res) => {
    const id = Number(req.params.id);
    const { rowCount } = await findIdCategory(id);
    if (!rowCount) {
      return res.json({ message: "ID is not found" });
    }
    selectCategory(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get data success");
      })
      .catch((err) => res.send(err));
  },
  createCategory: async (req, res) => {
    let { name, image } = req.body;
    const {
      rows: [count],
    } = await countCategory();
    const id = Number(count.count) + 1;
    let data = {
      id,
      name,
      image,
    };
    insertCategory(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, "Category created");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateCategory: async (req, res) => {
    let id = Number(req.params.id);
    let { name, image } = req.body;
    const { rowCount } = await findIdCategory(id);
    if (!rowCount) {
      return res.json({ message: "ID is not found" });
    }
    let data = {
      id,
      name,
      image,
    };
    updateCategory(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Category updated");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteCategory: async (req, res) => {
    let id = Number(req.params.id);
    const { rowCount } = await findIdCategory(id);
    if (!rowCount) {
      return res.json({ message: "ID is not found" });
    }
    deleteCategory(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Category deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  searchCategory: async (req, res) => {
    const search = req.query.keyword;
    await searchCategory(search)
      .then((result) => {
        commonHelper.response(res, result.rows, 404, "Search not found");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  },
};

module.exports = categoryController;
