import { Pos } from './utils';
import { MapAccessor } from './generators';
import { Entity, EntityFraction } from "./entity";
import { diffToDir } from "./tiles";

export interface AI {
    think(map:MapAccessor, self:Entity);
}

export class FleeingAI implements AI{
    inDanger=false;
    havePath=false;
    path:Array<Pos>=[]

    think(map:MapAccessor, self:Entity)
    {
        let r = self.pos.makeRectAround(10);
        let dangerPos:Pos;
        this.inDanger=false;
        for(let it=r.getIterator();it.next();){
            let ti=map.mapPGet(it.value);
            if(!ti)continue;
            if(ti.entity && ti.entity.fraction==EntityFraction.system) {
                this.inDanger=true;
                dangerPos=it.value;
            }
        }
        if(this.inDanger) {
            if(this.havePath) {
                //follow path
            }
            else {
                //make path
            }
            let dir=diffToDir(dangerPos.x, dangerPos.y, self.pos.x, self.pos.y);
            self.move(map, dir);
        }
        else {
            let dir=(Math.random()*4)|0;
            self.move(map, dir);
        }
    }
}