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

    if (checkVote(this, option)) {
      
      _.forEach(this.ballot, function (item) {
      
        _.remove(item.votes, function (vote) {
          return vote.user.equals(userId) || (vote.user._id && vote.user._id.equals(userId));
        });
            
      });

      var ballot = _.find(this.ballot, { option: option });

      if (!ballot) {
        ballot = { option: option, votes: [] };
        this.ballot.push(ballot);
      }

      ballot.votes.push({ user: userId });

      return true;

    } else {

      return false;

    }

  };

  function checkVote (survey, option) {

    switch(survey.type) {

      case 'Simple':
        return 'True False Abstent'.split(' ').indexOf(option) >= 0;
      case 'Multiple':
        return _.findIndex(survey.ballot, function (item) {
          return item.option === option;
        }) >= 0;
      default:
        return true;

    }

  }

  module.exports = mongoose.model('surveys', Schema);

})();
