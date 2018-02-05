"use strict";

var name = "List";
var info = "hello world";
var m = "i am " + name + " " + info;
console.log(m); //i am List hello world


function fn() {
    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = arg[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            console.log(v);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
fn(1, 2, 3, 4);

var arr = function arr(v) {
    return v * 2;
};
console.log(arr(2));
/*
* 暂不支持编译，缺少一个polyfill.js文件来支持
* */
var tell = /*#__PURE__*/regeneratorRuntime.mark(function tell() {
    return regeneratorRuntime.wrap(function tell$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return 'a';

                case 2:
                    _context.next = 4;
                    return 'b';

                case 4:
                    return _context.abrupt("return", 'c');

                case 5:
                case "end":
                    return _context.stop();
            }
        }
    }, tell, this);
});
var k = tell();
console.log(k.next()); //{value: "a", done: false}
console.log(k.next()); //{value: "b", done: false}
console.log(k.next()); //{value: "c", done: true}
console.log(k.next()); //{value: undefined, done: true}
//# sourceMappingURL=index.js.map
