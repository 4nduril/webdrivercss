'use strict';

/**
 * if multiple screen width are given resize browser dimension
 */

var async = require('async');

module.exports = function (done) {

    var that = this;
    this.newScreenSize = {};

    async.waterfall([
    /**
     * get current browser resolution to change back to it
     * after all shots were taken (only if a screenWidth is set)
     */
    function (cb) {
        if (!that.self.defaultScreenDimension && that.screenWidth && that.screenWidth.length) {
            that.instance.getViewportSize().then(function (res) {
                that.self.defaultScreenDimension = res;
                cb();
            });
        } else {
            cb();
        }
    }, function (cb) {

        if (!that.screenWidth || that.screenWidth.length === 0) {

            /**
             * if no screenWidth option was set just continue
             */
            return cb();
        }

        that.newScreenSize.width = parseInt(that.screenWidth.shift(), 10);
        that.newScreenSize.height = parseInt(that.self.defaultScreenDimension.height, 10);

        that.self.takeScreenshot = true;

        /**
         * resize browser resolution
         */
        that.instance.call(function () {

            /**
             * if shot will be taken in a specific screenWidth, rename file and append screen width
             * value in filename
             */
            that.baselinePath = that.baselinePath.replace(/\.(baseline|regression|diff)\.png/, '.' + that.newScreenSize.width + 'px.$1.png');
            that.regressionPath = that.regressionPath.replace(/\.(baseline|regression|diff)\.png/, '.' + that.newScreenSize.width + 'px.$1.png');
            that.diffPath = that.diffPath.replace(/\.(baseline|regression|diff)\.png/, '.' + that.newScreenSize.width + 'px.$1.png');
            that.screenshot = that.screenshot.replace(/\.png/, '.' + that.newScreenSize.width + 'px.png');
            that.filename = that.baselinePath;

            that.instance.setViewportSize({ width: that.newScreenSize.width, height: that.newScreenSize.height }).pause(100).call(cb);
        });
    }], done);
};
