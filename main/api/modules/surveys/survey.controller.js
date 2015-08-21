(function () {

  'use strict';
  var Survey = require('./Survey');
  var errorCode = require('../../core/errorCode');
  var config = require('../../config');
  var router = require('express').Router();

  exports.router = router;

  router.get('/', function (req, res, next) {
    
    var i = req.query.i || 0;

    Survey.find({}, { title: 1, closeDate: 1 })
    .sort({ closeDate: -1 })
    .skip(parseInt(i))
    .limit(config.pageSize)
    .exec()
    .then(function (data) {
      if (data && data.length > 0) {
        return res.jsonp(data);
      } else {
        return res.status(204).jsonp([]);
      }
    }, next);

  });

  router.get('/:id', function (req, res, next) {

    Survey.findOne({ _id: req.params.id }, { votes: 0, posts: 0 })
    .populate('posts.user', 'name')
    .exec()
    .then(function (survey) {
      if (survey) {
        return res.jsonp(survey);
      } else {
        return next(errorCode(new Error('notFound'), 404));
      }
    }, next);

  });

  router.post('/:id/posts', function (req, res, next) {

    if (req.body.message) {

      var post = {
        message: req.body.message,
        user: { _id: req.user._id, name: req.user.name },
        date: Date.now()
      };

      Survey.findOne({ _id: req.params.id })
      .exec()
      .then(function (survey) {

        if (survey) {

          if (survey.isActive) {

            survey.posts.unshift(post);
            survey.save(function (err) {

              if (!err) {
                res.status(201).jsonp(post);
              } else {
                next(err);
              }

            });

          } else {
            return next(errorCode(new ReferenceError(), 400));
          }

        } else {

          return next(errorCode(new Error('notFound'), 404));
        }

      }, next);

    } else {
      return next(errorCode(new ReferenceError(), 400));
    }

  });

  router.get('/:id/posts', function (req, res, next) {

    var i = req.query.i || 0;

    console.log({reqI: req.query.i, i: i});

    Survey.findOne({ _id: req.params.id }, { posts: { $slice: [ i, config.pageSize ] } })
    .populate('posts.user', 'name')
    .exec()
    .then(function (survey) {

      if (survey) {

        if (survey.posts && survey.posts.length > 0) {
          return res.jsonp(survey.posts);
        } else {
          return res.status(204).send();
        }

      } else {
        return next(errorCode(new Error('notFound'), 404));
      }
    }, next);

  });

})();
