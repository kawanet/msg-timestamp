"use strict";

import {MsgExt} from "msg-interface";
import {Int64BE} from "int64-buffer";
import Timestamp = require("timestamp-nano");

const BIT34 = 0x400000000;
const BIT32 = 0x100000000;

/**
 * Timestamp extension type is assigned to extension type -1.
 */

export class MsgTimestamp extends MsgExt {

    static from(timeT: number | Int64BE, nano?: number) {
        nano |= 0;
        const time = +timeT;
        if (0 <= time && time < BIT32 && !nano) {
            return MsgTimestamp32.from(time);
        } else if (0 <= time && time < BIT34) {
            return MsgTimestamp64.from(time, nano);
        } else {
            return MsgTimestamp96.from(timeT, nano);
        }
    }

    getTime(): number {
        const proto = getPrototype(this);
        if (!proto) return;
        if (this.getTime === proto.getTime) return;
        return proto.getTime.call(this);
    }

    getNano(): number {
        const proto = getPrototype(this);
        if (!proto) return;
        if (this.getNano === proto.getNano) return;
        return proto.getNano.call(this);
    }

    toJSON() {
        return toTimestamp(this).toJSON();
    }

    toString(fmt?: string) {
        return toTimestamp(this).toString(fmt);
    }

    toDate() {
        const time = this.getTime();
        const nano = this.getNano();
        return new Date(time * 1000 + Math.floor(nano / 1000000));
    }
}

// ext type -1

((P) => {
    P.type = -1;
})(MsgTimestamp.prototype);

/**
 * Timestamp 32 format can represent a timestamp in [1970-01-01 00:00:00 UTC, 2106-02-07 06:28:16 UTC) range. Nanoseconds part is 0.
 */

export class MsgTimestamp32 extends MsgTimestamp {

    static from(time: number) {
        const payload = Buffer.alloc(4);

        // seconds in 32-bit unsigned int
        payload.writeUInt32BE(+time, 0);

        return new MsgTimestamp32(payload);
    }

    getTime() {
        // seconds in 32-bit unsigned int
        return this.buffer.readUInt32BE(0);
    }

    getNano() {
        return 0;
    }
}

/**
 * Timestamp 64 format can represent a timestamp in [1970-01-01 00:00:00.000000000 UTC, 2514-05-30 01:53:04.000000000 UTC) range.
 */

export class MsgTimestamp64 extends MsgTimestamp {

    static from(time: number, nano?: number) {
        time = +time;
        nano |= 0;

        const payload = Buffer.alloc(8);

        // nanoseconds in 30-bit unsigned int
        const high = (nano * 4) + ((time / BIT32) & 3);
        payload.writeUInt32BE(high, 0);

        // seconds in 34-bit unsigned int
        const low = time % BIT32;
        payload.writeUInt32BE(low, 4);

        return new MsgTimestamp64(payload);
    }

    getTime() {
        const high = this.buffer[3] & 3;
        const low = this.buffer.readUInt32BE(4);

        // seconds in 34-bit unsigned int
        return high * BIT32 + low;
    }

    getNano() {
        const high = this.buffer.readUInt32BE(0);

        // nanoseconds in 30-bit unsigned int
        return Math.floor(high / 4);
    }
}

/**
 * Timestamp 96 format can represent a timestamp in [-584554047284-02-23 16:59:44 UTC, 584554051223-11-09 07:00:16.000000000 UTC) range.
 */

export class MsgTimestamp96 extends MsgTimestamp {

    static from(time: number | Int64BE, nano?: number) {
        const payload = Buffer.alloc(12);

        // nanoseconds in 32-bit unsigned int
        payload.writeUInt32BE(nano | 0, 0);

        // seconds in 64-bit signed int
        if (Int64BE.isInt64BE(time)) {
            time.toBuffer().copy(payload, 4);
        } else {
            new Int64BE(payload, 4, +time);
        }

        return new MsgTimestamp96(payload);
    }

    getTime() {
        // seconds in 64-bit signed int
        return new Int64BE(this.buffer, 4).toNumber();
    }

    getNano() {
        // nanoseconds in 32-bit unsigned int
        return this.buffer.readUInt32BE(0);
    }

    toTimestamp() {
        const nano = this.getNano();

        // seconds in 64-bit signed int
        return Timestamp.fromInt64BE(this.buffer, 4).addNano(nano);
    }
}

// msgpackLength to class

const sizeMap = [];
sizeMap[6] = MsgTimestamp32;
sizeMap[10] = MsgTimestamp64;
sizeMap[15] = MsgTimestamp96;

/**
 * @private
 */

function getPrototype(msg) {
    const length = msg.msgpackLength;
    const c = sizeMap[length];
    if (!c) return;
    return c.prototype;
}

/**
 * @private
 */

function toTimestamp(msg) {
    const time = msg.getTime();
    const nano = msg.getNano();
    return Timestamp.fromTimeT(time).addNano(nano);
}
