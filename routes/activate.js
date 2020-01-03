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
    Devname.findOne({_id:id},'devicename',(err,name)=>{
        // console.log(name.devicename)
        // console.log(id2)
        Devname.update({devicename:name.devicename},{$set:{
            active:1,
          }}, (err,oke)=>{
            // console.log(devnamee)
            if (!err){
                req.flash('success', 'Device has been set to active!')
                res.redirect('/notif/'+id2)
            // console.log(oke)
            }
            else{
                req.flash('error', 'Failed')
                res.redirect('/notif/'+id2)
              console.log(err)
            }
          })
    })
  })

module.exports = router;