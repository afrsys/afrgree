'use strict';

var router = require('express').Router();
var Survey = require('./Survey');
var security = require('../../users/api/security');

module.exports = router;

router.use(security.isAuth());

router.get('/', function (req, res, next) {

  var i = parseInt(req.query.i || 0);

  Survey.find({}, { title: 1, closeDate: 1, lastUpdate: 1 })
  .sort({ lastUpdate: 'desc' })
  .skip(i)
  .limit(20) //redis
  .exec()
  .then(function (data) {
    
    if (data && data.length > 0) {
      return res.jsonp(data);
    } else {
      return res.status(204).jsonp([]);
    }
  }, next);

});

router.post('/', function (req, res, next) {

  if (req.body.title && req.body.description && req.body.closeDate &&
    new Date(req.body.closeDate) > Date.now()) {

    Survey.create({
      title: req.body.title,
      description: req.body.description,
      author: req.user._id,
      closeDate: new Date(req.body.closeDate)
    }).then(function (data) {
      return res.status(201).jsonp(data);
    }, next);
  } else {
    return next(new Error('core.missing'));
  }

});

router.get('/:id', function (req, res, next) {

  Survey.findOne({ _id: req.params.id }, { votes: 0, posts: 0 })
  .populate('posts.user', 'name')
  .exec()
  .then(function (survey) {
    if (survey) {
      return res.jsonp(survey);
    } else {
      return next(new Error('core.notFound'));
    }
  }, next);

});

router.post('/:id/posts', function (req, res, next) {

  if (req.body.message) {

    Survey.findOne({ _id: req.params.id })
    .exec()
    .then(function (survey) {

      if (survey) {

        if (survey.isActive) {
          
          var post = survey.addPost(req.user._id, req.body.message);

          post.user = { _id: post.user, name: req.user.name };
          survey.save(function (err) {
            if (!err) {
              res.status(201).jsonp(post);
            } else {
              next(err);
            }

          });

        } else {
          return next(new Error('core.invalidState'));
        }

      } else {

        return next(new Error('core.notFound'));
      }

    }, next);

  } else {
    return next(new Error('core.missing'));
  }

});

router.get('/:id/posts', function (req, res, next) {

  Survey.findOne({ _id: req.params.id }, {
    votes: 0, description: 0, closeDate: 0, createDate: 0, title:0,
    posts: { $slice: [parseInt(req.query.i || 0), 20] } })
  .populate('posts.user', 'name')
  .exec()
  .then(function (survey) {

    if (survey) {

      if (survey.posts && survey.posts.length > 0) {
        return res.jsonp(survey.posts.reverse());
      } else {
        return res.status(204).send();
      }

    } else {
      return next(new Error('core.notFound'));
    }
  }, next);

});

router.get('/:id/posts/:time(\\d+)', function (req, res, next) {

  Survey.findOne({ _id: req.params.id }, {
    votes: 0, description: 0, closeDate: 0, createDate: 0, title:0,
    posts: { $slice: [0, 100] } })
  .populate('posts.user', 'name')
  .exec()
  .then(function (survey) {
    if (survey) {
      if (survey.posts && survey.posts.length > 0) {

        var time = parseInt(req.params.time);
        var result = survey.posts.filter(function (post) {
          return post.date.getTime() > time;
        }).reverse();

        if (result.length > 0) {
          return res.jsonp(result);
        } else {
          return res.status(204).send();
        }

      } else {
        return res.status(204).send();
      }

    } else {
      return next(new Error('core.notFound'));
    }
  }, next);

});
