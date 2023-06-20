const {
  selectAllProduct,
  selectProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  countData,
  findIdProduct,
  searchProduct
} = require('../models/products')

const commonHelper = require('../helper/common')

let productController = {
  getAllProduct: async(req, res) => {
    try{
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const offset = (page - 1) * limit
      const sortby = req.query.sortby || 'id'
      const sort = req.query.sort || 'ASC'
      const search = req.query.search || ''
      const result = await selectAllProduct({limit, offset, sortby, sort, search})
      const {rows: [count]} = await countData()
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData/limit)
      const pagination = {
        currentPage : page,
        limit : limit,
        totalData : totalData,
        totalPage : totalPage
      }
      commonHelper.response(res, result.rows, 200, 'Get data success', pagination);
    } catch(error) {
      console.log(error)
    }
},
  getDetailProduct: async(req, res) => {
  const id = Number(req.params.id)
  const { rowCount } = await findIdProduct(id);
  if (!rowCount) {
    return res.json({message: "ID is not found"})
  }
  selectProduct(id)
  .then((result) => {
    commonHelper.response(res, result.rows, 200, "Get data success")
  })
  .catch((err) => res.send(err));
},
  createProduct: async(req, res) => {
  let {store_id, category_id, name, price, stock, image} = req.body
  const {rows: [count]} = await countData();
  const id = Number(count.count) + 1;
  let data = {
    id,
    store_id,
    category_id,
    name,
    price,
    stock,
    image
  }
  insertProduct(data)
  .then((result) => {
    commonHelper.response(res, result.rows, 201, "Product created")
  })
  .catch((err) => {
    console.log(err)
  })
},
  updateProduct: async(req, res) => {
  let id = Number(req.params.id)
  let {store_id, category_id, name, price, stock, image} = req.body
  const { rowCount } = await findIdProduct(id);
  if (!rowCount) {
    return res.json({message: "ID is not found"})
  }
  let data = {
    id,
    store_id,
    category_id,
    name,
    price,
    stock,
    image
  }
  updateProduct(data)
  .then((result) => {
    commonHelper.response(res, result.rows, 200, "Product updated")
  })
  .catch((err) => {
    console.log(err)
  })
},
  deleteProduct: async(req, res) => {
  let id = Number(req.params.id)
  const { rowCount } = await findIdProduct(id);
  if (!rowCount) {
    return res.json({message: "ID is not found"})
  }
  deleteProduct(id)
  .then((result) => {
    commonHelper.response(res, result.rows, 200, "Product deleted")
  })
  .catch((err) => {
    console.log(err);
  })
},
  searchProduct: async(req, res) => {
    try {
      const keywords = req.query.keywords || ''
      let result = await searchProduct({keywords})
      commonHelper.response(res, result.rows, 200, "Search success")
    }catch(err){
      console.log(err)
    }
  }
};

module.exports = productController;
