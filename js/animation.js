define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FwdAndBackAnimation {
        constructor(onFrame, maxFrame, minFrame = 0) {
            this.onFrame = onFrame;
            this.maxFrame = maxFrame;
            this.minFrame = minFrame;
            this.frame = minFrame;
            this.dir = 1;
        }
        nextFrame() {
            this.frame += this.dir;
            if (this.frame >= this.maxFrame || this.frame <= this.minFrame) {
                this.dir = -this.dir;
            }
            return this.onFrame(this.frame);
        }
    }
    exports.FwdAndBackAnimation = FwdAndBackAnimation;
    class CyclicAnimation {
        constructor(onFrame, maxFrame, minFrame = 0, startFrame = minFrame) {
            this.onFrame = onFrame;
            this.maxFrame = maxFrame;
            this.minFrame = minFrame;
            this.frame = startFrame;
        }
        nextFrame() {
            this.frame += 1;
            if (this.frame >= this.maxFrame) {
                this.frame = this.minFrame;
            }
            return this.onFrame(this.frame);
        }
    }
    exports.CyclicAnimation = CyclicAnimation;
});
