import { Mousetrap } from './mousewrap';
import { UIContainer } from './uicontainer';
import { Pos, Size, Rect } from './utils';
import { getAppRect } from "./graphics";

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
    rect:Rect = getAppRect().clone();
    parent:UIContainer;
    bindings=Mousetrap();
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

    pauseBindings()
    {
        this.bindings.pause();
    }

    resumeBindings()
    {
        this.bindings.unpause();
    }

    onMouseMove(e:MyMouseEvent){}
    onMouseDown(e:MyMouseEvent){}
    onMouseUp(e:MyMouseEvent){}
    onMouseEnter(e:MyMouseEvent){}
    onMouseLeave(e:MyMouseEvent){}

    onAdd?();
    onRemove()
    {
        this.bindings.reset();
    }
}
