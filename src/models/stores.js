const Pool = require('../config/db')


const selectAllStore = ({limit,offset,sort,sortby}) => {
  return Pool.query(`SELECT * FROM store ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const selectStore = (id) => {
  return Pool.query(`SELECT * FROM store WHERE id = ${id}`)
}
const insertStore = (data) => {
  const {id, name, location, phone} = data
  const date = new Date().toISOString()
  return Pool.query(`INSERT INTO store(id, name, location, phone, created_at) VALUES(${id}, '${name}', '${location}', '${phone}', '${date}')`)
}
const updateStore = (data) => {
  const { id, name, location, phone} = data
  const date = new Date().toISOString()
  return Pool.query(`UPDATE store SET name = '${name}', location = '${location}', phone = '${phone}' WHERE id = '${id}'`)
}
const deleteStore = (id) => {
  return Pool.query(`DELETE FROM store WHERE id = ${id}`)
}

const countData = () =>{
  return Pool.query('SELECT COUNT(*) FROM store')
}

const findIdStore =(id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT id FROM store WHERE id = ${id}`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

const searchStore = (name) => {
    return Pool.query(`SELECT * FROM store WHERE name ILIKE '%${name}%'`)
  }


module.exports = {
  selectAllStore,
  selectStore,
  insertStore,
  updateStore,
  deleteStore,
  countData,
  findIdStore,
  searchStore
}
