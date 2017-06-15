'use strict';

const _ = require('lodash');

class ApiImplementation {

    constructor() {
        // eslint-disable-next-line no-console
        this.defaultSuccessHandler = console.log;
        // eslint-disable-next-line no-console
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

    wrapCallbackWithTry(callback, shouldThrowErrors) {

        const errorHandler = (...args) => {
            try {
                callback.errorHandler.apply(this, args);
            } catch(err) {

                // eslint-disable-next-line no-console
                console.log(`An api implentation caught a top level error in an error handler: ${err}.`);

                if(shouldThrowErrors) {
                    throw err;
                }
            }
        };

        const handler = (...args) => {
            try {
                callback.handler.apply(this, args);
            } catch(err) {

                // eslint-disable-next-line no-console
                console.log(`An api implentation caught a top level error in an handler: ${err}.`);

                if(shouldThrowErrors) {
                    throw err;
                }
            }
        };

        return { handler, errorHandler };
    }

    sanitizeCallback(callback, shouldThrowErrors) {
        shouldThrowErrors = shouldThrowErrors || false;
        return this.wrapCallbackWithTry(this.formatCallback(callback), shouldThrowErrors);
    }

    getClusterId(/* cb */) {}

    deleteCluster(/* cb */) {}

    getHosts(/* cb */) {}

    updateHost(/* hostId, cb */) {}

    deleteHost(/* hostId, cb */) {}

    getContainers(/* cb */) {}

    createContainers(/* applicationId, containerConfig, cb */) {}

    deleteContainer(/* cb */) {}

    getApplications(/* cb */) {}

    createApplication(/* applicationDescription, cb */) {}

    updateApplication(/* applicationId, newDescription, cb */) {}

    deleteApplication(/* applicationId, cb */) {}

    discoverPeers(/* cidr, cb */) {}

    setDistributedKey(/* key, value, cb */) {}

    getDistributedKey(/* key, cb */) {}
}

module.exports = ApiImplementation;
