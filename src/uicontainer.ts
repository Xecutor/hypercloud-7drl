import { Pos } from './utils';
import { UIBase, MyMouseEvent } from 'uibase';

export class UIContainer extends UIBase {
    objects: Array<UIBase> = new Array<UIBase>();
    currentMouseOver: UIBase = null;
    add(obj: UIBase) {
        obj.parent=this;
        this.objects.push(obj);
        if(obj.onAdd)obj.onAdd();
    }
    remove(obj: UIBase) {
        if(obj.onRemove)obj.onRemove();
        this.objects = this.objects.filter((arg) => arg !== obj);
    }
    postMouseEvent(name: string, e: MyMouseEvent) {
        let pos = new Pos(e.x, e.y);
        let foundObject: UIBase;
        this.objects.forEach(function (obj) {
            if (obj.isInside(pos)) {
                foundObject = obj;
                let handler: (e: MouseEvent) => void = obj[name];
                if (handler) {
                    handler.call(obj, e);
                }
            }
        });
        if (name === 'onMouseMove' && foundObject !== this.currentMouseOver) {
            if (this.currentMouseOver) {
                this.currentMouseOver.onMouseLeave(e);
            }
            if (foundObject) {
                foundObject.onMouseEnter(e);
            }
            this.currentMouseOver = foundObject;
        }
        if(foundObject instanceof UIContainer) {
            foundObject.postMouseEvent(name, e);
        }
    }
    draw()
    {
        this.objects.forEach((obj)=>obj.draw());
    }
}
