var assert = require('assert');

module.exports = function (macro) {
  return {
    'Projects': {
      'Retrieving non-existent project': {
        topic: function () {
          macro.get('/orgs/jsmith/projects/eng', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving project with no access': {
        topic: function () {
          macro.get('/orgs/confyio/projects/main', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving project with member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/knowledge-base', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the project': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/projects/knowledge-base');
          assert.equal(body.name, 'Knowledge Base');
          assert.equal(body.description, 'Wiki & FAQ support');
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'project');
        },
        'should return teams array': function (err, res, body) {
          assert.deepEqual(body.teams, ['owners', 'consultants']);
        },
        'should not return users': function (err, res, body) {
          assert.isUndefined(body.users);
        }
      },
      'Retrieving project with owner': {
        topic: function () {
          macro.get('/orgs/confyio/projects/knowledge-base', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the project': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/projects/knowledge-base');
          assert.equal(body.name, 'Knowledge Base');
          assert.equal(body.description, 'Wiki & FAQ support');
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'project');
        },
        'should return teams array': function (err, res, body) {
          assert.deepEqual(body.teams, ['owners', 'consultants']);
        },
        'should not return users': function (err, res, body) {
          assert.isUndefined(body.users);
        }
      }
    }
  };
}
