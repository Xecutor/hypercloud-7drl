import { FwdAndBackAnimation } from './animation';
import { uiManager } from './uimanager';
import { Entity } from './entity';

export class BasicEnemy extends Entity {
    int:number=100;
    constructor()
    {
        super();
        this.tileName='enemy';
        uiManager.addAnimation(new FwdAndBackAnimation((frame)=>this.onFrame(frame),4))
    }
    getDescription()
    {
        return 'Chomper';
    }
    decInt(val)
    {
        this.int-=val;
        if(this.int<0)this.alive=false;
    }
    getInt()
    {
        return this.int;
    }
}
