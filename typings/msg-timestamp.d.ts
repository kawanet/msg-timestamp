/// <reference types="node" />
import { MsgExt } from "msg-ext";
import { Int64BE } from "int64-buffer";
import Timestamp = require("timestamp-nano");
export declare function createMsgTimestamp(timeT: number | Int64BE, nano?: number): MsgTimestamp;
export declare function unpackMsgTimestamp(buffer: Buffer): MsgTimestamp;
/**
 * Timestamp extension type is assigned to extension type -1.
 */
export declare abstract class MsgTimestamp extends MsgExt implements MsgTimestamp {
    abstract getTime(): number;
    abstract getNano(): number;
    abstract toTimestamp(): Timestamp;
    toJSON(): string;
    toString(fmt?: string): string;
    toDate(): Date;
}
/**
 * Timestamp 32 format can represent a timestamp in [1970-01-01 00:00:00 UTC, 2106-02-07 06:28:16 UTC) range. Nanoseconds part is 0.
 */
export declare class MsgTimestamp32 extends MsgTimestamp {
    static from(time: number): MsgTimestamp32;
    getTime(): number;
    getNano(): number;
    toTimestamp(): Timestamp;
}
/**
 * Timestamp 64 format can represent a timestamp in [1970-01-01 00:00:00.000000000 UTC, 2514-05-30 01:53:04.000000000 UTC) range.
 */
export declare class MsgTimestamp64 extends MsgTimestamp {
    static from(time: number, nano?: number): MsgTimestamp64;
    getTime(): number;
    getNano(): number;
    toTimestamp(): Timestamp;
}
/**
 * Timestamp 96 format can represent a timestamp in [-584554047284-02-23 16:59:44 UTC, 584554051223-11-09 07:00:16.000000000 UTC) range.
 */
export declare class MsgTimestamp96 extends MsgTimestamp {
    static from(time: number | Int64BE, nano?: number): MsgTimestamp96;
    getTime(): number;
    getNano(): number;
    toTimestamp(): Timestamp;
}
