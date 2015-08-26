(function () {

  'use strict';

  var mongoose = require('mongoose');
  var Types = mongoose.Schema.Types;
  var _ = require('lodash');
  var Schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createDate: { type: Date, required: true, default: Date.now },
    closeDate: { type: Date, required: true },
    author: { type: Types.ObjectId, required: true, ref: 'users' },
    votes: [{
      user: { type: Types.ObjectId, required: true, ref: 'users' },
      option: { type: Types.Mixed, required: true }
    }],
    posts: [{
      user: { type: Types.ObjectId, required: true, ref: 'users' },
      message: { type: String, required: true },
      date: { type: Date, required: true, default: Date.now }
    }],

  });

  Schema.virtual('isActive')
  .get(function () {
    return this.closeDate.getTime() > Date.now();
  });
  //TODO addPost
  //TODO result

  Schema.methods.vote = function (userId, option) {

    var vote = _.find(this.votes, function (vote) {
      return vote.user.equals(userId) || (vote.user._id && vote.user._id.equals(userId));
    });

    if (vote) {
      vote.option = option;
    } else {

      vote = {
        user: userId,
        option: option
      }
      this.votes.push(vote);

    }

    return vote;

  }

  module.exports = mongoose.model('surveys', Schema);

})();
