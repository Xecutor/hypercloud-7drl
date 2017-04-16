import { Pos } from './utils';
import { MapAccessor } from './generators';
import { Entity, EntityFraction } from "./entity";
import { diffToDir } from "./tiles";

export interface AI {
    think(map:MapAccessor, self:Entity);
}

export class FleeingAI implements AI{

    think(map:MapAccessor, self:Entity)
    {
        let r = self.pos.makeRectAround(10);
        let dangerPos:Array<Pos>=[];
        console.log(`my pos ${self.pos.x},${self.pos.y}`);
        for(let it=r.getIterator();it.next();){
            let ti=map.mapPGet(it.value);
            if(!ti)continue;
            if(ti.entity && ti.entity.fraction==EntityFraction.system) {
                dangerPos.push(it.value.clone());
                console.log(`danger source ${it.value.x},${it.value.y}`);
            }
        }
        if(dangerPos.length) {
            map.floodMap(dangerPos, 15);
        }
    }
}