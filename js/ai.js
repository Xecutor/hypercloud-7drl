define(["require", "exports", "./entity", "./tiles"], function (require, exports, entity_1, tiles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FleeingAI {
        constructor() {
            this.inDanger = false;
            this.havePath = false;
            this.path = [];
        }
        think(map, self) {
            let r = self.pos.makeRectAround(10);
            let dangerPos;
            this.inDanger = false;
            for (let it = r.getIterator(); it.next();) {
                let ti = map.mapPGet(it.value);
                if (!ti)
                    continue;
                if (ti.entity && ti.entity.fraction == entity_1.EntityFraction.system) {
                    this.inDanger = true;
                    dangerPos = it.value;
                }
            }
            if (this.inDanger) {
                if (this.havePath) {
                    //follow path
                }
                else {
                    //make path
                }
                let dir = tiles_1.diffToDir(dangerPos.x, dangerPos.y, self.pos.x, self.pos.y);
                self.move(map, dir);
            }
            else {
                let dir = (Math.random() * 4) | 0;
                self.move(map, dir);
            }
        }
    }
    exports.FleeingAI = FleeingAI;
});
