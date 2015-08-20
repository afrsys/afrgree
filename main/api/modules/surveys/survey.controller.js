(function () {

  'use strict';
  var Survey = require('./Survey');
  var errorCode = require('../../core/errorCode');
  var config = require('../../config');
  var router = require('express').Router();

  router.get('/:id', detail);
  router.get('/', list);
  exports.router = router;

  function list (req, res, next) {
    
    var i = req.query.i || 0;

    Survey.find()
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
    }, function (err) {
      return next(err);
    });

  }

  function detail (req, res, next) {

    var id = req.params.id;

    Survey.findOne({ _id: id })
    .exec()
    .then(function (data) {
      if (data) {
        return res.jsonp(data);
      } else {
        return next(errorCode(new Error('notFound'), 404));
      }
    }, function (err) {
      return next(err);
    });

  }

  router.post('/:id', function (req, res, next) {

    var post = {
      message: req.body.message,
      user: req.user._id,
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
    }, function (err) {
      return next(err);
    });

  });

})();
