var _ = require('lodash');

function trimPrefix(path, prefix) {
    return path.substr(prefix.length);
}

function findRoute(stack, path) {
    var route;

    function _findRoute(s, p) {
        for(var layer of s) {
            if (!layer) continue;

            if (!layer.match(p)) continue;

            if (layer.name == 'router') {
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

module.exports = function removeRoute(stack, path) {
    var found, route, idx;
    
    found = findRoute(stack, path);
    if (!found) return false;

    route = found.route;
    stack = found.stack;

    idx = stack.indexOf(route);
    stack.splice(idx, 1);
    return true;
}
