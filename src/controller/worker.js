const { createWorker, findIdWorker, selectWorker, updateWorker, updateWorkerPhoto, findEmail, selectAllWorker, countWorker, deleteWorker, createWorkerVerification, checkWorkerVerification, cekWorker, deleteWorkerVerification, updateAccountVerification, } = require("../models/worker");
const { v4: uuidv4 } = require("uuid");
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middleware/cloudinary");
const crypto = require("crypto");
const sendEmailWorker = require("../middleware/sendEmailWorker");

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
      const { worker_name, worker_email, worker_phone, worker_pass, worker_confirm_pass } = req.body;
      const { rowCount } = await findEmail(worker_email);
      if (rowCount) {
        return res.json({ message: "Email is already taken" });
      }
      // const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(worker_confirm_pass);
      const worker_id = uuidv4();

      const schema = Joi.object().keys({
        worker_name: Joi.required(),
        worker_email: Joi.string().required(),
        worker_phone: Joi.any(),
        worker_pass: Joi.string().min(3).max(15).required(),
        worker_confirm_pass: Joi.ref("worker_pass"),
      });
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        console.log(error);
        return res.send(error.details);
      }

      const verify = "false";
      const worker_verification_id = uuidv4().toLocaleLowerCase();
      const token = crypto.randomBytes(64).toString("hex");
      const url = `${process.env.BASE_URL}worker/verify?id=${worker_id}&token=${token}`;

      await sendEmailWorker(worker_name, worker_email, "Verify Email", url);

      const data = {
        worker_id,
        worker_name,
        worker_email,
        worker_phone,
        worker_pass,
        passwordHash,
        verify,
      };
      createWorker(data)
      
      await createWorkerVerification(worker_verification_id, worker_id, token);

      commonHelper.response(
        res,
        null,
        201,
        "Sign Up Success, Please check your email for verification"
      );
    } catch (error) {
      console.log(error);
    }
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await selectWorker(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkWorkerVerification(queryUsersId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteWorkerVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
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
        rows: [users],
      } = await findEmail(worker_email);
      if (!users) {
        return res.json({ message: "Enter a valid email" });
      }
      
      const {
        rows: [verify],
      } = await cekWorker(worker_email);

      if (verify.verify === "false") {
        return res.json({
          message: "This account isn't verify yet!",
        });
      }

      const isValidPassword = bcrypt.compareSync(worker_confirm_pass, users.worker_confirm_pass);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Incorrect password!" });
      }

      delete users.worker_confirm_pass;

      const payload = {
        worker_email: users.worker_email,
      };
      users.token = authHelper.generateToken(payload);
      users.refreshToken = authHelper.refreshToken(payload);

      commonHelper.response(res, users, 200, "Login is successful");
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
  updateAvatarWorker: async (req, res) => {
    try {
      const worker_id = String(req.params.id);
      const { rowCount } = await findIdWorker(worker_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      let worker_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        worker_photo = result.secure_url;
      }
      const data = {
        worker_id,
        worker_photo,
      };

      updateWorkerPhoto(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users photo profile success!")
        )
        .catch((err) => res.send(err));
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
