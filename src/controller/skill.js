const { selectAllSkills, selectSkill, insertSkill, updateSkill, deleteSkill, countSkillData, findSkill, selectSkillWorker, findSkillById } = require('../models/skill')
const commonHelper = require("../helper/common");

let skillController = {
    getAllSkills: async (req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const sortby = req.query.sortby || "skill_id";
        const sort = req.query.sort || "ASC";
        const result = await selectAllSkills({
          limit,
          offset,
          sortby,
          sort,
        });
        const {
          rows: [count],
        } = await countSkillData();
        const totalData = parseInt(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = {
          currentPage: page,
          limit: limit,
          totalData: totalData,
          totalPage: totalPage,
        };
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get skill data success",
          pagination
        );
      } catch (error) {
        console.log(error);
      }
    },
    getSkillWorker: async (req, res) => {
      const worker_id = String(req.params.id);
      selectSkillWorker(worker_id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Get skill data success");
        })
        .catch((err) => res.send(err));
    },
    createSkill: async (req, res) => {
      let { skill_name, worker_id } = req.body;
      const { rowCount: SkillName } = await findSkill(skill_name, worker_id);
      
      if (SkillName) {
        return res.json({ message: "Skill already added" });
      }
      const {
        rows: [count],
      } = await countSkillData();

      const skill_id = Number(count.count) + 1;

      const data = {
        skill_id,
        skill_name,
        worker_id,
      };
      insertSkill(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Create Skill Success")
        )
        .catch((err) => res.send(err));
    },
    updateSkill: async (req, res) => {
      let skill_id = Number(req.params.id);
      let { skill_name } = req.body;
      const { rowCount } = await findSkillById(skill_id);
      if (!rowCount) {
        return res.json({ message: "ID is not found" });
      }
      let data = {
        skill_id,
        skill_name,
      };
      console.log(data)
      updateSkill(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Skill updated");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteSkill: async (req, res) => {
      let skill_id = Number(req.params.id);
      const { rowCount } = await findSkillById(skill_id);
      if (!rowCount) {
        return res.json({ message: "ID is not found" });
      }
      deleteSkill(skill_id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Skill deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
  
  module.exports = skillController;