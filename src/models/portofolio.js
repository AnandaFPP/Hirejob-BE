const Pool = require('../config/db')


const selectAllPorto = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM portofolio ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const selectPorto = (porto_id) => {
    return Pool.query(`SELECT * FROM portofolio WHERE porto_id = '${porto_id}'`)
}

const selectPortoWorker = (worker_id) => {
    return Pool.query(`SELECT * FROM portofolio WHERE worker_id = '${worker_id}'`);
};

const insertPorto = (data) => {
    const { porto_id, porto_name, link_repo, porto_photo, worker_id } = data;
    return Pool.query(`INSERT INTO portofolio(porto_id, porto_name, link_repo, porto_photo, worker_id) 
      VALUES ('${porto_id}','${porto_name}','${link_repo}','${porto_photo}','${worker_id}')`);
  };
  
const updatePorto = (data) => {
    const { porto_id, porto_name, link_repo, porto_photo } = data
    return Pool.query(`UPDATE portofolio SET porto_name = '${porto_name}', link_repo ='${link_repo}', porto_photo ='${porto_photo}' WHERE porto_id = '${porto_id}'`)
}

const deletePorto = (porto_id) => {
    return Pool.query(`DELETE FROM portofolio WHERE porto_id = '${porto_id}'`)
}

const countPortoData = () => {
    return Pool.query('SELECT COUNT(*) FROM portofolio')
}

const findPorto = (porto_name, worker_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT * FROM portofolio WHERE porto_name = '${porto_name}' AND worker_id = '${worker_id}'`,
            (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        )
    );
};

const findUser = (worker_id) => {
    return new Promise((resolve, reject) =>
      Pool.query(
        `SELECT * FROM portofolio WHERE worker_id= '${worker_id}' `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      )
    );
  };
  

const findPortoById = (porto_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT * FROM portofolio WHERE porto_id = '${porto_id}'`,
            (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        )
    );
};

module.exports = {
    selectAllPorto,
    selectPorto,
    selectPortoWorker,
    insertPorto,
    updatePorto,
    deletePorto,
    countPortoData,
    findPorto,
    findPortoById,
    findUser
}