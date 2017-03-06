import { uiManager } from 'uimanager';
import { UIContainer } from './uicontainer';
import * as gr from 'graphics';
import {Mousetrap} from 'mousewrap';
import {UIBase} from 'uibase';
import { Rect } from 'utils';
import { Hud } from "./hud";

export class MenuItem extends UIBase {
    color:string = 'green';
    draw()
    {
        gr.fillrect(this.rect, this.color);
        gr.textout(this.rect.pos.x, this.rect.pos.y, "white", "hello")
    }
    onMouseEnter(e:MouseEvent)
    {
        this.color='red';
    }
    onMouseLeave(e:MouseEvent)
    {
        this.color='green';
    }
    onMouseDown(e:MouseEvent)
    {
        this.parent.close();
        this.parent.add(new Hud())
        console.log("down");
    }
}

export class MainMenu extends UIContainer {
    constructor()
    {
        super();
        this.rect = uiManager.appRect.clone();
        let m : MenuItem = new MenuItem();
        m.rect = new Rect(100, 100, 200, 50);
        this.add(m);
        m = new MenuItem();
        m.rect = new Rect( 100, 200, 200, 50);
        this.add(m);
    }
}
