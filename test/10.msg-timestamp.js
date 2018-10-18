"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var msg_interface_1 = require("msg-interface");
var __1 = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
describe(TITLE, function () {
    it("MsgTimestamp32", function () {
        var time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        var nano = 0;
        var msg = __1.MsgTimestamp.from(time);
        check(msg);
        // round trip
        check(__1.MsgTimestamp.parse(msg.buffer));
        function check(msg) {
            assert(msg instanceof __1.MsgTimestamp32);
            assert.strictEqual(msg.type, -1);
            assert.strictEqual(msg.buffer.length, 4);
            assert.strictEqual(msg.msgpackLength, 6);
            assert.strictEqual(msg.getTime(), time);
            assert.strictEqual(msg.getNano(), nano);
            assert.strictEqual(atos(msg_interface_1.msgToBuffer(msg)), "d6-ff-5a-4a-f6-a5");
            // Timestamp
            assert.strictEqual(msg.toJSON(), "2018-01-02T03:04:05.000Z");
            // valueOf
            assert.strictEqual(msg.toDate().toJSON(), "2018-01-02T03:04:05.000Z");
        }
    });
    it("MsgTimestamp64", function () {
        var time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        var nano = 6000000;
        var msg = __1.MsgTimestamp.from(time, nano);
        check(msg);
        // round trip
        check(__1.MsgTimestamp.parse(msg.buffer));
        function check(msg) {
            assert(msg instanceof __1.MsgTimestamp64);
            assert.strictEqual(msg.type, -1);
            assert.strictEqual(msg.buffer.length, 8);
            assert.strictEqual(msg.msgpackLength, 10);
            assert.strictEqual(msg.getTime(), time);
            assert.strictEqual(msg.getNano(), nano);
            assert.strictEqual(atos(msg_interface_1.msgToBuffer(msg)), "d7-ff-01-6e-36-00-5a-4a-f6-a5");
            // Timestamp
            assert.strictEqual(msg.toJSON(), "2018-01-02T03:04:05.006Z");
            // valueOf
            assert.strictEqual(msg.toDate().toJSON(), "2018-01-02T03:04:05.006Z");
        }
    });
    it("MsgTimestamp96", function () {
        var time = -1;
        var nano = 999999999;
        var msg = __1.MsgTimestamp.from(time, nano);
        check(msg);
        // round trip
        check(__1.MsgTimestamp.parse(msg.buffer));
        function check(msg) {
            assert(msg instanceof __1.MsgTimestamp96);
            assert.strictEqual(msg.type, -1);
            assert.strictEqual(msg.buffer.length, 12);
            assert.strictEqual(msg.msgpackLength, 15);
            assert.strictEqual(msg.getTime(), time);
            assert.strictEqual(msg.getNano(), nano);
            assert.strictEqual(atos(msg_interface_1.msgToBuffer(msg)), "c7-0c-ff-3b-9a-c9-ff-ff-ff-ff-ff-ff-ff-ff-ff");
            // Timestamp
            assert.strictEqual(msg.toJSON(), "1969-12-31T23:59:59.999999999Z");
            // valueOf
            assert.strictEqual(msg.toDate().toJSON(), "1969-12-31T23:59:59.999Z");
        }
    });
});
