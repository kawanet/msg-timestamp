# msg-timestamp - msgpack timestamp: ext type -1

[![npm version](https://badge.fury.io/js/msg-timestamp.svg)](http://badge.fury.io/js/msg-timestamp) [![Build Status](https://travis-ci.org/kawanet/msg-timestamp.svg?branch=master)](https://travis-ci.org/kawanet/msg-timestamp)

### MsgTimestamp32

```js
var MsgTimestamp32 = require("msg-timestamp").MsgTimestamp32;

var msg = MsgTimestamp32.from(0);

msg + ""; // => '1970-01-01T00:00:00.000000000Z'

msg.getTime(); // => 0

msg.getNano(); // => 0

msg.msgpackLength; // => 6

var msgToBuffer = require("msg-interface").msgToBuffer;
msgToBuffer(msg); // => <Buffer d6 ff 00 00 00 00>
```

### MsgTimestamp64

```js
var MsgTimestamp64 = require("msg-timestamp").MsgTimestamp64;

var msg = MsgTimestamp64.from(1539886821, 123456789);

msg + ""; // => '2018-10-18T18:20:21.123456789Z'

msg.toString("%Y/%m/%d"); // => '2018/10/18'

msg.getTime(); // => 1539886821

msg.getNano(); // => 123456789

msg.msgpackLength; // => 10

var msgToBuffer = require("msg-interface").msgToBuffer;
msgToBuffer(msg); // => <Buffer d7 ff 1d 6f 34 54 5b c8 ce e5>
```

### MsgTimestamp96

```js
var MsgTimestamp96 = require("msg-timestamp").MsgTimestamp96;

var msg = MsgTimestamp96.from(-1, 123456789);

msg + ""; // => '1969-12-31T23:59:59.123456789Z'

msg.getTime(); // => -1

msg.getNano(); // => 123456789

msg.msgpackLength; // => 15

var msgToBuffer = require("msg-interface").msgToBuffer;
msgToBuffer(msg); // => <Buffer c7 0c ff 07 5b cd 15 ff ff ff ff ff ff ff ff>
```

### GitHub

- [https://github.com/kawanet/msg-timestamp](https://github.com/kawanet/msg-timestamp)

### See Also

- [https://github.com/kawanet/msg-interface](https://github.com/kawanet/msg-interface)
- [https://github.com/kawanet/timestamp-nano](https://github.com/kawanet/timestamp-nano)

### The MIT License (MIT)

Copyright (c) 2017-2018 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
