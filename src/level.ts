import { TileManager } from './tilemanager';
import { hudWIdth } from './hud';
import { UIBase } from './uibase';
import * as gr from './graphics'
import { Rect, Pos } from "./utils";

export class Level extends UIBase {
    constructor()
    {
        super();
        let sz=gr.getAppSize();
        this.rect=new Rect(0, 0, sz.width-hudWIdth, sz.height);
    }
    draw()
    {
        TileManager.instance.drawTile(new Pos(20,20), 'a');
    }
}