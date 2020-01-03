var express = require('express');
var router = express.Router();
var axios = require('axios');
var chalk = require('chalk');
var Devname = require('../model/devname')
var hex64 = require('hex64')
var hexbin = require('hex-to-binary')
var bindec = require('bin-to-decimal')
var hexdec = require('hex2dec');
var Tracker = require('../model/trackerid')
var moment = require('moment')
// id = req.params.id

/* GET users listing. */

router.get('/:id', (req, res, next) => {
  if (req.session.login == true) {

    id = req.params.id
    // console.log(id)
    axios.get('https://platform.antares.id:8443/~/antares-cse/antares-id/AntaresDemo?fu=1&ty=3', {
        headers: {
          'X-M2M-Origin': 'e7e349fc2216941a:9d0cf82c25277bdd',
          'Content-Type': 'application/json;ty=4',
          'Accept': 'application/json'
        }
      })
      .then((response) => {
        // handle success
        // console.log(response)
        var dataArray = response.data['m2m:uril']
        // console.log(dataArray)
        dataArray.forEach((devnameee) => {
          var devnameee = devnameee.split("/", 5)
          var devnamee = devnameee[4]
          // Tracker.findOne({username:req.session.name},'tipe',(err,tipe)=>{
          //   console.log(tipe)
          // })
          // console.log(devnamee)
          axios.get('https://platform.antares.id:8443/~/antares-cse/antares-id/AntaresDemo/' + devnamee + '/la', {
              headers: {
                'X-M2M-Origin': 'e7e349fc2216941a:9d0cf82c25277bdd',
                'Content-Type': 'application/json;ty=4',
                'Accept': 'application/json'
              }
            })
            .then((response) => {
              // console.log(response)
              // console.log(devnamee)




              Devname.findOne({
                devicename: devnamee
              }, 'tipe', (err, tipe) => {
                // console.log(tipe.tipe)
                function savedragino() {
                  var data1 = response.data['m2m:cin']['con']
                  var time = response.data['m2m:cin']['lt']
                  var hex8 = 8388608
                  var hex10 = 16777216
                  var bat = 16383
                  var alar = 64
                  var lat = data1.substr(0, 6)
                  lat = parseInt(lat, 16)
                  if (lat && hex8 != hex8) {
                    var dat = 10000
                    lat = lat / dat
                  } else if (lat && hex8 == hex8) {
                    var dat1 = lat - hex10
                    var dat = 10000
                    lat = dat1 / dat
                  } else {
                    lat = 0
                  }
  
                  var long = data1.substr(6, 6)
                  long = parseInt(long, 16)
                  if (long && hex8 == hex8) {
                    var dat = 10000
                    long = long / dat
                  } else if (long && hex8 != hex8) {
                    var dat1 = long - hex10
                    var dat = 10000
                    long = dat1 / dat
                  } else {
                    long = 0
                  }
  
                  var alarm = data1.substr(12, 2)
                  alarm = parseInt(alarm, 16) & alar
                  if (alarm != 0) {
                    alarm = 'ON'
                  } else {
                    alarm = 'OFF'
                  }
  
                  var batt = data1.substr(12, 4)
                  batt = (parseInt(batt, 16) & bat) / 1000
                  var percent = (batt / 4) * 100
                  if (percent <= 20) {
                    percent = 0
                  } else {
                    percent = 1
                  }
  
                  // var year = time.substr(0, 4)
                  // var month = time.substr(4, 2)
                  // var date = time.substr(6, 2)
                  // var hour = time.substr(9, 2)
                  // var min = time.substr(11, 2)
                  // var sec = time.substr(13, 2)
                  // date = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec
                  var devname = new Devname()
                  devname.devicename = devnamee
                  // devname.tipe = 1
                  // devname.owner = 'fani'
                  devname.lat = lat
                  devname.long = long
                  devname.alt = 0
                  devname.status = alarm
                  devname.percent = percent
                  // console.log(lat,long,alarm,percent,devnamee)
  
  
                  devname.save((err, y) => {
                    if (!err) {
                      console.log(y)
                    } else {
                      // console.log(err)
                      
                      Devname.updateOne({
                        devicename: devnamee
                      }, {
                        $set: {
                          lat: lat,
                          long: long,
                          status: alarm,
                          percent: percent,
                          updatedAt: moment().toISOString()
                        }
                      }, (err, oke) => {
                        // console.log(devnamee)
                        if (!err) {
                          // console.log(oke)
                        } else {
                          console.log(err)
                        }
                      })
                      //
                    }
                  })
                }
  
                function savegps() {
                  var data1 = response.data['m2m:cin']['con']
                  // time = response.data['m2m:cin']['lt']
                  data1 = data1.split(',', 5)
                  // console.log(data1)
                  var lat2 = data1[2]
                  var long2 = data1[3]
                  var alt2 = data1[4].substr(0, 6)
                  var devname = new Devname()
                  devname.devicename = devnamee
                  // devname.tipe = 2
                  // devname.owner = 'fani'
                  devname.lat = lat2
                  devname.long = long2
                  devname.alt = alt2
                  devname.status = 0
                  devname.percent = 0
                  // console.log(lat2,long2,devnamee)
  
  
                  devname.save((err, y) => {
                    if (!err) {
                      // console.log(y)
                    } else {
                      // console.log(err)
                      Devname.updateOne({
                        devicename: devnamee
                      }, {
                        $set: {
                          lat: lat2,
                          long: long2,
                          alt: alt2,
                          updatedAt: moment().toISOString()
                        }
                      }, (err, oke) => {
                        // console.log(devnamee)
                        if (!err) {
                          // console.log(oke)
                        } else {
                          console.log(err)
                        }
                      })
                    }
                  })
                }
  
  
                function saveglobalsat() {
                  var data1 = response.data['m2m:cin']['con']
                  // var time = response.data['m2m:cin']['lt']
                  // data1 = hex64.decode(data1)
                  // console.log(data1)
                  var bagi = 64
                  var gr = data1.substr(2, 2)
                  var percent = data1.substr(4, 2)
                  if (percent <= 20) {
                    percent = 0
                  } else {
                    percent = 1
                  }
                  var lat = data1.substr(6, 8)
                  lat = hexdec.hexToDec(lat) * 0.000001
                  // console.log(lat)
                  var long = data1.substr(14, 8)
                  long = hexdec.hexToDec(long) * 0.000001
                  // console.log(long)
  
                  // gr = hexbin(gr)
                  // console.log(gr)
                  var status = (hexdec.hexToDec(gr)) / bagi
                  // console.log(status)
                  if (status == 0) {
                    status = 'not fix'
                  } else if (status > 0 && status <= 2) {
                    status = '2D'
                  } else if (status >= 2) {
                    status = '3D'
                  } else {
                    status = 'undefined'
                  }
                  var report = (hexdec.hexToDec(gr)) % bagi
                  // console.log(report)
                  switch (report) {
                    case 2:
                      report = 'Periodic Mode'
                      break;
                    case 4:
                      report = 'Static Motion'
                      break;
                    case 5:
                      report = 'Moving Motion'
                      break;
                    case 6:
                      report = 'Static to Moving'
                      break;
                    case 7:
                      report = 'Moving to Static'
                      break;
                    case 14:
                      report = 'Help'
                      break;
                    case 15:
                      report = 'LowBatt Alarm'
                      break;
                    case 17:
                      report = 'Power On (temp)'
                      break;
                    case 19:
                      report = 'Power Off (lowbatt)'
                      break;
                    case 20:
                      report = 'Power Off (temp)'
                      break;
                    case 24:
                      report = 'Fall advisory report'
                      break;
                    case 27:
                      report = 'Fpending report'
                      break;
                    default:
                      report = 'Periodic Mode'
                  }
  
  
  
  
  
                  var devname = new Devname()
                  devname.devicename = devnamee
                  // devname.tipe = 1
                  // devname.owner = 'fani'
                  devname.lat = lat
                  devname.long = long
                  devname.alt = report
                  devname.status = status
                  devname.percent = percent
                  // console.log(lat,long,percent,devnamee)
  
  
                  devname.save((err, y) => {
                    if (!err) {
                      // console.log(y)
                    } else {
                      // console.log(err)
  
                      Devname.updateOne({
                        devicename: devnamee
                      }, {
                        $set: {
                          lat: lat,
                          long: long,
                          alt: report,
                          status: status,
                          percent: percent,
                          updatedAt: moment().toISOString()
                        }
                      }, (err, oke) => {
                        // console.log(devnamee)
                        if (!err) {
                          // console.log(oke)
                        } else {
                          console.log(err)
                        }
                      })
                      //
                    }
                  })
                }
                if (err) {
                  console.log(err)
                } 
                else if (tipe.tipe == '1') {
                  savedragino()
                }
                else if (tipe.tipe == '2') {
                  savegps()
                }
                else if (tipe.tipe == '3') {
                  saveglobalsat()
                }
                else {
                  var devname = new Devname()
                  devname.devicename = devnamee
                  devname.tipe = 1
                  // devname.owner = 'fani'
                  devname.lat = 0
                  devname.long = 0
                  devname.alt = 0
                  devname.status = 0
                  devname.percent = 0
                  devname.save((err, y) => {
                    if (!err) {
                      console.log(y)
                    } else {

                      Devname.update({
                        devicename: devnamee
                      }, {
                        $set: {
                          lat: 0,
                          long: 0,
                          status: 0,
                          percent: 0,
                          updatedAt: moment().toISOString()
                        }
                      }, (err, oke) => {
                        // console.log(devnamee)
                        if (!err) {
                          // console.log(oke)
                        } else {
                          console.log(err)
                        }
                      })
                      //
                    }
                  })
                }
              })
            })
            .catch((error) => {
              // console.log(chalk.yellow(error))
            })

        })

      })
      .catch((error) => {
        // handle error
        console.log(chalk.red(error));
      })
      .finally(() => {
        if (req.session.tipe != 'admin') {
          admin = false
          Devname.find({
            owner: req.session.name
          }, (err, nama) => {
            if (nama[0] == null) {
              res.render('index', {
                percent: '-',
                user: req.session.name,
                idd: req.session.id2,
                total: '-',
                alarm: '-',
                data: '-',
                update: '-',
                admin: admin,
              })
            } else {
              Devname.find({
                owner: req.session.name
              }).count({
                percent: 0
              }, (err, x) => {
                Devname.count({
                  owner: req.session.name
                }, (err, z) => {
                  Devname.find({
                    owner: req.session.name
                  }).count({
                    status: 'ON'
                  }, (err, a) => {
                    Devname.find({
                      owner: req.session.name
                    }).sort({
                      updatedAt: -1
                    }).exec((err, data) => {
                      res.render('index', {
                        percent: x,
                        user: req.session.name,
                        idd: req.session.id2,
                        total: z,
                        alarm: a,
                        data: data,
                        update: data[0].updatedAt,
                        admin: admin,
                      })
                    })
                  })
                })
              })
            }
          })

        } else {
          // Devname.find({}).count({percent:0},(err, x)=>{
          // console.log(x)
          admin = true
          Devname.find({
            tipe: '1'
          }).count({}, (err, typeee) => {

            // console.log(typeee)
            function tipe2() {
              Devname.find({
                tipe: '2'
              }).count({}, (err, tipe2) => {
                // console.log(tipe2)
                function tipe3() {
                  Devname.find({
                    tipe: '3'
                  }).count({}, (err, tipe3) => {
                    // console.log(tipe3)
                    function data() {
                      Devname.find({}).sort({
                        updatedAt: -1
                      }).exec((err, b) => {
                        // function render(){
                        Devname.count({
                          active: 0
                        }, (err, active) => {
                          // console.log(active)

                          // console.log(b)
                          if (err) {
                            res.render('index', {
                              user: req.session.name,
                              idd: req.session.id2,
                              tipe1: typeee,
                              tipe2: tipe2,
                              tipe3: tipe3,
                              active: active,
                              admin: admin,
                              // update:b[0].updatedAt,
                              // data:b,
                            })
                          } else {
                            res.render('index', {
                              user: req.session.name,
                              idd: req.session.id2,
                              tipe1: typeee,
                              tipe2: tipe2,
                              tipe3: tipe3,
                              active: active,
                              update: b[0].updatedAt,
                              data: b,
                              admin: admin,
                            })
                          }
                          // }
                        })
                      })
                    }

                    if (err) {
                      tipe3 = 0
                      data()
                    } else {
                      data()
                    }
                  })
                }
                if (err) {
                  tipe2 = 0
                  tipe3()
                } else {
                  tipe3()
                }
              })
            }
            if (err) {
              typeee = 0
              tipe2()
            } else {
              tipe2()
            }

          })
        }
      })
  } else {
    res.redirect('/')
  }




})

module.exports = router;