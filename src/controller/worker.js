const { createWorker, findIdWorker, selectWorker, updateWorker, findEmail, selectAllWorker, countWorker, deleteWorker } = require("../models/worker");
const { v4: uuidv4 } = require("uuid");
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

let workerController = {
  getAllWorker: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "worker_name";
      const sort = req.query.sort || "ASC";
      let result = await selectAllWorker({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countWorker();
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
        "Get Worker Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },
  registerWorker: async (req, res) => {
    try {
      const { worker_name, worker_email, worker_phone, worker_photo, worker_pass, worker_confirm_pass } = req.body;
      const { rowCount } = await findEmail(worker_email);
      if (rowCount) {
        return res.json({ message: "Email is already taken" });
      }
      // const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(worker_confirm_pass);
      const worker_id = uuidv4();
      const data = {
        worker_id,
        worker_name,
        worker_email,
        worker_phone,
        worker_photo,
        worker_pass,
        passwordHash
      };
      await createWorker(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "created")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  loginWorker: async (req, res) => {
    try {
      const workerSchema = Joi.object({
        worker_email: Joi.string().email().required(),
        worker_confirm_pass: Joi.string().required(),
      });

      const { error } = workerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { worker_email, worker_confirm_pass } = req.body;
      const {
        rows: [worker],
      } = await findEmail(worker_email);

      if (!worker) {
        return res.status(401).json({ message: "Email is incorrect!" });
      }

      const isValidPassword = bcrypt.compareSync(worker_confirm_pass, worker.worker_confirm_pass);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Incorrect password!" });
      }

      delete worker.worker_confirm_pass;

      const payload = {
        worker_email: worker.worker_email,
      };
      worker.token = authHelper.generateToken(payload);
      worker.refreshToken = authHelper.refreshToken(payload);

      res.cookie("authToken", worker.token, cookieOptions);

      commonHelper.response(res, worker, 200, "Login is successful");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  },
  getDetailWorker: async (req, res) => {
    const worker_id = String(req.params.id);
    const { rowCount } = await findIdWorker(worker_id);
    if (!rowCount) {
      return res.json({ message: "Profile is not found" });
    }
    console.log(rowCount)
    selectWorker(worker_id)
      .then(
        result => {
          // client.setEx(`products/${id}`,60*60,JSON.stringify(result.rows))
          commonHelper.response(res, result.rows, 200, "get data success from database")
        }
      )
      .catch(err => res.send(err)
      )
  },
  updateWorker: async (req, res) => {
    try {
      const PORT = process.env.PORT || 8000
      const PGHOST = process.env.PGHOST || 'localhost'
      const worker_id = String(req.params.id)
      const { worker_name, domicile, last_work, description, place_work } = req.body
      const { rowCount } = await findIdWorker(worker_id)
      if (!rowCount) {
        return next(createError(403, "Profile is Not Found"))
      }
      const data = {
        worker_id,
        worker_name,
        domicile,
        last_work,
        description,
        place_work
      }
      updateWorker(data)
        .then(
          result => commonHelper.response(res, result.rows, 200, "Profile updated")
        )
        .catch(err => res.send(err)
        )
    } catch (error) {
      console.log(error);
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
    const payload = {
      email: decoded.email,
      role: decoded.role
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload)
    }
    commonHelper.response(res, result, 200, "Token already generate!")
  },
  deleteWorker: async (req, res) => {
    try {
      const worker_id = req.params.id;
      const deleteResult = await deleteWorker(worker_id);

      if (deleteResult) {
        commonHelper.response(res, null, 200, 'Worker deleted successfully');
      } else {
        commonHelper.response(res, null, 404, 'Worker not found');
      }
    } catch (error) {
      console.error(error);
      commonHelper.response(res, null, 500, 'Error deleting worker');
    }
  },
};

module.exports = workerController;
