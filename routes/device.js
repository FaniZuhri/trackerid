var express = require('express');
var router = express.Router();
var axios = require('axios');
var chalk = require('chalk');
var Devdat = require('../model/devdat.js')
var Devname = require('../model/devname')
var hex64 = require('hex64');
var hexdec = require('hex2dec');
var Tracker = require('../model/trackerid')

/* GET users listing. */
router.get('/:id', (req, res, next) => {
  if(req.session.login==true){
  // idd = req.params.idd
  // console.log(chalk.blue(idd))
  id1 = req.params.id
  // console.log(id)
  Devname.findOne({
    _id: id1
  }, 'devicename', function (err, id2) {
    id2 = id2.devicename
    // console.log(chalk.red(id2))
    var data = [];
    var dataoy = []
    var link = 'https://platform.antares.id:8443/~/antares-cse/antares-id/AntaresDemo/' + id2 + '?fu=1&ty=4&drt=1&lim=10'
    var headers = {
      'X-M2M-Origin': 'e7e349fc2216941a:9d0cf82c25277bdd',
      'Content-Type': 'application/json;ty=4',
      'Accept': 'application/json'
    }

    axios.get(link, {
        headers: headers
      })
      .then((response) => {
        // handle success
        // console.log(response)
        setTimeout(() => {
          var dataArray = response.data['m2m:uril']
          // console.log(dataArray);
          dataArray.forEach((data_id) => {
            data.push(axios.get('https://platform.antares.id:8443/~' + data_id, {
              headers: headers
            }))
          });
          axios.all(data).then((results) => {
            var xxx = 0
            function getdragino(){
              results.forEach((response) => {
                dataoy.push({
                  data: response.data['m2m:cin']['con'],
                  time: response.data['m2m:cin']['lt']
                });
                // console.log(response.data['m2m:cin']['con']);
                // var global = false
                // var trackerr = true
                // var beitian = false
                var data1 = response.data['m2m:cin']['con']
                var time = response.data['m2m:cin']['lt']
                var hex8 = 8388608
                var hex10 = 16777216
                var bat = 16383
                var alar = 64
                // console.log(data1)
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
                  var dat1 = lat - hex10
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
                if (percent >= 100) {
                  percent = 100
                } else {
                  percent = percent
                }
  
                var year = time.substr(0, 4)
                var month = time.substr(4, 2)
                var date = time.substr(6, 2)
                var hour = time.substr(9, 2)
                var min = time.substr(11, 2)
                var sec = time.substr(13, 2)
                date = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec
                // console.log(chalk.yellow(lat, long, alarm, batt, percent, date));
                var devdat = new Devdat()
                devdat.name = id2,
                  devdat.lat = lat,
                  devdat.long = long,
                  devdat.alarm = alarm,
                  devdat.batt = batt,
                  devdat.percent = percent,
                  devdat.time = date
                devdat.save((err, y) => {
                  if (!err) {
                    // console.log(chalk.green(y))
                  } else {
                    console.log(chalk.red(err))
                  }
                })
              })
            }
            function getgps(){
              results.forEach((response) => {
                dataoy.push({
                  data: response.data['m2m:cin']['con'],
                  time: response.data['m2m:cin']['lt']
                });
                // console.log(response.data['m2m:cin']['con']);
                // var global = false
                // var trackerr = false
                // var beitian = true
                var data1 = response.data['m2m:cin']['con']
                var time = response.data['m2m:cin']['lt']
                var data1 = data1.split(',',5)
                // console.log(data1)
                var lat = data1[2]
                var long = data1[3]
                var alt = data1[4].substr(0,6)

                var year = time.substr(0, 4)
                var month = time.substr(4, 2)
                var date = time.substr(6, 2)
                var hour = time.substr(9, 2)
                var min = time.substr(11, 2)
                var sec = time.substr(13, 2)
                date = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec
                // console.log(chalk.yellow(lat, long, alarm, batt, percent, date));
                var devdat = new Devdat()
                devdat.name = id2,
                  devdat.lat = lat,
                  devdat.long = long,
                  devdat.alarm = alt,
                  devdat.batt = 'undefined',
                  devdat.percent = 'undefined',
                  devdat.time = date
                devdat.save((err, y) => {
                  if (!err) {
                    // console.log(chalk.green(y))
                  } else {
                    console.log(chalk.red(err))
                  }
                })
              })
            }
            function getglobalsat(){
              results.forEach((response) => {
                dataoy.push({
                  data: response.data['m2m:cin']['con'],
                  time: response.data['m2m:cin']['lt']
                });
                // console.log(response.data['m2m:cin']['con']);
                // var global = true
                // var trackerr = false
                // var beitian = false
                var data1 = response.data['m2m:cin']['con']
                var time = response.data['m2m:cin']['lt']
                // var time = response.data['m2m:cin']['lt']
                // data1 = hex64.decode(data1)
                // console.log(data1)
                var bagi = 64
                var gr = data1.substr(2,2)
                var percent = hexdec.hexToDec(data1.substr(4,2))
                if (percent>=100){
                  percent = 100
                }
                batt = percent*820
                var lat = data1.substr(6,8)
                lat = hexdec.hexToDec(lat)*0.000001
                // console.log(lat)
                var long = data1.substr(14,8)
                long = hexdec.hexToDec(long)*0.000001
                // console.log(long)
                
                // gr = hexbin(gr)
                // console.log(gr)
                status = (hexdec.hexToDec(gr))/bagi
                // console.log(status)
                if (status==0){
                  status = 'not fix'
                }
                else if(status>0&&status<=2){
                  status = '2D'
                }
                else if (status>=2){
                  status = '3D'
                }
                else {
                  status = 'undefined'
                }
                report = (hexdec.hexToDec(gr))%bagi
                // console.log(report)
                switch(report) {
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

                var year = time.substr(0, 4)
                var month = time.substr(4, 2)
                var date = time.substr(6, 2)
                var hour = time.substr(9, 2)
                var min = time.substr(11, 2)
                var sec = time.substr(13, 2)
                date = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec
                // console.log(chalk.yellow(lat, long, alarm, batt, percent, date));
                var devdat = new Devdat()
                devdat.name = id2,
                  devdat.lat = lat,
                  devdat.long = long,
                  devdat.alarm = report,
                  devdat.batt = status,
                  devdat.percent = percent,
                  devdat.time = date
                devdat.save((err, y) => {
                  if (!err) {
                    // console.log(chalk.green(y))
                  } else {
                    console.log(chalk.red(err))
                  }
                })
              })
            }
            Devname.findOne({devicename:id2},'tipe',(err,tipe)=>{
              // console.log(tipe.tipe)
              if (tipe.tipe=='1'){
                getdragino()
              }
              if (tipe.tipe=='2'){
                getgps()
              }
              if (tipe.tipe=='3'){
                getglobalsat()
              }
            })
          })
        }, 0)
        // console.log(get.session.name)

        //console.log(chalk.red(devdatt))
      })
      .catch((error) => {
        // handle error
        console.log(chalk.red(error));
      })
      .finally(()=>{
        Devdat.find({
          name: id2
        }).limit(10).sort({_id:-1}).exec((err, docs) => {
          // console.log(docs)
          var satu = docs[9]
          // console.log(docs[0])
          if (satu==null){
            Devname.find({devicename:id2},(err,name)=>{
              // console.log(name)
              if(req.session.name=='admin'){
                admin=true
              }
              else{
                admin=false
              }
              nama=true
              res.render('./pages/device', {
                satu:name[0],
                nama:nama,
                devicename:name[0].devicename,
                user: req.session.name,
                owner:name[0].owner,
                idd: req.session.id2,
                id:id1,
                admin:admin,
              })
            })
           
          }
          if(satu!=null){
            nama=false
            Devname.findOne({devicename:docs[0].name},'tipe',(err, tipe)=>{
              // console.log(tipe)
              
              if (tipe.tipe=='1'){
                trackerr=true
                globall=false
                beitian=false
              }
              if (tipe.tipe=='2'){
                beitian=true
                trackerr=false
                globall=false
              }
              if (tipe.tipe=='3'){
                globall=true
                beitian=false
                trackerr=false
              }
              if (req.session.tipe !='admin'){
                admin=false
                res.render('./pages/device', {
                  globall:globall,
                  trackerr:trackerr,
                  beitian:beitian,
                  docs: docs,
                  satu: satu,
                  user: req.session.name,
                  owner:req.session.name,
                  idd: req.session.id2,
                  id:id1,
                  nama:nama,
                  admin:admin,
                })
              }
              else{
                Devname.find({devicename:satu.name},'owner',(err,name)=>{
                  // console.log(name[0].owner)
                  // id3=req.params.id
                  admin=true
                  res.render('./pages/device', {
                    globall:globall,
                    trackerr:trackerr,
                    beitian:beitian,
                    docs: docs,
                    satu: satu,
                    user: req.session.name,
                    owner:name[0].owner,
                    idd: req.session.id2,
                    id:id1,
                    nama:nama,
                    admin:admin,
                  })
                })
              }
            })
          }


          
        })
      })
  })
  }
  else{
    res.redirect('/')
  }

});

module.exports = router;