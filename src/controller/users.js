const {
    selectAllUsers,
    selectUsers,
    insertUsers,
    updateUsers,
    deleteUsers,
    countData,
    findIdUsers,
  } = require('../models/users')
  
  const commonHelper = require('../helper/common')
  
  let usersController = {
    getAllUsers: async(req, res) => {
      try{
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const offset = (page -1) * limit
        const sortby = req.query.sortby || 'id'
        const sort = req.query.sort || 'ASC'
        const search = req.query.search || ''
        const result = await selectAllUsers({limit, offset, sortby, sort, search})
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
    getDetailUsers: async(req, res) => {
    const id = Number(req.params.id)
    const { rowCount } = await findIdUsers(id);
    if (!rowCount) {
      return res.json({message: "ID is not found"})
    }
    selectUsers(id)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, "Get data success")
    })
    .catch((err) => res.send(err));
  },
    createUsers: async(req, res) => {
    let {email, username, password} = req.body
    const {rows: [count]} = await countData();
    const id = Number(count.count) + 1;
    let data = {
      id,
      email,
      username,
      password
    }
    insertUsers(data)
    .then((result) => {
      commonHelper.response(res, result.rows, 201, "User created")
    })
    .catch((err) => {
      console.log(err)
    })
  },
    updateUsers: async(req, res) => {
    let id = Number(req.params.id)
    let {email, username, password} = req.body
    const { rowCount } = await findIdUsers(id);
    if (!rowCount) {
      return res.json({message: "ID is not found"})
    }
    let data = {
      id,
      email,
      username,
      password
    }
    updateUsers(data)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, "User updated")
    })
    .catch((err) => {
      console.log(err)
    })
  },
    deleteUsers: async(req, res) => {
    let id = Number(req.params.id)
    const { rowCount } = await findIdUsers(id);
    if (!rowCount) {
      return res.json({message: "ID is not found"})
    }
    deleteUsers(id)
    .then((result) => {
      commonHelper.response(res, result.rows, 200, "Users deleted")
    })
    .catch((err) => {
      console.log(err);
    })
  }
  };
  
  module.exports = usersController;
  