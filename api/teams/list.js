module.exports = function (app, db) {

  // List all teams the user has access to
  app.get('/orgs/:org/teams', app.auth.user, function (req, res, next) {
    db.view('teams', 'user', {keys: [app.utils.slug(req.org) + '/' + req.user.username]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {
        body = body.rows.map(function (row) {
          app.utils.shield(row.value, ['_rev']);
          row.value.users = Object.keys(row.value.users);
          return row.value;
        });

        res.json(body);
      } else next();
    });
  });
};
