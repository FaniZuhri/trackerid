var express = require('express');
var router = express.Router();
var axios = require('axios');
var chalk = require('chalk');
var Devname = require('../model/devname')
var Tracker = require('../model/trackerid')

/* GET users listing. */
router.get('/:id', (req, res, next) => {
  if (req.session.login==true){
    nofresh=true
    id = req.params.id
    if (req.session.tipe =="admin"){
      admin=true
      Devname.find({}).exec((err, devname) => {
        //   console.log(devname)
       
          setTimeout(()=>{
            res.render('./pages/devlist', {
              devname: devname,
              idd: req.session.id2,
              user: req.session.name,
              admin:admin,
              nofresh:nofresh,
            })
          },0)
          
        })
    }
    else{
      Devname.find({owner : req.session.name}).exec((err, devname) => {
        admin=false
        //   console.log(devname)
          if(devname!=null){
            setTimeout(()=>{
              res.render('./pages/devlist', {
                devname: devname,
                idd: req.session.id2,
                user: req.session.name,
                admin:admin,
                nofresh:nofresh,
              })
            },0)
          }
          else{
            res.render('./pages/devlist',{
              idd: req.session.id2,
              user: req.session.name,
              admin:admin,
              nofresh:nofresh,
            })
          }

          
        })
    }
  }
  else{
    res.redirect('/')
  }

  // console.log(id)

      // Tracker.findOne({
      //   _id: id
      // }, 'username', (err, y) => {

      

      // })
    })

module.exports = router;