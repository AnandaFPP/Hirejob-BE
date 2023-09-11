const Pool = require("../config/db");

const selectAllRecruiter = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM recruiter ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectRecruiter = (recruiter_id) => {
  return Pool.query(`SELECT * FROM recruiter WHERE recruiter_id = '${recruiter_id}'`);
};

const deleteRecruiter = (recruiter_id) => {
  return Pool.query(`DELETE FROM recruiter WHERE recruiter_id  = '${recruiter_id}'`);
};

const createRecruiter = (data) => {
  const {
    recruiter_id,
    recruiter_name,
    recruiter_email,
    recruiter_compname,
    recruiter_position,
    recruiter_phone,
    recruiter_password,
    passwordHash,
    verify,
  } = data;
  return Pool.query(`INSERT INTO recruiter(recruiter_id,recruiter_compname,recruiter_phone,recruiter_name,recruiter_email,recruiter_position,recruiter_password,recruiter_confirmpassword,verify) 
    VALUES ('${recruiter_id}','${recruiter_compname}','${recruiter_phone}','${recruiter_name}','${recruiter_email}','${recruiter_position}','${recruiter_password}','${passwordHash}','${verify}')`);
};

const createRecruiterVerification = (
  recruiter_verification_id,
  recruiter_id,
  token
) => {
  return Pool.query(
    `insert into recruiter_verification ( id , recruiter_id , token ) values ( '${recruiter_verification_id}' , '${recruiter_id}' , '${token}' )`
  );
};

const checkRecruiterVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `select * from recruiter_verification where recruiter_id= '${queryUsersId}' and token = '${queryToken}' `
  );
};

const cekRecruiter = (recruiter_email) => {
  return Pool.query(
    `select verify from recruiter where recruiter_email = '${recruiter_email}' `
  );
};

const deleteRecruiterVerification = (queryUsersId, queryToken) => {
  return Pool.query(
    `delete from recruiter_verification  where recruiter_id='${queryUsersId}' and token = '${queryToken}' `
  );
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(
    `update recruiter set verify= 'true' where recruiter_id= '${queryUsersId}' `
  );
};

const updateRecruiter = (data) => {
  const {
    recruiter_id,
    recruiter_jobfield,
    recruiter_province,
    recruiter_city,
    recruiter_desc,
    recruiter_emailcomp,
    recruiter_linkedin,
  } = data;
  return Pool.query(
    `UPDATE recruiter SET  recruiter_jobfield = '${recruiter_jobfield}', recruiter_province = '${recruiter_province}', recruiter_city = '${recruiter_city}', recruiter_desc = '${recruiter_desc}', recruiter_emailcomp = '${recruiter_emailcomp}', recruiter_linkedin = '${recruiter_linkedin}' WHERE recruiter_id = '${recruiter_id}'`
  );
};

const updateAvatarRecruiter = (data) => {
  const { recruiter_id, recruiter_photo } = data;
  return Pool.query(
    `UPDATE Recruiter SET  recruiter_photo = '${recruiter_photo}' WHERE recruiter_id = '${recruiter_id}'`
  );
};

const findUUID = (recruiter_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM recruiter WHERE recruiter_id = '${recruiter_id}' `,
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

const findEmail = (recruiter_email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM recruiter WHERE recruiter_email= '${recruiter_email}' `,
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
  return Pool.query(`SELECT COUNT(*) FROM recruiter`);
};

module.exports = {
  selectAllRecruiter,
  selectRecruiter,
  deleteRecruiter,
  createRecruiter,
  updateRecruiter,
  updateAvatarRecruiter,
  createRecruiterVerification,
  checkRecruiterVerification,
  cekRecruiter,
  deleteRecruiterVerification,
  updateAccountVerification,
  findUUID,
  findEmail,
  countData,
};