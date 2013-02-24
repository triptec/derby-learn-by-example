var utils = require('derby-auth/utils')

exports.init = function(model) {
}

exports.create = function(model, dom) {
    // sorry but we need jquery, especially for ajax
    //TODO: Fix searchPath
    //if (!window.$) require('../../public/foundation/javascripts/jquery.js');
}

exports.usernameBlur = function(){
    // check username registered
    var model = this.model,
        rootModel = model.parent().parent(),
        q = rootModel.query('users').withUsername(model.get('username'));
    rootModel.fetch(q, function(err, users) {
        try {
            if (err) throw new Error(err);
            var userObj = users.at(0).get()
            if (!userObj) {
                throw new Error("Username not registered. Make sure you're using the same capitalization you used to register!");
            } else {
                model.set('errors.username', '');
            }
        } catch (err) {
            model.set('errors.username', err.message);
        }
    });
}

exports.loginSubmit = function(e, el){
    // TODO handle server-side login failure response message here, via model.set('errors.password',..)
}