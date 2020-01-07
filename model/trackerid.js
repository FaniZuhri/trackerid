var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tipe: {
        type: String,
        required: true
    }
})

schema.set('timestamps', true)

schema.pre('save', function (next) {
    var trackerid = this
  
    if (!trackerid.isModified('pass')) return next()
  
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err)
  
      bcrypt.hash(trackerid.pass, salt, function (err, hash) {
        if (err) return next(err)
  
        trackerid.pass = hash
        next()
      })
    })
  })
  
  schema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.pass, function (err, isMatch) {
      if (err) return cb(err)
      cb(null, isMatch)
    })
  };

schema.virtual('id').get( function() {
    return this._id.toHexString()
})

schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v
        ret.id = ret._id.toString()
        delete ret._id
    }
})

schema.set('toObject', {
    virtuals: true
})

module.exports = mongoose.model('trackerid', schema)