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
      .then(function (res) {

        ctrl.message = null;
        //ctrl.survey.posts.push(res.data);
        ctrl.loadPosts();


      })
      .catch(function (res) {
        
        var message = null;
        
        switch (res.status){
          case 400:
            message = 'Usuário ou senha incorretos.';
            break;
          default:
            message = 'Não foi possível efetuar autenticação no servidor.';
            break;
        }
        alertService.error(message);

      });
      
    };

    ctrl.loadPosts = function () {
      console.log(ctrl.survey._id, ctrl.survey.posts.length)
      surveysService.getPosts(ctrl.survey._id, ctrl.survey.posts.length)
      .then(function (res) {
        console.log(res.status)
        if (res.status !== 204) {
          Array.prototype.unshift.apply(ctrl.survey.posts, res.data);
          ctrl.hasMore = ctrl.survey.posts.length >= 20;
        } else {
          ctrl.hasMore = false;
        }
      }).catch(function (data) {
        alertService.error('Não foi possível carregar as postagens');
      })
    }

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
