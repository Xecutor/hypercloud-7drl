import { UIContainer } from 'uicontainer';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics';
import { Mousetrap } from './mousewrap';
import { Rect } from "./utils";

export const hudWIdth=320;

export class Hud extends UIContainer{
    constructor()
    {
        super();
        let sz = gr.getAppSize();
        this.rect = new Rect(sz.width-hudWIdth, 0, hudWIdth, sz.height);
    }
    draw()
    {
        gr.rect(this.rect, 'cyan');
    }
}
