import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import httpStatus from "http-status";

import User from "./auth.model";
import APIError from "../../utils/APIError";
import config from "../../../config/config";
import network from "../../services/network.service";

/**
 * Load user and append to req.
 */
const load = async (req, res, next, id) => {
  try {
    req.user = await User.get(id);
    return next();
  } catch (e) {
    next(e);
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {string} returns the JWT token for the signed in user
 */
const login = async (req, res, next) => {
  const { username, password } = req.body;

  const foundUser = await User.getByName(username).catch(e => next(e));

  const passwordMatches = await bcrypt
    .compare(password, foundUser.password)
    .catch(e => next(e));

  if (!passwordMatches) {
    return next(new APIError("Wrong password", httpStatus.UNAUTHORIZED));
  }

  await network
    .login({
      username
    })
    .catch(e => next(e));

  const token = jwt.sign({ ...foundUser._doc }, config.jwtSecret);

  return res.json({
    token
  });
};

/**
 * Register new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.role - The role of user.
 * @property {string} req.body.identification - The identification of user.
 * @property {string} req.body.affiliation - The affiliation of user.
 * @returns {User}
 */
const register = async (req, res, next) => {
  const { username, password, role, affiliation, identification } = req.body;

  const encryptedPass = await bcrypt
    .hash(password, config.saltRounds)
    .catch(e => next(new APIError(e.message, httpStatus.UNAUTHORIZED)));

  const user = new User({
    username,
    password: encryptedPass,
    role,
    affiliation,
    identification
  });

  try {
    // TODO derive Public/Private key
    const { _name } = await network.register({
      username,
      role,
      identification,
      affiliation
    });

    const savedUser = await user.save();
    return res.status(httpStatus.OK).json({
      username: _name || savedUser.username,
      role: savedUser.role,
      identification: savedUser.identification
    });
  } catch (e) {
    return next(e);
  }
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const update = (req, res, next) => {
  const { user } = req;
  user.username = req.body.username;
  user.password = req.body.password;
  user.enrollmentSecret = req.body.enrollmentSecret;

  user
    .save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
};

const generateCerts = async (req, res, next) => {
  const { username } = req.body;

  const user = new User({
    username,
    role: "publisher",
    affiliation: "org1.department1"
  });

  try {
    // TODO derive Public/Private key
    const { key, cert } = await network.register({
      username,
      role: "publisher",
      affiliation: "org1.department1"
    });

    await user.save();
    return res.status(httpStatus.OK).json({ key, cert });
  } catch (e) {
    return next(e);
  }
};

export default { login, register, update, load, generateCerts };
