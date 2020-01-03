Mongoose Timestamps Plugin
==========================

[![Build Status](https://travis-ci.org/sthnaqvi/timestamp-mongoose.svg?branch=master)](https://travis-ci.org/sthnaqvi/timestamp-mongoose)
[![Dependency Status](https://david-dm.org/sthnaqvi/timestamp-mongoose.svg)](https://david-dm.org/sthnaqvi/timestamp-mongoose)
[![devDependency Status](https://david-dm.org/sthnaqvi/timestamp-mongoose/dev-status.svg)](https://david-dm.org/sthnaqvi/timestamp-mongoose#info=devDependencies)
[![Downloads Monthly](https://img.shields.io/npm/dm/timestamp-mongoose.svg)](https://www.npmjs.com/package/timestamp-mongoose)
[![Downloads Total](https://img.shields.io/npm/dt/timestamp-mongoose.svg)](https://www.npmjs.com/package/timestamp-mongoose)

Simple plugin for [Mongoose](https://github.com/Automattic/mongoose) which adds `createdAt` and `updatedAt` date attributes
that get auto-assigned to the most recent create/update timestamp.

## Installation

`npm install timestamp-mongoose`

## Usage

```javascript
var timestamps = require('timestamp-mongoose');
var UserSchema = new Schema({
    username: String
});
UserSchema.plugin(timestamps);
mongoose.model('User', UserSchema);
var User = mongoose.model('User', UserSchema)
```
The User model will now have `createdAt` and `updatedAt` properties, which get
automatically generated and updated when you save your document.

```javascript
var user = new User({username: 'Prince'});
user.save(function (err) {
  console.log(user.createdAt); // Should be approximately now
  console.log(user.createdAt === user.updatedAt); // true
  // Wait 1 second and then update the user
  setTimeout( function () {
    user.username = 'Symbol';
    user.save( function (err) {
      console.log(user.updatedAt); // Should be approximately createdAt + 1 second
      console.log(user.createdAt < user.updatedAt); // true
    });
  }, 1000);
});
```
#### findOneAndModify (mongoose >= 4.0.1)

Mongoose 4.0.1 added support for findOneAndModify hooks. You must the mongoose promise exec for the hooks to work as mongoose uses mquery when a callback is passed and the hook system is bypassed.

```javascript
User.findOneAndUpdate({username: 'Prince'}, { password: 'goatcheese' }, { new: true, upsert: true })
            .exec(function (err, updated) {
                console.log(user.updatedAt); // Should be approximately createdAt + 1 second
                console.log(user.createdAt < user.updatedAt); // true
            });
```

You can specify custom property names by passing them in as options like this:

```javascript
mongoose.plugin(timestamps,  {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
```

Any model's updatedAt attribute can be updated to the current time using `touch()`.
