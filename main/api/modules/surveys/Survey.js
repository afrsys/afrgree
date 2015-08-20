(function () {

  'use strict';

  var mongoose = require('mongoose');
  var Schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createDate: { type: Date, required: true, default: Date.now },
    closeDate: { type: Date, required: true },
    votes: [{
      user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
      option: { type: Boolean, required: true }
    }],
    posts: [{
      user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
      message: { type: String, required: true },
      date: { type: Date, required: true, default: Date.now }
    }],

  });

  module.exports = mongoose.model('surveys', Schema);

})();
