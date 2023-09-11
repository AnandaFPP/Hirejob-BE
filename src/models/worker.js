const Pool = require('../config/db')


const selectAllWorker = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM workers ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const createWorker = (data) => {
  const {worker_id, worker_name, worker_email, worker_phone, worker_pass, passwordHash, verify} = data
  return Pool.query(`INSERT INTO workers(worker_id, worker_name, worker_email, worker_phone, worker_pass, worker_confirm_pass, verify) VALUES('${worker_id}', '${worker_name}', '${worker_email}', '${worker_phone}', '${worker_pass}', '${passwordHash}', '${verify}')`)
}

const createWorkerVerification = (worker_verification_id, worker_id, token) => {
  return Pool.query(
    `insert into workers_verification ( id , worker_id , token ) values ( '${worker_verification_id}' , '${worker_id}' , '${token}' )`
  );
};

const checkWorkerVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `select * from workers_verification where worker_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const cekWorker = (worker_email) => {
  return Pool.query(
    `select verify from workers where worker_email = '${worker_email}' `
  );
};

const deleteWorkerVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `delete from workers_verification  where worker_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(
    `update workers set verify= 'true' where worker_id='${queryUsersId}' `
  );
};


const selectWorker = (worker_id) => {
  return Pool.query(`SELECT * FROM workers WHERE worker_id = '${worker_id}'`)
}

const updateWorker = (data) => {
  const { worker_id, worker_name, domicile, last_work, description, place_work } = data
  return Pool.query(`UPDATE workers SET worker_name = '${worker_name}', domicile = '${domicile}', last_work = '${last_work}', description = '${description}', place_work = '${place_work}' WHERE worker_id = '${worker_id}'`)
}

const updateWorkerPhoto = (data) => {
  const { worker_id, worker_photo } = data;
  return Pool.query(
    `UPDATE workers SET  worker_photo = '${worker_photo}' WHERE worker_id = '${worker_id}'`
  );
};

const deleteWorker = (worker_id) => {
  return Pool.query(`DELETE FROM workers WHERE worker_id = '${worker_id}'`)
}

const findEmail =(worker_email)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT * FROM workers WHERE worker_email = '${worker_email}'`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

const findIdWorker =(worker_id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT FROM workers WHERE worker_id ='${worker_id}'`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

const findSkills =(worker_id)=>{
  return  new Promise ((resolve,reject)=> 
  Pool.query(`SELECT FROM skills WHERE worker_id ='${worker_id}'`,(err,res)=>{
    if(!err){
      resolve(res)
    }else{
      reject(err)
    }
  })
  )
}

const countWorker = () => {
  return Pool.query(`SELECT COUNT(*) FROM workers`);
};


module.exports = {
  createWorker,
  findEmail,
  findIdWorker,
  selectWorker,
  selectAllWorker,
  findSkills,
  updateWorker,
  updateWorkerPhoto,
  countWorker,
  deleteWorker,
  createWorkerVerification,
  checkWorkerVerification,
  cekWorker,
  deleteWorkerVerification,
  updateAccountVerification,
}
