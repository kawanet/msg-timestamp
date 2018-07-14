"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("MsgTimestamp32", function () {
        var time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        var nano = 0;
        var msg = __1.MsgTimestamp.from(time);
        assert(msg instanceof __1.MsgTimestamp32);
        check(msg);
        // round trip
        check(new __1.MsgTimestamp(msg.buffer));
        function check(msg) {
            assert.equal(msg.type, -1);
            assert.equal(msg.buffer.length, 4);
            assert.equal(msg.msgpackLength, 6);
            assert.equal(msg.getTime(), time);
            assert.equal(msg.getNano(), nano);
            assert.equal(atos(msg.toMsgpack()), "d6-ff-5a-4a-f6-a5");
            // Timestamp
            assert.equal(msg.toJSON(), "2018-01-02T03:04:05.000Z");
            // valueOf
            assert.equal(msg.toDate().toJSON(), "2018-01-02T03:04:05.000Z");
        }
    });
    it("MsgTimestamp64", function () {
        var time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        var nano = 6000000;
        var msg = __1.MsgTimestamp.from(time, nano);
        assert(msg instanceof __1.MsgTimestamp64);
        check(msg);
        // round trip
        check(new __1.MsgTimestamp(msg.buffer));
        function check(msg) {
            assert.equal(msg.type, -1);
            assert.equal(msg.buffer.length, 8);
            assert.equal(msg.msgpackLength, 10);
            assert.equal(msg.getTime(), time);
            assert.equal(msg.getNano(), nano);
            assert.equal(atos(msg.toMsgpack()), "d7-ff-01-6e-36-00-5a-4a-f6-a5");
            // Timestamp
            assert.equal(msg.toJSON(), "2018-01-02T03:04:05.006Z");
            // valueOf
            assert.equal(msg.toDate().toJSON(), "2018-01-02T03:04:05.006Z");
        }
    });
    it("MsgTimestamp96", function () {
        var time = -1;
        var nano = 999999999;
        var msg = __1.MsgTimestamp.from(time, nano);
        assert(msg instanceof __1.MsgTimestamp96);
        check(msg);
        // round trip
        check(new __1.MsgTimestamp(msg.buffer));
        function check(msg) {
            assert.equal(msg.type, -1);
            assert.equal(msg.buffer.length, 12);
            assert.equal(msg.msgpackLength, 15);
            assert.equal(msg.getTime(), time);
            assert.equal(msg.getNano(), nano);
            assert.equal(atos(msg.toMsgpack()), "c7-0c-ff-3b-9a-c9-ff-ff-ff-ff-ff-ff-ff-ff-ff");
            // Timestamp
            assert.equal(msg.toJSON(), "1969-12-31T23:59:59.999999999Z");
            // valueOf
            assert.equal(msg.toDate().toJSON(), "1969-12-31T23:59:59.999Z");
        }
    });
});
function atos(array) {
    return [].map.call(array, function (v) { return ((v < 16 ? "0" : "") + v.toString(16)); }).join("-");
}
