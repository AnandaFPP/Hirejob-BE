const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middleware/cloudinary");
const crypto = require("crypto");

let {
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
} = require("../models/recruiter");
const sendEmailRecruiter = require("../middleware/sendEmailRecruiter");

let recruiterController = {
  getAllRecruiter: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "recruiter_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllRecruiter({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countData();
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
        "Get Recruiter Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectRecruiter: async (req, res) => {
    const recruiter_id = String(req.params.id);

    selectRecruiter(recruiter_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "Get Recruiter Detail Success"
        );
      })
      .catch((err) => res.send(err));
  },

  registerRecruiter: async (req, res) => {
    const {
      recruiter_name,
      recruiter_email,
      recruiter_compname,
      recruiter_position,
      recruiter_phone,
      recruiter_password,
      recruiter_confirmpassword,
    } = req.body;
    const checkEmail = await findEmail(recruiter_email);
    try {
      if (checkEmail.rowCount == 1) throw "Email already used";
    } catch (error) {
      delete checkEmail.rows[0].password;
      return commonHelper.response(res, null, 403, error);
    }

    const passwordHash = bcrypt.hashSync(recruiter_confirmpassword);
    const recruiter_id = uuidv4();
    
    const schema = Joi.object().keys({
      recruiter_name: Joi.required(),
      recruiter_email: Joi.string().required(),
      recruiter_phone: Joi.any(),
      recruiter_compname: Joi.any(),
      recruiter_position: Joi.any(),
      recruiter_password: Joi.string().min(3).max(15).required(),
      recruiter_confirmpassword: Joi.ref("recruiter_password"),
    });

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send(error.details);
    }

    // Send verify to email
    const verify = "false";
    const recruiter_verification_id = uuidv4().toLocaleLowerCase();
    const token = crypto.randomBytes(64).toString("hex");
    const url = `${process.env.BASE_URL}recruiter/verify?id=${recruiter_id}&token=${token}`;

    await sendEmailRecruiter(recruiter_compname, recruiter_email, "Verify Email", url);

    const data = {
      recruiter_id,
      recruiter_name,
      recruiter_email,
      recruiter_compname,
      recruiter_position,
      recruiter_phone,
      recruiter_password,
      passwordHash,
      verify,
    };

    createRecruiter(data);

    await createRecruiterVerification(
      recruiter_verification_id,
      recruiter_id,
      token
    );

    commonHelper.response(
      res,
      null,
      201,
      "Sign Up Success, Please check your email for verification"
    );
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await findUUID(queryUsersId);

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

        const result = await checkRecruiterVerification(
          queryUsersId,
          queryToken
        );

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteRecruiterVerification(queryUsersId, queryToken);
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

      // res.send(createError(404));
    }
  },

  updateRecruiter: async (req, res) => {
    try {
      const {
        recruiter_jobfield,
        recruiter_province,
        recruiter_city,
        recruiter_desc,
        recruiter_emailcomp,
        recruiter_linkedin,
      } = req.body;
      const recruiter_id = String(req.params.id);
      const { rowCount } = await findUUID(recruiter_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        recruiter_id,
        recruiter_jobfield,
        recruiter_province,
        recruiter_city,
        recruiter_desc,
        recruiter_emailcomp,
        recruiter_linkedin,
      };
      updateRecruiter(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateAvatarRecruiter: async (req, res) => {
    try {
      const recruiter_id = String(req.params.id);
      const { rowCount } = await findUUID(recruiter_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      let recruiter_photo = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        recruiter_photo = result.secure_url;
      }
      const data = {
        recruiter_id,
        recruiter_photo,
      };
      updateAvatarRecruiter(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Update Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteRecruiter: async (req, res) => {
    try {
      const recruiter_id = String(req.params.id);
      const { rowCount } = await findUUID(recruiter_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteRecruiter(recruiter_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Users Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  loginRecruiter: async (req, res) => {
    const { recruiter_email, recruiter_confirmpassword } = req.body;
    const {
      rows: [verify],
    } = await cekRecruiter(recruiter_email);
    if (verify.verify === "false") {
      return res.json({
        message: "Recruiter is unverify",
      });
    }
    const {
      rows: [users],
    } = await findEmail(recruiter_email);
    if (!users) {
      return res.json({ message: "Enter a valid email" });
    }
    const isValidPassword = bcrypt.compareSync(
      recruiter_confirmpassword,
      users.recruiter_confirmpassword
    );
    if (!isValidPassword) {
      return res.json({ message: "Wrong password" });
    }
    delete users.recruiter_confirmpassword;
    const payload = {
      recruiter_email: users.recruiter_email,
    };
    users.token = authHelper.generateToken(payload);
    users.refreshToken = authHelper.refreshToken(payload);
    commonHelper.response(res, users, 201, "Login Successfuly");
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      users_email: decoded.users_email,
    };
    const result = {
      token_user: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
};

module.exports = recruiterController;