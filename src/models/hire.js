const Pool = require("../config/db");

const selectAllHire = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM hire ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectHireWorker = (worker_id) => {
  return Pool.query(`SELECT * FROM hire WHERE worker_id = '${worker_id}'`);
};

const selectHireRecruiter = (recruiter_id) => {
  return Pool.query(`SELECT * FROM hire WHERE recruiter_id = '${recruiter_id}'`);
};

const deleteHire = (hire_id) => {
  return Pool.query(`DELETE FROM hire WHERE hire_id  = '${hire_id}'`);
};

const createHire = (data) => {
  const {
    hire_id,
    hire_title,
    hire_desc,
    worker_id,
    recruiter_id,
    worker_name,
    worker_email,
    recruiter_compname,
  } = data;
  return Pool.query(`INSERT INTO hire(hire_id, hire_title, hire_desc,worker_id, recruiter_id, worker_name, worker_email, recruiter_compname)  
    VALUES ('${hire_id}','${hire_title}','${hire_desc}','${worker_id}','${recruiter_id}','${worker_name}','${worker_email}','${recruiter_compname}')`);
};

const findUUID = (hire_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM hire WHERE hire_id= '${hire_id}' `,
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

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM hire`);
};

module.exports = {
  selectAllHire,
  selectHireWorker,
  selectHireRecruiter,
  deleteHire,
  createHire,
  findUUID,
  countData,
};