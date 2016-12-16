var _ = require('lodash');
var removeRoute = require('./removeRoute');

module.exports = function (config) {
    if (config.backend) {
        removeRoute(config.backend.router.stack, '/leaderboard/seasons');
        removeRoute(config.backend.router.stack, '/leaderboard/find');
        removeRoute(config.backend.router.stack, '/leaderboard/list');

        // https://screeps.com/api/leaderboard/seasons
        config.backend.router.get('/leaderboard/seasons', (request, response, next) => {
            var now = new Date();
            var month = new Date(now.getFullYear(), now.getMonth(), 1);

            response.json({ 
                ok: 1, 
                seasons: [
                    {
                         _id: "Current", 
                         "name": "Current", 
                         "date": month
                     }
                ]});
        });

        // https://screeps.com/api/leaderboard/find?mode=world&season=2016-12&username=pentar'
        config.backend.router.get('/leaderboard/find', (request, response, next) => {
            response.json({ error: "result not found" });
        });

        // https://screeps.com/api/leaderboard/list?limit=10&mode=world&offset=0&season=2016-12'
        config.backend.router.get('/leaderboard/list', (request, response, next) => {
            config.common.storage.db.users.find().then(data => 
            {
                var result = [];
                var users = {};
                for(var user of data) {
                    if (!user.steam) continue;

                    result.push({ season: "Current", user: user._id, username: user.username, score: user.gcl });
                    users[user._id] = {
                        username: user.username,
                        badge: user.badge,
                        gcl: user.gcl
                    }
                }
                
                result.sort((a,b) => a.score - b.score);

                var rank = 0;
                for(var entry of result) {
                    entry.rank = rank++;
                }

                response.json({ 
                    ok: 1, 
                    list: result,
                    count: result.length,
                    users: users
                });
            });
        })
    }
};