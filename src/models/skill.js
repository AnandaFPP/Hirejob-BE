const Pool = require('../config/db')


const selectAllSkills = ({ limit, offset, sort, sortby }) => {
    return Pool.query(`SELECT * FROM skills ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}
const selectSkill = (skill_id) => {
    return Pool.query(`SELECT * FROM skills WHERE skill_id = ${skill_id}`)
}

const selectSkillWorker = (worker_id) => {
    return Pool.query(`SELECT * FROM skills WHERE worker_id = '${worker_id}'`);
};


const insertSkill = (data) => {
    const { skill_id, worker_id, skill_name } = data
    return Pool.query(`INSERT INTO skills(skill_id, worker_id, skill_name) VALUES(${skill_id}, '${worker_id}', '${skill_name}')`)
}
const updateSkill = (data) => {
    const { skill_id, skill_name } = data
    return Pool.query(`UPDATE skills SET skill_name = '${skill_name}' WHERE skill_id = ${skill_id}`)
}
const deleteSkill = (skill_id) => {
    return Pool.query(`DELETE FROM skills WHERE skill_id = ${skill_id}`)
}

const countSkillData = () => {
    return Pool.query('SELECT COUNT(*) FROM skills')
}

const findSkill = (skill_name, worker_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT * FROM skills WHERE skill_name = '${skill_name}' AND worker_id = '${worker_id}'`,
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

const findSkillById = (skill_id) => {
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT * FROM skills WHERE skill_id = ${skill_id} `,
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
    selectAllSkills,
    selectSkill,
    selectSkillWorker,
    insertSkill,
    updateSkill,
    deleteSkill,
    countSkillData,
    findSkill,
    findSkillById
}