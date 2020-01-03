var express = require('express');
var axios = require('axios');
var router = express.Router();
var Tracker = require('../model/trackerid.js')
var Devname = require('../model/devname.js')
var Devdat = require('../model/devdat.js')
var session = require('express-session')
var chalk = require('chalk')
var moment = require('moment')

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  if (req.session.login == true) {
    nofresh=true
    id = req.params.id
    if (req.session.name=='admin'){
      admin=true
      res.render('./pages/create', {
        idd: req.session.id2,
        user: req.session.name,
        admin:admin,
        nofresh:nofresh,
      })
    }
    else{
      admin=false
      res.render('./pages/create', {
        idd: req.session.id2,
        user: req.session.name,
        admin:admin,
        nofresh:nofresh,
      })
    }
   
  } else {
    res.redirect('/')
  }

})

router.post('/:id', function (req, res, next) {
  if (req.session.login == true) {
    id = req.params.id
    var devicename = req.body.devicename
    var owner = req.body.owner
    var tipe = req.body.tipe
    var lat = req.body.lat
    var long = req.body.long
    console.log(devicename, owner, tipe, lat, long)
    // console.log(req.session.name)
    function abc() {
      console.log('success')
      var link = 'https://platform.antares.id:8443/~/antares-cse/antares-id/AntaresDemo'
      var headers = {
        'X-M2M-Origin': 'e7e349fc2216941a:9d0cf82c25277bdd',
        'Content-Type': 'application/json;ty=3',
        'Accept': 'application/json',
      }
      axios.post(link, {
          "m2m:cnt": {
            "rn": devicename
          }
        }, {
          headers: headers,
        })
        .then((response) => {
          console.log(response.data['m2m:cnt'].rn)
          var devname = new Devname()
          devname.devicename = devicename
          devname.tipe = tipe
          devname.active = 0
          devname.lat = lat
          devname.long = long
          if(tipe==1){
            devname.status = 'OFF'
            devname.alt = 0
          }
          if(tipe==3){
            devname.status = '2D'
            devname.alt = 'Periodic Mode'
          }
          if(tipe==2){
            devname.status = 'OFF'
            devname.alt = 0
          }
          devname.percent = 0
          devname.owner = owner
          devname.save((err, y) => {
            if (!err) {
              console.log(y)
            } else {
              // console.log(err)
              //
            }
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          req.flash('success', 'Create Device Succeeded!')
          res.redirect('./' + id)
        })
    }
    if (owner == req.session.name) {
      // console.log(owner)
      abc()


    } else if (req.session.tipe == 'admin') {
      abc()
      // admin=true

    } else {
      // admin=false
      req.flash('error', 'Create Device Failed!')
      res.redirect('./' + id)
    }
  } else {
    res.redirect('/')
  }

})

module.exports = router;