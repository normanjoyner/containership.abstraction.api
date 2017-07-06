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

    scaleDownContainers(app_id, count, cb) {
        return this._scaleContainers({
            app_id: app_id,
            count: count,
            type: 'down'
        }, cb);
    }

    scaleUpContainers(app_id, count, cb) {
        return this._scaleContainers({
            app_id: app_id,
            count: count,
            type: 'up'
        }, cb);
    }

    _scaleContainers(options, cb) {
        const { errorHandler } = this.sanitizeCallback(cb);

        const app_id = options.app_id;
        const type = options.type;
        const count = parseInt(options.count || 1);

        return this.getApplication(app_id, (err, app) => {
            if(err) {
                return errorHandler(err);
            }

            const current_count = _.size(_.get(app, 'containers'));
            const newCount = type === 'up' ? current_count + count : current_count - count;

            return this.updateApplication(app_id, {
                count: newCount
            }, cb);
        });
    }

    getClusterId(/* cb */) {}

    deleteCluster(/* cb */) {}

    getHosts(/* cb */) {}

    updateHost(/* hostId, cb */) {}

    deleteHost(/* hostId, cb */) {}

    getContainers(/* cb */) {}

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
