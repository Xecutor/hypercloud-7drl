define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SecurityAnalyzer {
        constructor() {
            this.cpuCost = 3;
            this.memCost = 2;
            this.hddSize = 5;
            this.dmg = 25;
            this.name = "Security analyzer";
            this.descr = `Reduces integrity of malicious target by ${this.dmg}.`;
            this.isBackground = false;
        }
        execute(target) {
        }
    }
    exports.SecurityAnalyzer = SecurityAnalyzer;
    class BruteForce {
        constructor() {
            this.cpuCost = 1;
            this.memCost = 4;
            this.hddSize = 4;
            this.dmg = 30;
            this.loaded = false;
            this.name = "Brute force attack";
            this.descr = `Reduces integrity of malicious target on contact by ${this.dmg}.`;
            this.isBackground = true;
        }
        onAttack(target) {
        }
    }
    exports.BruteForce = BruteForce;
});
