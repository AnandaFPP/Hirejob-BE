const Pool = require("../config/db");

const selectAllExperience = ({ limit, offset, sort, sortby }) => {
    return Pool.query(
        `SELECT * FROM experience ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
    );
};

const selectExperience = (experience_id) => {
    return Pool.query(`SELECT * FROM experience  WHERE experience_id = '${experience_id}'`);
};

const selectExperienceWorker = (worker_id) => {
    return Pool.query(`SELECT * FROM experience WHERE worker_id = '${worker_id}'`);
};

const deleteExperience = (experience_id) => {
    return Pool.query(`DELETE FROM experience WHERE experience_id  = '${experience_id}'`);
};

const insertExperience = (data) => {
    const {
        experience_id,
        worker_id,
        position,
        company_name,
        working_start,
        working_end,
        description,
    } = data;

    const query = `
        INSERT INTO experience (
            experience_id,
            worker_id,
            position,
            company_name,
            working_start,
            working_end,
            description,
            created_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `;

    const values = [
        experience_id,
        worker_id,
        position,
        company_name,
        working_start,
        working_end,
        description
    ];

    return Pool.query(query, values);
};


const updateExperience = (data) => {
    const {
        experience_id,
        position,
        company_name,
        working_start,
        working_end,
        description,
    } = data;
    return Pool.query(
        `UPDATE experience SET position = '${position}', company_name = '${company_name}', working_start = '${working_start}', working_end = '${working_end}', description = '${description}' WHERE experience_id = '${experience_id}'`
    );
};

const findExperienceById = (experience_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT * FROM experience WHERE experience_id= '${experience_id}' `,
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

const findWorker = (worker_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT * FROM experience WHERE worker_id= '${worker_id}' `,
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

const countExperience = () => {
    return Pool.query(`SELECT COUNT(*) FROM experience`);
};

module.exports = {
    selectAllExperience,
    selectExperience,
    selectExperienceWorker,
    deleteExperience,
    insertExperience,
    updateExperience,
    findExperienceById,
    findWorker,
    countExperience,
};