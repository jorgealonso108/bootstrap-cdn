'use strict';

const path     = require('path');
const assert   = require('assert');

const helpers  = require(path.join(__dirname, 'test_helper.js'));
const config   = helpers.config();
const uri      = helpers.app(config, 'beta');

let response = {};

before((done) => {
    helpers.preFetch(uri, (res) => {
        response = res;
        done();
    });
});

describe('bootstrap4', () => {
    const latest = config.bootstrap4[0];

    describe('config', () => {
        it('is latest', (done) => {
            assert(latest.latest);
            done();
        });

        it('has stylesheet integrity', (done) => {
            assert(typeof latest.stylesheetSri !== 'undefined');
            done();
        });

        it('has javascript integrity', (done) => {
            assert(typeof latest.javascriptSri !== 'undefined');
            done();
        });
    });

    it('works', (done) => {
        helpers.assert.response(response);
        done();
    });

    it('contains authors', (done) => {
        config.authors.forEach((author) => {
            helpers.assert.contains(author, response.body);
        });
        done();
    });

    it('has header', (done) => {
        helpers.assert.contains('<h2>Bootstrap 4 Beta</h2>', response.body);
        done();
    });

    it('has notice', (done) => {
        helpers.assert.contains('Bootstrap 4 is currently in Beta release and should be treated as such.', response.body);
        done();
    });

    describe('stylesheet', () => {
        it('has uri', (done) => {
            helpers.assert.contains(latest.stylesheet, response.body);
            done();
        });

        ['html', 'pug', 'haml'].forEach((fmt) => {
            it(`has ${fmt}`, (done) => {
                const str = helpers.css[fmt](latest.stylesheet, latest.stylesheetSri);

                helpers.assert.contains(str, response.body);
                done();
            });
        });
    });

    describe('javascript', () => {
        it('has javascript uri', (done) => {
            helpers.assert.contains(latest.javascript, response.body);
            done();
        });

        ['html', 'pug', 'haml'].forEach((fmt) => {
            it(`has ${fmt}`, (done) => {
                const str = helpers.javascript[fmt](latest.javascript, latest.javascriptSri);

                helpers.assert.contains(str, response.body);
                done();
            });
        });
    });
});
