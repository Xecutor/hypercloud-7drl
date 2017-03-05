import { UIContainer } from 'uicontainer';
import {uiManager} from 'uimanager';
import {Pos, Size, Rect} from 'utils';

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
    onMouseMove(e:MouseEvent){}
    onMouseDown(e:MouseEvent){}
    onMouseUp(e:MouseEvent){}
    onMouseEnter(e:MouseEvent){}
    onMouseLeave(e:MouseEvent){}
}
