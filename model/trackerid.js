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