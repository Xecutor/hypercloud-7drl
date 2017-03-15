define(["require", "exports", "./tiles", "utils"], function (require, exports, tiles_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EntityFraction;
    (function (EntityFraction) {
        EntityFraction[EntityFraction["neutral"] = 0] = "neutral";
        EntityFraction[EntityFraction["system"] = 1] = "system";
        EntityFraction[EntityFraction["malicious"] = 2] = "malicious";
    })(EntityFraction = exports.EntityFraction || (exports.EntityFraction = {}));
    class Entity {
        constructor() {
            this.tileFrame = 0;
            this.pos = new utils_1.Pos();
            this.alive = true;
            this.fraction = EntityFraction.neutral;
        }
        onFrame(frame) {
            this.tileFrame = frame;
            return this.alive;
        }
        onTurn(map) {
        }
        move(map, dir) {
            let dst = this.pos.clone();
            dst.x += tiles_1.dirX[dir];
            dst.y += tiles_1.dirY[dir];
            let srcTi = map.mapGet(this.pos.x, this.pos.y);
            if (!srcTi.conn[dir]) {
                return;
            }
            let dstTi = map.mapGet(dst.x, dst.y);
            if (dstTi.entity) {
                return;
            }
            dstTi.entity = srcTi.entity;
            srcTi.entity = null;
            this.pos = dst;
        }
    }
    exports.Entity = Entity;
});
