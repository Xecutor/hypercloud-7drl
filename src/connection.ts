import { uiManager } from './uimanager';
import { Entity, EntityFraction } from './entity';
import { FwdAndBackAnimation, CyclicAnimation } from "./animation";
import { dirs } from "./tiles";

export class ConnectionPiece extends Entity {
    conn=[false,false,false,false]
    prefix;
    constructor(srcDir:number,startFrame:number=0, prefix='my')
    {
        super();
        this.prefix=prefix;
        this.conn[srcDir]=true;
        this.update();
        let ani=new CyclicAnimation((frame)=>this.onFrame(frame),25,0,startFrame);
        uiManager.addAnimation(ani);
        if(prefix=='my') {
            this.fraction=EntityFraction.system;
        }
        else {
            this.fraction=EntityFraction.malicious;
        }
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