(function () {

  'use strict';

  /*jshint expr: true*/
  var q = require('q');
  var expect = require('chai').expect;
  var sinon = require('sinon');
  var server = require('./server.js');
  var app = require('./core/app');
  var db = require('./core/db');

  describe('server', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('Everything is fine', function () {

      it ('calls app.create, db.connect and listen on config port', function (done) {

        var conn, create, info;

        conn = sandbox.stub(db, 'connect', connect);
        create = sandbox.stub(app, 'create').returns({ listen: listen });
        info = sandbox.stub(server.logger, 'info');
        sandbox.stub(process, 'exit');

        server.run();

        expect(create.firstCall.args[0] === require('./modules/router')).to.be.true;
        expect(conn.calledOnce).to.be.true;

        function connect() {
          return q.resolve();
        }

        function listen(httpPort, fn) {
          try {

            expect(httpPort).to.be.equals(server.config.httpPort);
            fn();
            expect(info.getCall(3).args[0].httpPort)
              .to.be.equals(server.config.httpPort);
            done();

          } catch (err) {
            done(err);
          }
        }

      });
    });

    describe('DB error', function () {
      it ('do not call listen and calls process.exit()', function (done) {

        var conn, create;

        conn = sandbox.stub(db, 'connect', connect);
        create = sandbox.stub(app, 'create').returns({ listen: listen });
        sandbox.stub(process, 'exit', exit);

        server.run();
        expect(create.firstCall.args[0] === require('./modules/router')).to.be.true;
        expect(conn.calledOnce).to.be.true;

        function connect() {
          return q.reject();
        }

        function listen() {
          done(new Error('Unexpected call'));
        }

        function exit(code) {
          try {

            expect(code).to.be.equals(1);
            done();

          } catch (err) {
            done(err);
          }
        }

      });
    });

  });

})();
