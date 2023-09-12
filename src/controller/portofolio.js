const { selectAllPorto, selectPorto, insertPorto, updatePorto, deletePorto, countPortoData, findPorto, selectPortoWorker, findPortoById, findUser } = require('../models/portofolio')
const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require('../middleware/cloudinary');

let portoController = {
    getAllPorto: async (req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const sortby = req.query.sortby || "porto_id";
        const sort = req.query.sort || "ASC";
        const result = await selectAllPorto({
          limit,
          offset,
          sortby,
          sort,
        });
        const {
          rows: [count],
        } = await countPortoData();
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
          "Get portofolio data success",
          pagination
        );
      } catch (error) {
        console.log(error);
      }
    },
    getPortoWorker: async (req, res) => {
      const worker_id = String(req.params.id);
      selectPortoWorker(worker_id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Get portofolio data success");
        })
        .catch((err) => res.send(err));
    },
    createPorto: async (req, res) => {
      let { porto_name, worker_id, link_repo } = req.body;

      const porto_id = uuidv4();

      let porto_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        porto_photo = result.secure_url;
      }

      const data = {
        porto_id,
        worker_id,
        porto_name,
        link_repo,
        porto_photo
      };
      
      insertPorto(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Create portofolio Success")
        )
        .catch((err) => res.send(err));
    },
    updatePorto: async (req, res) => {
      let porto_id = String(req.params.id);
      let { porto_name, link_repo } = req.body;

      const { rowCount } = await findPortoById(porto_id);

      if (!rowCount) {
        return res.json({ message: "ID is not found" });
      }

      let porto_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        porto_photo = result.secure_url;
      }

      let data = {
        porto_id,
        porto_name,
        link_repo,
        porto_photo
      };
      updatePorto(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "porto updated");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletePorto: async (req, res) => {
      let porto_id = String(req.params.id);
      const { rowCount } = await findPortoById(porto_id);
      if (!rowCount) {
        return res.json({ message: "ID is not found" });
      }
      deletePorto(porto_id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "portofolio deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
  
  module.exports = portoController;