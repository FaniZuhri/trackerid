var Handlebars = require('handlebars')
var paginate = require('handlebars-paginate')
// var moment = require('moment')
var TimeAgo = require('javascript-time-ago')
var NumeralHelper = require('handlebars.numeral')
NumeralHelper.registerHelpers(Handlebars)
var en = require('javascript-time-ago/locale/en')
TimeAgo.locale(en)
var timeAgo = new TimeAgo()

var register = function (Handlebars) {
  var helpers = {
    // put all of your helpers inside this object
    math: function (lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue)
      rvalue = parseFloat(rvalue)

      return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue
      }[operator]
    },
    time: (time) => {
      return timeAgo.format(time, 'twitter') || 'now'
    },
    rupiah: (amount) => {
      return Number(amount.toFixed(1)).toLocaleString()
    },
    paginate: paginate,
    orderAddress: (address) => {
      if (address) {
        return address.street + ', ' + address.village + ', ' + address.district + ', ' + address.city + ', ' + address.province + ', ' + address.postalCode
      }
      return '-'
    }

  }

  if (Handlebars && typeof Handlebars.registerHelper === 'function') {
    // register helpers
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop])
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers
  }
}

module.exports.register = register
module.exports.helpers = register(null)
