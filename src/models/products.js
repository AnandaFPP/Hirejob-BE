const Pool = require('../config/db')


const selectAllProduct = ({limit,offset,sort,sortby}) => {
  return Pool.query(`SELECT products.id, products.name AS product_name, category.name AS category_name, store.name AS store_name, products.price, products.stock, store.phone AS store_contact FROM products INNER JOIN category ON products.id = category.id INNER JOIN store ON products.id = store.id ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const selectProduct = (id) => {
  return Pool.query(`SELECT products.id, products.name AS product_name, category.name AS category_name, store.name AS store_name, products.price, products.stock, store.phone AS store_contact FROM products INNER JOIN category ON products.id = category.id INNER JOIN store ON products.id = store.id WHERE products.id = ${id}`)
}
const insertProduct = (data) => {
  const {id, store_id, category_id, name, price, stock, image} = data
  const date = new Date().toISOString()
  return Pool.query(`INSERT INTO products(id, store_id, category_id, name, price, stock, image, created_at) VALUES(${id}, ${store_id}, ${category_id}, '${name}', ${price}, ${stock}, '${image}', '${date}')`)
}
const updateProduct = (data) => {
  const { id, store_id, category_id, name, price, stock, image} = data
  const date = new Date().toISOString()
  return Pool.query(`UPDATE products SET store_id = ${store_id}, category_id = ${category_id},name = '${name}', price = ${price}, stock = ${stock}, image = '${image}', created_at = '${date}' WHERE id = '${id}'`)
}
const deleteProduct = (id) => {
  return Pool.query(`DELETE FROM products WHERE id = ${id}`)
}

const countData = () =>{
  return Pool.query('SELECT COUNT(*) FROM products')
}

const findIdProduct =(id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT id FROM products WHERE id = ${id}`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

const searchProduct = ({keywords}) => {
    return Pool.query(`SELECT products.id, products.name, category.name AS category_name, store.name AS store_name, products.price, products.stock, store.phone AS store_contact FROM products INNER JOIN category ON products.id = category.id INNER JOIN store ON products.id = store.id WHERE products.name ILIKE '%${keywords}%'`)
  }


module.exports = {
  selectAllProduct,
  selectProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  countData,
  findIdProduct,
  searchProduct
}
