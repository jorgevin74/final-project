var express = require('express');
var router = express.Router();
const Reviews = require('../models/Reviews');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const reviews = await Reviews.find();
    res.render('index', {list: reviews});
  } catch(error){
    console.log(error);
  }
});
module.exports = router;
