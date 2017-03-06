import { UIContainer } from 'uicontainer';
import {uiManager} from 'uimanager';
import {Pos, Size, Rect} from 'utils';

export class MyMouseEvent {
    x : number;
    y : number;
    original : MouseEvent;
    constructor(x:number, y:number, original: MouseEvent)
    {
        this.x = x;
        this.y = y;
        this.original = original;
    }
}

export class UIBase {
    rect:Rect = new Rect;
    parent:UIContainer;
    draw()
    {
    }
    close()
    {
        this.parent.remove(this);
    }
    isInside(pos:Pos)
    {
        return this.rect.isInside(pos);
    }
    onMouseMove(e:MyMouseEvent){}
    onMouseDown(e:MyMouseEvent){}
    onMouseUp(e:MyMouseEvent){}
    onMouseEnter(e:MyMouseEvent){}
    onMouseLeave(e:MyMouseEvent){}
}
