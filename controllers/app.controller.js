var express = require('express');
var router = express.Router();

router.use('/', express.static('app') );

module.exports = router;