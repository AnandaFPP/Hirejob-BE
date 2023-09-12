const { selectAllExperience, selectExperience, insertExperience, updateExperience, deleteExperience, countExperience, findWorker, selectExperienceWorker, findExperienceById } = require('../models/experience')
const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");

let experienceController = {
    getAllExperience: async (req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const sortby = req.query.sortby || "experience_id";
        const sort = req.query.sort || "ASC";
        const result = await selectAllExperience({
          limit,
          offset,
          sortby,
          sort,
        });
        const {
          rows: [count],
        } = await countExperience();
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
          "Get experience data success",
          pagination
        );
      } catch (error) {
        console.log(error);
      }
    },
    getExperienceWorker: async (req, res) => {
      const worker_id = String(req.params.id);
      selectExperienceWorker(worker_id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Get worker's experience data success");
        })
        .catch((err) => res.send(err));
    },
    createExperience: async (req, res) => {
      let { 
        worker_id,
        position,
        company_name,
        working_start,
        working_end,
        description } = req.body;

      const experience_id = uuidv4();

      const data = {
        experience_id,
        worker_id,
        position,
        company_name,
        working_start,
        working_end,
        description,
      };
      
      insertExperience(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Create worker's experience success")
        )
        .catch((err) => res.send(err));
    },
    updateExperience: async (req, res) => {
      let experience_id = String(req.params.id);
      let { 
        position,
        company_name,
        working_start,
        working_end,
        description } = req.body;

      const { rowCount } = await findExperienceById(experience_id);

      if (!rowCount) {
        return res.json({ message: "ID is not found" });
      }

      let data = {
        experience_id,
        position,
        company_name,
        working_start,
        working_end,
        description
      };
      updateExperience(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Worker's experience updated");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteExperience: async (req, res) => {
      let experience_id = String(req.params.id);
      const { rowCount } = await findExperienceById(experience_id);
      if (!rowCount) {
        return res.json({ message: "ID is not found" });
      }
      deleteExperience(experience_id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Worker's experience successfully deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
  
  module.exports = experienceController;