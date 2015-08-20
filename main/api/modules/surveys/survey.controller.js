(function () {

  'use strict';
  var Survey = require('./Survey');
  var errorCode = require('../../core/errorCode');
  var config = require('../../config');
  var router = require('express').Router();

  router.get('/', list);
  exports.router = router;

  function list (req, res, next) {
    
    var i = req.query.i || 0;

    Survey.find()
    .sort({ closeDate: -1 })
    .skip(parseInt(i))
    .limit(config.pageSize)
    .populate('posts.user.name')
    .exec()
    .then(function (data) {
      if (data && data.length > 0) {
        return res.jsonp(data);
      } else {
        return res.status(204).jsonp([]);
      }
    }, next);

  }

  router.get('/:id', function (req, res, next) {

    Survey.findOne({ _id: req.params.id })
    .exec()
    .then(function (survey) {
      if (survey) {
        return res.jsonp(survey);
      } else {
        return next(errorCode(new Error('notFound'), 404));
      }
    }, next);

  });

  router.post('/:id/post', function (req, res, next) {

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

          survey.posts.push(post);
          survey.save(function (err) {

            if (!err) {
              res.status(201).jsonp(post);
            } else {
              next(err);
            }

          });

        } else {
          return next(errorCode(new Error('notFound'), 404));
        }

      }, next);

    } else {
      return next(errorCode(new ReferenceError(), 400));
    }

  });

})();
