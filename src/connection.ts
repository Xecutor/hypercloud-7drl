import { uiManager } from './uimanager';
import { Entity } from './entity';
import { FwdAndBackAnimation, CyclicAnimation } from "./animation";
import { dirs } from "./tiles";

export class ConnectionPiece extends Entity {
    conn=[false,false,false,false]
    prefix='my';
    constructor(srcDir:number,startFrame:number=0)
    {
        super();
        this.conn[srcDir]=true;
        this.update();
        let ani=new CyclicAnimation((frame)=>this.onFrame(frame),25,0,startFrame);
        uiManager.addAnimation(ani)
    }
    update()
    {
        let type='';
        for(let dir=0;dir<4;++dir) {
            if(this.conn[dir]) {
                type+=dirs[dir];
            }
        }
        this.tileName=this.prefix+'-connection-piece-'+type;
    }
    getDescription()
    {
        return 'Active Connection';
    }
    decInt(val)
    {
    }
    getInt()
    {
        return 100;
    }
}