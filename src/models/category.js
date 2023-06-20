const Pool = require('../config/db')


const selectAllCategory = ({limit,offset,sort,sortby}) => {
  return Pool.query(`SELECT * FROM category ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const selectCategory = (id) => {
  return Pool.query(`SELECT * FROM category WHERE id = ${id}`)
}
const insertCategory = (data) => {
  const {id, name, image} = data
  const date = new Date().toISOString()
  return Pool.query(`INSERT INTO category(id, name, image, created_at) VALUES(${id}, '${name}', '${image}', '${date}')`)
}
const updateCategory = (data) => {
  const { id, name, image} = data
  const date = new Date().toISOString()
  return Pool.query(`UPDATE category SET name = '${name}', image = '${image}', created_at = '${date}' WHERE id = ${id}`)
}
const deleteCategory = (id) => {
  return Pool.query(`DELETE FROM category WHERE id = ${id}`)
}

const countCategory = () =>{
  return Pool.query('SELECT COUNT(*) FROM category')
}

const findIdCategory =(id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT id FROM category WHERE id = ${id}`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

const searchCategory = (name) => {
   return Pool.query(`SELECT * FROM category WHERE name ILIKE '%${name}%'`)
  }

module.exports = {
  selectAllCategory,
  selectCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
  countCategory,
  findIdCategory,
  searchCategory
}