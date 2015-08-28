(function () {

  'use strict';

  var mongoose = require('mongoose');
  var Types = mongoose.Schema.Types;
  var _ = require('lodash');
  var typeEnum = 'Simple Multiple Colaborative'.split(' ');
  var Schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createDate: { type: Date, required: true, default: Date.now },
    closeDate: { type: Date, required: true },
    author: { type: Types.ObjectId, required: true, ref: 'users' },
    type: { type: String, required: true, enum: typeEnum, default: 'Simple' },
    ballot: [{
      option: { type: Types.Mixed, required: true },
      votes: [{
        user: { type: Types.ObjectId, required: true, ref: 'users' },
        tags: [String]
      }]
    }],
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
  //TODO result

  Schema.methods.addPost = function (userId, message) {

    var post = {
      message: message,
      user: userId,
      date: Date.now()
    };

    this.posts.unshift(post);
    return post;

  };

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
      };
      this.votes.push(vote);

    }

    return vote;

  };

  module.exports = mongoose.model('surveys', Schema);

})();
