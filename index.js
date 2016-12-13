var _ = require('lodash');

function override(object, methodName, callback) {
  object[methodName] = callback(object[methodName])
}


function trimPrefix(path, prefix) {
    return path.substr(prefix.length);
}

function removeRoute(stack, path) {
    var found, route, idx;
    
    found = findRoute(stack, path);
    if (!found) return false;

    route = found.route;
    stack = found.stack;

    idx = stack.indexOf(route);
    stack.splice(idx, 1);
    return true;
}

function findRoute(stack, path) {
    var route;

    function _findRoute(s, p) {
        for(var layer of s) {
            if (!layer) continue;

            console.log(`path=${layer.path} name=${layer.name} regexp=${layer.regexp}`);

            console.log(layer.match(p));
            if (!layer.match(p)) continue;

            if (layer.name == 'router') {
                console.log(`path=${layer.path}`);
                var _p = trimPrefix(p, layer.path);
                var _s = layer.handle.stack;
                return _findRoute(_s, _p);
            } else {
                return { stack: s, route: layer };
            }
        }

        return null;        
    }

    return _findRoute(stack, path);
}

module.exports = function (config) {
    if (config.backend) {
        console.log(removeRoute(config.backend.router.stack, '/leaderboard/seasons'));
        console.log(removeRoute(config.backend.router.stack, '/leaderboard/find'));
        console.log(removeRoute(config.backend.router.stack, '/leaderboard/list'));

        // https://screeps.com/api/leaderboard/seasons
        config.backend.router.get('/leaderboard/seasons', (request, response, next) => {
            response.json({ 
                ok: 1, 
                seasons: [
                    {
                         _id: "2016-12", 
                         "name": "December 2016", 
                         "date": "2016-12-01T00:00:05.105Z"
                     }
                ]});
        });

        // https://screeps.com/api/leaderboard/find?mode=world&season=2016-12&username=pentar'
        config.backend.router.get('/leaderboard/find', (request, response, next) => {
            response.json({ error: "result not found" });
        });

        // https://screeps.com/api/leaderboard/list?limit=10&mode=world&offset=0&season=2016-12'
        config.backend.router.get('/leaderboard/list', (request, response, next) => {
            response.json({
                ok: 1,
                list: [
                    {
                        _id: "583f682780bb5a3d2b36f1a5",
                        season: "2016-12",
                        user: "561e4d4645f3f7244a7622e8",
                        score: 183696564,
                        rank: 0
                    },
                ],
                count: 1,
                users: {
                    "561e4d4645f3f7244a7622e8": {
                        "_id": "561e4d4645f3f7244a7622e8",
                        "username": "Dissi",
                        "badge": {
                            "type": {
                                "path1": "M0,50c0,27.3,21.8,49.5,48.9,50v-9.6c-2.5-0.8-5.5-4.6-7.8-10.2c-0.9-2.3-1.7-4.7-2.4-7.4   c3.3,0.3,6.7,0.5,10.2,0.5v-9.5c-4.2,0-8.2-0.3-12-0.8c-0.5-4.1-0.8-8.5-0.8-13c0-4.5,0.3-8.9,0.8-13c3.8-0.5,7.9-0.8,12-0.8v-9.5   c-3.5,0-6.9,0.2-10.2,0.5c0.7-2.7,1.5-5.1,2.4-7.4c2.3-5.6,5.2-9.4,7.8-10.2V0C21.8,0.5,0,22.7,0,50L0,50z M9.5,50   c0-2.7,4-6.2,10.2-8.7c2.3-0.9,4.7-1.7,7.4-2.4c-0.4,3.6-0.5,7.3-0.5,11.1c0,3.8,0.2,7.5,0.5,11.1c-2.6-0.7-5.1-1.5-7.4-2.4   C13.5,56.2,9.5,52.7,9.5,50L9.5,50z M12.8,66c1.1,0.5,2.2,1.1,3.4,1.5c3.7,1.5,7.9,2.8,12.5,3.7c0.9,4.6,2.2,8.8,3.7,12.5   c0.5,1.2,1,2.3,1.5,3.4C24.4,83.1,16.8,75.5,12.8,66L12.8,66z M33.9,12.8c-0.5,1.1-1,2.2-1.5,3.4c-1.5,3.7-2.8,8-3.7,12.5   c-4.5,0.9-8.8,2.2-12.5,3.7c-1.2,0.5-2.3,1-3.4,1.5C16.8,24.5,24.4,16.9,33.9,12.8L33.9,12.8z",
                                "path2": "M97,59l-6-3.4c0.3-1.8,0.4-3.7,0.4-5.6c0-1.9-0.1-3.7-0.4-5.6l6-3.4c2.8-1.6,3.8-5.2,2.2-8.1   l-8.6-15.2c-0.8-1.4-2.1-2.4-3.6-2.8c-1.5-0.4-3.1-0.2-4.5,0.6l-6.1,3.5c-3.1-2.5-6.6-4.6-10.3-6v-7c0-3.3-2.6-5.9-5.9-5.9h-7.7   v23.4C66.8,23.9,78.1,35.7,78.1,50c0,14.3-11.4,26.1-25.5,26.6V100h7.7c3.3,0,5.9-2.7,5.9-5.9v-7c3.7-1.5,7.2-3.5,10.3-6l6.1,3.5   c0.9,0.5,1.9,0.8,2.9,0.8c0.5,0,1.1-0.1,1.6-0.2c1.5-0.4,2.8-1.4,3.6-2.8l8.6-15.2C100.8,64.2,99.8,60.6,97,59L97,59z"
                            },
                            "color1": "#ffffff",
                            "color2": "#ff0000",
                            "color3": "#1fb006",
                            "param": 0,
                            "flip": false
                        },
                        "gcl": 4172117159
                    }
                }
            });
        })
    }
};