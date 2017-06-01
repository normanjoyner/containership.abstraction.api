const METHOD_NOT_IMPLEMENTED = "This method was not implemented."

const _ = require('lodash');

class ApiImplementation {

    constructor() {
        this.defaultSuccessHandler = console.log;
        this.defaultErrorHandler = console.log;
    }

    formatCallback(callback) {
        return _.cond([
            [
                (cb) => _.isPlainObject(cb), 
                _.identity
            ],
            [
                (cb) => (_.isFunction(cb) && cb.length === 1),
                (cb) => {
                    return { 
                        handler: cb, 
                        errorHandler: this.defaultErrorHandler 
                    };
                }
            ],
            [
                (cb) => (_.isFunction(cb) && cb.length === 2),
                (cb) => {
                    return {
                        handler: (res) => {
                            cb(null, res);
                        },
                        errorHandler: (err) => {
                            cb(err, null);
                        }
                    };
                }
            ],
            [
                _.constant(true),
                _.constant({
                    handler: this.defaultSuccessHandler, 
                    errorHandler: this.defaultErrorHandler
                })
            ]
        ])(callback);
    }

    getClusterId(cb) {}

    deleteCluster(cb) {}

    getHosts(cb) {}
    
    updateHost(hostId, cb) {}
    
    deleteHost(hostId, cb) {}

    getContainers(cb) {}

    createContainers(applicationId, containerConfig, cb) {}

    deleteContainer(cb) {}

    getApplications(cb) {}

    createApplication(applicationDescription, cb) {}

    updateApplication(applicationId, newDescription, cb) {}

    deleteApplication(applicationId, cb) {}

    discoverPeers(cidr, cb) {}

    setDistributedKey(key, value, cb) {}

    getDistributedKey(key, cb) {}
}

module.exports = ApiImplementation;
