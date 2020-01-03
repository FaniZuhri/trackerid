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
        var link ='https://platform.antares.id:8443/~/antares-cse/antares-id/AntaresDemo/'+name.devicename
        var headers = {
            'X-M2M-Origin': 'e7e349fc2216941a:9d0cf82c25277bdd',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        axios.delete(link, {
        headers: headers
        })
        .then((response)=>{
            // console.log(response)
            Devname.deleteOne({_id:id},(err,hapus)=>{
                console.log(hapus)
                req.flash('success', 'Device has been deleted!')
                res.redirect('/devlist/'+id2)
            })
        })
        .catch((error)=>{
            console.log(error)
            req.flash('error', 'Device failed to delete!')
            res.redirect('/devlist/'+id2)
            // res.status(500).send()
        })
    })
  })

module.exports = router;