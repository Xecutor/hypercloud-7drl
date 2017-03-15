define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Resource {
        constructor(descr, color) {
            this.value = 0;
            this.descr = descr;
            this.color = color;
        }
    }
    exports.Resource = Resource;
    var RES;
    (function (RES) {
        RES[RES["cpu"] = 0] = "cpu";
        RES[RES["ram"] = 1] = "ram";
        RES[RES["hdd"] = 2] = "hdd";
        RES[RES["net"] = 3] = "net";
        RES[RES["int"] = 4] = "int";
        RES[RES["count"] = 5] = "count";
    })(RES = exports.RES || (exports.RES = {}));
});
