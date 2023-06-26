const { createUser, findEmail } = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");

let usersController = {
  registerUser: async (req, res) => {
    try {
      const { email, password, fullname, role } = req.body;
      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return res.json({ message: "Email is already taken" });
      }
      // const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password);
      const id = uuidv4();
      const data = {
        id,
        email,
        passwordHash,
        fullname,
        role,
      };
      // console.log(data)
      await createUser(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "created")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const {
      rows: [user],
    } = await findEmail(email);
    if (!user) {
      return res.json({ message: "Email is incorrect!" });
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.json({ message: "Wrong password!" });
    }
    delete user.password;
    const payload = {
      email: user.email,
      role: user.role,
    };
    user.token = authHelper.generateToken(payload);
    user.refreshToken = authHelper.refreshToken(payload)
    
    commonHelper.response(res, user, 201, "login is successful");
  },
  profileUser: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200);
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT)
    const payload ={
      email : decoded.email,
      role : decoded.role
    }
    const result = {
      token : authHelper.generateToken(payload),
      refreshToken : authHelper.refreshToken(payload)
    }
    commonHelper.response(res,result,200, "Token already generate!")
  
  }
};

module.exports = usersController;
