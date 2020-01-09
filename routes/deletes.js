var express = require('express');
var router = express.Router();
var axios = require('axios')
var Tracker = require('../model/trackerid.js')
var Devname = require('../model/devname')
var Devdat = require('../model/devdat.js')
var session = require('express-session')
var chalk = require('chalk')

/* GET users listing. */
router.get('/:id', function (req, res, next) {
    id=req.params.id
    id2=req.session.id2
    Tracker.findOne({_id:id},'devicename',(err,name)=>{
        // console.log(name.devicename)
        // console.log(id2)
            Tracker.deleteOne({_id:id},(err,hapus)=>{
                console.log(hapus)
                req.flash('success', 'User has been deleted!')
                res.redirect('/users/'+id2)
            })
        })

    })

module.exports = router;