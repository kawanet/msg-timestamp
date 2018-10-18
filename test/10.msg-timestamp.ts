"use strict";

import * as assert from "assert";

import {msgToBuffer} from "msg-interface";

import {MsgTimestamp, MsgTimestamp32, MsgTimestamp64, MsgTimestamp96} from "../";

const TITLE = __filename.split("/").pop() as string;

const atos = (array: any) => [].map.call(array, (v: number) => (v > 15 ? "" : "0") + v.toString(16)).join("-");

describe(TITLE, function () {

    it("MsgTimestamp32", () => {
        const time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        const nano = 0;
        const msg = MsgTimestamp.from(time);
        check(msg);

        // round trip
        check(MsgTimestamp.parse(msg.buffer));

        function check(msg: MsgTimestamp) {
            assert(msg instanceof MsgTimestamp32);

            assert.strictEqual(msg.type, -1);
            assert.strictEqual(msg.buffer.length, 4);
            assert.strictEqual(msg.msgpackLength, 6);
            assert.strictEqual(msg.getTime(), time);
            assert.strictEqual(msg.getNano(), nano);

            assert.strictEqual(atos(msgToBuffer(msg)), "d6-ff-5a-4a-f6-a5");

            // Timestamp
            assert.strictEqual(msg.toJSON(), "2018-01-02T03:04:05.000Z");

            // valueOf
            assert.strictEqual(msg.toDate().toJSON(), "2018-01-02T03:04:05.000Z");
        }
    });

    it("MsgTimestamp64", () => {
        const time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        const nano = 6000000;
        const msg = MsgTimestamp.from(time, nano);
        check(msg);

        // round trip
        check(MsgTimestamp.parse(msg.buffer));

        function check(msg: MsgTimestamp) {
            assert(msg instanceof MsgTimestamp64);

            assert.strictEqual(msg.type, -1);
            assert.strictEqual(msg.buffer.length, 8);
            assert.strictEqual(msg.msgpackLength, 10);
            assert.strictEqual(msg.getTime(), time);
            assert.strictEqual(msg.getNano(), nano);

            assert.strictEqual(atos(msgToBuffer(msg)), "d7-ff-01-6e-36-00-5a-4a-f6-a5");

            // Timestamp
            assert.strictEqual(msg.toJSON(), "2018-01-02T03:04:05.006Z");

            // valueOf
            assert.strictEqual(msg.toDate().toJSON(), "2018-01-02T03:04:05.006Z");
        }
    });

    it("MsgTimestamp96", () => {
        const time = -1;
        const nano = 999999999;
        const msg = MsgTimestamp.from(time, nano);
        check(msg);

        // round trip
        check(MsgTimestamp.parse(msg.buffer));

        function check(msg: MsgTimestamp) {
            assert(msg instanceof MsgTimestamp96);

            assert.strictEqual(msg.type, -1);
            assert.strictEqual(msg.buffer.length, 12);
            assert.strictEqual(msg.msgpackLength, 15);
            assert.strictEqual(msg.getTime(), time);
            assert.strictEqual(msg.getNano(), nano);

            assert.strictEqual(atos(msgToBuffer(msg)), "c7-0c-ff-3b-9a-c9-ff-ff-ff-ff-ff-ff-ff-ff-ff");

            // Timestamp
            assert.strictEqual(msg.toJSON(), "1969-12-31T23:59:59.999999999Z");

            // valueOf
            assert.strictEqual(msg.toDate().toJSON(), "1969-12-31T23:59:59.999Z");
        }
    });
});
