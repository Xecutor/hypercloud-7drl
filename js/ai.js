define(["require", "exports", "./entity"], function (require, exports, entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FleeingAI {
        think(map, self) {
            let r = self.pos.makeRectAround(10);
            let dangerPos = [];
            console.log(`my pos ${self.pos.x},${self.pos.y}`);
            for (let it = r.getIterator(); it.next();) {
                let ti = map.mapPGet(it.value);
                if (!ti)
                    continue;
                if (ti.entity && ti.entity.fraction == entity_1.EntityFraction.system) {
                    dangerPos.push(it.value.clone());
                    console.log(`danger source ${it.value.x},${it.value.y}`);
                }
            }
            if (dangerPos.length) {
                map.floodMap(dangerPos, 15);
            }
        }
    }
    exports.FleeingAI = FleeingAI;
});
