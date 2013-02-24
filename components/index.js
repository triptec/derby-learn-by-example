function components(derby, options) {
    var config = {
        ns: 'snippster'
        , filename: __filename
        , scripts: {
            register: require('./register')
            , login: require('./login')
            , reset: require('./reset')
        }
    }
    derby.createLibrary(config, options);
    return this;
}

components.decorate = 'derby';
module.exports = components;