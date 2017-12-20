"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var _1 = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("MsgTimestamp32", function () {
        var time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        var nano = 0;
        var msg = _1.MsgTimestamp.from(time);
        assert(msg instanceof _1.MsgTimestamp32);
        check(msg);
        // round trip
        check(new _1.MsgTimestamp(msg.buffer));
        function check(msg) {
            assert.equal(msg.type, -1);
            assert.equal(msg.buffer.length, 4);
            assert.equal(msg.msgpackLength, 6);
            assert.equal(msg.getTime(), time);
            assert.equal(msg.getNano(), nano);
            // Timestamp
            assert.equal(msg.toJSON(), "2018-01-02T03:04:05.000Z");
            // valueOf
            assert.equal(msg.toDate().toJSON(), "2018-01-02T03:04:05.000Z");
        }
    });
    it("MsgTimestamp64", function () {
        var time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        var nano = 6000000;
        var msg = _1.MsgTimestamp.from(time, nano);
        assert(msg instanceof _1.MsgTimestamp64);
        check(msg);
        // round trip
        check(new _1.MsgTimestamp(msg.buffer));
        function check(msg) {
            assert.equal(msg.type, -1);
            assert.equal(msg.buffer.length, 8);
            assert.equal(msg.msgpackLength, 10);
            assert.equal(msg.getTime(), time);
            assert.equal(msg.getNano(), nano);
            // Timestamp
            assert.equal(msg.toJSON(), "2018-01-02T03:04:05.006Z");
            // valueOf
            assert.equal(msg.toDate().toJSON(), "2018-01-02T03:04:05.006Z");
        }
    });
    it("MsgTimestamp96", function () {
        var time = -1;
        var nano = 999999999;
        var msg = _1.MsgTimestamp.from(time, nano);
        assert(msg instanceof _1.MsgTimestamp96);
        check(msg);
        // round trip
        check(new _1.MsgTimestamp(msg.buffer));
        function check(msg) {
            assert.equal(msg.type, -1);
            assert.equal(msg.buffer.length, 12);
            assert.equal(msg.msgpackLength, 15);
            assert.equal(msg.getTime(), time);
            assert.equal(msg.getNano(), nano);
            // Timestamp
            assert.equal(msg.toJSON(), "1969-12-31T23:59:59.999999999Z");
            // valueOf
            assert.equal(msg.toDate().toJSON(), "1969-12-31T23:59:59.999Z");
        }
    });
});
