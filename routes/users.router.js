var express = require('express');
var router = express.Router();
const {jsonResponse} = require('../lib/jsonresponse');
const createError = require('http-errors');

const User = require('../model/user.model');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let result = {};

  try {
    result = await User.find({}, 'username password');
  } catch (error) {
    
  }

  res.json(result)
});

router.post('/', async function(req, res, next){
  const { username, password } = req.body;

  if( !username || !password ){
    next(createError(400,'Username or Password missing'));
  }else if( username && password ){
    const user = new User({username, password});

    const exist = await user.usernameExists(username);

    if(exist){
      next(createError(400,'The username is taken. Try with another one'))
    } else{
      await user.save();

      res.json(jsonResponse(200,{
        message: 'User created successfully'
      }))
    }
  }
})

module.exports = router;
