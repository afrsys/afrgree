(function () {

  'use strict';

  var mongoose = require('mongoose');
  var ObjectId = mongoose.Schema.Types.ObjectId;
  var Schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createDate: { type: Date, required: true, default: Date.now },
    closeDate: { type: Date, required: true },
    author: { type: ObjectId, required: true, ref: 'users' },
    votes: [{
      user: { type: ObjectId, required: true, ref: 'users' },
      option: { type: Boolean, required: true }
    }],
    posts: [{
      user: { type: ObjectId, required: true, ref: 'users' },
      message: { type: String, required: true },
      date: { type: Date, required: true, default: Date.now }
    }],

  });

  Schema.virtual('isActive')
  .get(function () {
    return this.closeDate.getTime() > Date.now();
  });
  //TODO addPost
  //TODO vote
  //TODO result

  module.exports = mongoose.model('surveys', Schema);

})();
