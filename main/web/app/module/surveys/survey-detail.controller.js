(function () {

  'use strict';
  angular
    .module('afrgree.surveys')
    .controller('SurveyDetailCtrl', SurveyDetailCtrl);

  function SurveyDetailCtrl($stateParams, _, alertService, surveyPromise, surveysService) {

    var ctrl = this;
    
    /*if (ctrl.isActive) {
      ctrl.result = countVotes(ctrl.survey.votes);
    }
    console.log(ctrl.survey);
    function countVotes(votes) {

      var activeCount = 0;
      var retiredCount = 0;
      var count = votes.length;
      var result = {
        total: 0,
        active: 0,
        retired: 0
      };

      _(votes).forEach(function (vote) {
        if (vote.type === 'active') {

          if (vote.option === true) {

            result.total++;
            result.active++;

          }
          activeCount++;

        } else {

          if (vote.option === true) {

            result.total++;
            result.retired++;

          }
          retiredCount++;

        }
      }).value();

      if (count) { result.total /= count; }
      if (activeCount) { result.active /= activeCount; }
      if (retiredCount) { result.retired /= retiredCount; }
      
      return result;
      
    }*/

    ctrl.post = function () {

      surveysService.post(ctrl.survey._id, ctrl.message)
      .then(function (postResponse) {

        ctrl.message = null;
        var lastPost = _.max(ctrl.survey.posts, function (post) {
          return new Date(post.date).getTime();
        });

        surveysService.getNewestPosts(ctrl.survey._id, new Date(lastPost.date).getTime())
        .then(function (getResponse) {

          console.log(getResponse);
          Array.prototype.unshift.apply(ctrl.survey.posts, getResponse.data);
          ctrl.lastNewestLoad = Date.now();

        }).catch(function (getError) {

          console.log(getError);
          ctrl.survey.posts.push(postResponse.data);
          alertService.error('Não foi possível carregar as novas postagens.');
        
        });

      }).catch(function (postError) {

        console.log(postError);
        alertService.error('Não foi possível efetuar a postagens.');
      
      });
      
    };

    ctrl.loadPosts = function () {
      
      surveysService.getPosts(ctrl.survey._id, ctrl.survey.posts.length)
      .then(function (res) {
        
        switch (res.status) {
          case 200:
            Array.prototype.unshift.apply(ctrl.survey.posts, res.data);
            ctrl.hasMore = res.data.length >= 20;
            break;
          case 204:
            ctrl.hasMore = false;
            break;
          default:
            console.log('unknownStatus', res.status);
        }

      }).catch(function (error) {

        console.log(error);
        alertService.error('Não foi possível carregar as postagens.');
      
      });

    };

    function initialize() {

      ctrl.survey = surveyPromise.data;
      ctrl.survey.posts = [];
      ctrl.message = null;
      ctrl.isActive = new Date(ctrl.survey.closeDate).getTime() > Date.now();
      ctrl.loadPosts();
      
    }

    initialize();

  }

})();
