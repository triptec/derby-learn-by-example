var utils = require('derby-auth/utils')

exports.init = function(model) {
}

exports.create = function(model, dom) {
    if (!window.$) require('../../public/foundation/javascripts/jquery.js');
}

exports.showPasswordReset = function() {
    $('#derby-auth-password-reset').toggle('fast');
}

exports.submitPasswordReset = function() {
    // check username registered
    var model = this.model,
        rootModel = model.parent().parent(),
        q = rootModel.query('users').withEmail(model.get('passwordResetEmail'));
    rootModel.fetch(q, function(err, users) {
        try {
            if (err) throw new Error(err);
            var userObj = users.at(0).get()
            if (!userObj) {
                throw new Error('Email not registered.');
            } else {
                model.set('errors.passwordReset', '');
                $.ajax({
                    type: 'POST',
                    url: "/password-reset",
                    data: {
                        email: model.get('passwordResetEmail')
                    },
                    success: function(response){
                        model.set('success.passwordReset', response);
                    },
                    error: function(e) {
                        console.log(e);
                        throw e.responseText;
                    }
                })

            }
        } catch (err) {
            model.set('errors.passwordReset', err.message);
        }
    });
}