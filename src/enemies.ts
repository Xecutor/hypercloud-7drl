import { FwdAndBackAnimation } from './animation';
import { uiManager } from './uimanager';
import { Entity } from './entity';

export class BasicEnemy extends Entity {
    constructor()
    {
        super();
        this.tileName='enemy';
        uiManager.addAnimation(new FwdAndBackAnimation((frame)=>this.onFrame(frame),4))
    }
}