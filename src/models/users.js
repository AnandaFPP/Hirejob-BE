const Pool = require('../config/db')


const selectAllUsers = ({limit,offset,sort,sortby}) => {
  return Pool.query(`SELECT * FROM users ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const selectUsers = (id) => {
  return Pool.query(`SELECT * FROM users WHERE id = ${id}`)
}
const insertUsers = (data) => {
  const {id, email, username, password} = data
  const date = new Date().toISOString()
  return Pool.query(`INSERT INTO users(id, email, username, password, created_at) VALUES(${id}, '${email}', '${username}', '${password}', '${date}')`)
}
const updateUsers = (data) => {
  const { id, email, username, password} = data
  const date = new Date().toISOString()
  return Pool.query(`UPDATE users SET email = '${email}', username = '${username}', password = '${password}', created_at = '${date}' WHERE id = ${id}`)
}
const deleteUsers = (id) => {
  return Pool.query(`DELETE FROM users WHERE id = ${id}`)
}

const countData = () =>{
  return Pool.query('SELECT COUNT(*) FROM users')
}

const findIdUsers =(id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT id FROM users WHERE id = ${id}`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

module.exports = {
  selectAllUsers,
  selectUsers,
  insertUsers,
  updateUsers,
  deleteUsers,
  countData,
  findIdUsers
}
