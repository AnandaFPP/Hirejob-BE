const {
    selectAllStore,
    selectStore,
    insertStore,
    updateStore,
    deleteStore,
    countData,
    findIdStore,
    searchStore,
  } = require('../models/stores')
  
  const commonHelper = require('../helper/common')
  
  let storesController = {
    getAllStore: async(req, res) => {
      try{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const offset = (page - 1) * limit
        const sortby = req.query.sortby || 'id'
        const sort = req.query.sort || 'ASC'
        const search = req.query.search || ''
        const result = await selectAllStore({limit, offset, sortby, sort, search})
        const {rows: [count]} = await countData()
        const totalData = parseInt (count.count)
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
    getDetailStore: async(req, res) => {
    const id = Number(req.params.id)
    const { rowCount } = await findIdStore(id);
    if (!rowCount) {
      return res.json({message: "ID is not found"})
    }
    selectStore(id)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, "Get data success")
    })
    .catch((err) => res.send(err));
  },
    createStore: async(req, res) => {
    let {name, location, phone} = req.body
    const {rows: [count]} = await countData();
    const id = Number(count.count) + 1;
    let data = {
      id,
      name,
      location,
      phone
    }
    insertStore(data)
    .then((result) => {
      commonHelper.response(res, result.rows, 201, "Store created")
    })
    .catch((err) => {
      console.log(err)
    })
  },
    updateStore: async(req, res) => {
    let id = Number(req.params.id)
    let {name, location, phone} = req.body
    const { rowCount } = await findIdStore(id);
    if (!rowCount) {
      return res.json({message: "ID is not found"})
    }
    let data = {
      id,
      name,
      location,
      phone
    }
    updateStore(data)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, "Store updated")
    })
    .catch((err) => {
      console.log(err)
    })
  },
    deleteStore: async(req, res) => {
    let id = Number(req.params.id)
    const { rowCount } = await findIdStore(id);
    if (!rowCount) {
      return res.json({message: "ID is not found"})
    }
    deleteStore(id)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, "Store deleted")
    })
    .catch((err) => {
      console.log(err);
    })
  },
    searchStore: async(req, res) => {
      const search = req.query.keyword;
      await searchStore(search)
      .then((result) => {
        commonHelper.response(res, result.rows, 404, "Store not found")
      })
      .catch((err) => {
        console.log(err)
        res.send(err)
      })
    }
  };
  
  module.exports = storesController;
  