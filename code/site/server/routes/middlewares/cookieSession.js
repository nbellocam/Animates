'use strict';

/**
* Set a cookie for angular so it knows we have an http session
*/
exports.setUserCookie = function(req, res, next) {
    if(req.user) {
        res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
};