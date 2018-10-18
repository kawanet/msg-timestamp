"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var msg_ext_1 = require("msg-ext");
var int64_buffer_1 = require("int64-buffer");
var Timestamp = require("timestamp-nano");
var BIT34 = 0x400000000;
var BIT32 = 0x100000000;
var EXTTYPE = -1;
function createMsgTimestamp(timeT, nano) {
    nano = 0 | nano;
    var time = +timeT;
    if (0 <= time && time < BIT32 && !nano) {
        return MsgTimestamp32.from(time);
    }
    else if (0 <= time && time < BIT34) {
        return MsgTimestamp64.from(time, nano);
    }
    else {
        return MsgTimestamp96.from(timeT, nano);
    }
}
exports.createMsgTimestamp = createMsgTimestamp;
function unpackMsgTimestamp(buffer) {
    var length = buffer.length;
    switch (length) {
        case 4:
            return new MsgTimestamp32(buffer);
        case 8:
            return new MsgTimestamp64(buffer);
        case 12:
            return new MsgTimestamp96(buffer);
        default:
            throw new TypeError("Invalid payload length: " + length);
    }
}
exports.unpackMsgTimestamp = unpackMsgTimestamp;
/**
 * Timestamp extension type is assigned to extension type -1.
 */
var MsgTimestamp = /** @class */ (function (_super) {
    __extends(MsgTimestamp, _super);
    function MsgTimestamp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgTimestamp.prototype.toJSON = function () {
        return this.toTimestamp().toJSON();
    };
    MsgTimestamp.prototype.toString = function (fmt) {
        return this.toTimestamp().toString(fmt);
    };
    MsgTimestamp.prototype.toDate = function () {
        return this.toTimestamp().toDate();
    };
    return MsgTimestamp;
}(msg_ext_1.MsgExt));
exports.MsgTimestamp = MsgTimestamp;
// ext type -1
MsgTimestamp.prototype.type = EXTTYPE;
/**
 * Timestamp 32 format can represent a timestamp in [1970-01-01 00:00:00 UTC, 2106-02-07 06:28:16 UTC) range. Nanoseconds part is 0.
 */
var MsgTimestamp32 = /** @class */ (function (_super) {
    __extends(MsgTimestamp32, _super);
    function MsgTimestamp32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgTimestamp32.from = function (time) {
        var payload = Buffer.alloc(4);
        // seconds in 32-bit unsigned int
        payload.writeUInt32BE(+time, 0);
        return new MsgTimestamp32(payload);
    };
    MsgTimestamp32.prototype.getTime = function () {
        // seconds in 32-bit unsigned int
        return this.buffer.readUInt32BE(0);
    };
    MsgTimestamp32.prototype.getNano = function () {
        return 0;
    };
    MsgTimestamp32.prototype.toTimestamp = function () {
        var time = this.getTime();
        return Timestamp.fromTimeT(time);
    };
    return MsgTimestamp32;
}(MsgTimestamp));
exports.MsgTimestamp32 = MsgTimestamp32;
/**
 * Timestamp 64 format can represent a timestamp in [1970-01-01 00:00:00.000000000 UTC, 2514-05-30 01:53:04.000000000 UTC) range.
 */
var MsgTimestamp64 = /** @class */ (function (_super) {
    __extends(MsgTimestamp64, _super);
    function MsgTimestamp64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgTimestamp64.from = function (time, nano) {
        time = +time;
        nano = 0 | nano;
        var payload = Buffer.alloc(8);
        // nanoseconds in 30-bit unsigned int
        var high = (nano * 4) + ((time / BIT32) & 3);
        payload.writeUInt32BE(high, 0);
        // seconds in 34-bit unsigned int
        var low = time % BIT32;
        payload.writeUInt32BE(low, 4);
        return new MsgTimestamp64(payload);
    };
    MsgTimestamp64.prototype.getTime = function () {
        var high = this.buffer[3] & 3;
        var low = this.buffer.readUInt32BE(4);
        // seconds in 34-bit unsigned int
        return high * BIT32 + low;
    };
    MsgTimestamp64.prototype.getNano = function () {
        var high = this.buffer.readUInt32BE(0);
        // nanoseconds in 30-bit unsigned int
        return Math.floor(high / 4);
    };
    MsgTimestamp64.prototype.toTimestamp = function () {
        var time = this.getTime();
        var nano = this.getNano();
        return Timestamp.fromTimeT(time).addNano(nano);
    };
    return MsgTimestamp64;
}(MsgTimestamp));
exports.MsgTimestamp64 = MsgTimestamp64;
/**
 * Timestamp 96 format can represent a timestamp in [-584554047284-02-23 16:59:44 UTC, 584554051223-11-09 07:00:16.000000000 UTC) range.
 */
var MsgTimestamp96 = /** @class */ (function (_super) {
    __extends(MsgTimestamp96, _super);
    function MsgTimestamp96() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgTimestamp96.from = function (time, nano) {
        var payload = Buffer.alloc(12);
        nano = 0 | nano;
        // nanoseconds in 32-bit unsigned int
        payload.writeUInt32BE(nano, 0);
        // seconds in 64-bit signed int
        if (int64_buffer_1.Int64BE.isInt64BE(time)) {
            time.toBuffer().copy(payload, 4);
        }
        else {
            new int64_buffer_1.Int64BE(payload, 4, +time);
        }
        return new MsgTimestamp96(payload);
    };
    MsgTimestamp96.prototype.getTime = function () {
        // seconds in 64-bit signed int
        return new int64_buffer_1.Int64BE(this.buffer, 4).toNumber();
    };
    MsgTimestamp96.prototype.getNano = function () {
        // nanoseconds in 32-bit unsigned int
        return this.buffer.readUInt32BE(0);
    };
    MsgTimestamp96.prototype.toTimestamp = function () {
        var nano = this.getNano();
        // seconds in 64-bit signed int
        return Timestamp.fromInt64BE(this.buffer, 4).addNano(nano);
    };
    return MsgTimestamp96;
}(MsgTimestamp));
exports.MsgTimestamp96 = MsgTimestamp96;
