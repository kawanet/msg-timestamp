"use strict";

import * as assert from "assert";
import {MsgTimestamp, MsgTimestamp32, MsgTimestamp64, MsgTimestamp96} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, function () {

    it("MsgTimestamp32", () => {
        const time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        const nano = 0;
        const msg = MsgTimestamp.from(time);
        assert(msg instanceof MsgTimestamp32);
        check(msg);

        // round trip
        check(new MsgTimestamp(msg.buffer));

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

    it("MsgTimestamp64", () => {
        const time = Date.UTC(2018, 0, 2, 3, 4, 5) / 1000;
        const nano = 6000000;
        const msg = MsgTimestamp.from(time, nano);
        assert(msg instanceof MsgTimestamp64);
        check(msg);

        // round trip
        check(new MsgTimestamp(msg.buffer));

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

    it("MsgTimestamp96", () => {
        const time = -1;
        const nano = 999999999;
        const msg = MsgTimestamp.from(time, nano);
        assert(msg instanceof MsgTimestamp96);
        check(msg);

        // round trip
        check(new MsgTimestamp(msg.buffer));

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