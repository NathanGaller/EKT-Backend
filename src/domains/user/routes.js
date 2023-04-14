const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, oneOf } = require('express-validator');
const User = require('./model.js');
const UserController = require('./controller.js')

router.post(
  "/login",
  body("googleId").notEmpty(),
  body("googleToken").notEmpty(),
  UserController.login
);

router.post(
  '/test',
  UserController.testValidation
)

module.exports = router;