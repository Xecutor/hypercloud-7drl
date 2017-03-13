import { Pos, Size } from './utils';
import { UIBase, MyMouseEvent } from 'uibase';

export class UIContainer extends UIBase {
    objects: Array<UIBase> = new Array<UIBase>();
    currentMouseOver: UIBase = null;
    modal:UIBase = null;
    add(obj: UIBase) {
        obj.parent=this;
        this.objects.push(obj);
        if(obj.onAdd)obj.onAdd();
    }
    showModal(obj:UIBase)
    {
        this.objects.forEach((obj)=>obj.pauseBindings());
        obj.parent=this;
        this.modal=obj;
    }
    remove(obj: UIBase) {
        if(obj.onRemove)obj.onRemove();
        if(obj===this.modal) {
            this.objects.forEach((obj)=>obj.resumeBindings());
            this.modal=null;
        }
        else {
            this.objects = this.objects.filter((arg) => arg !== obj);
        }
    }
    postMouseEvent(name: string, e: MyMouseEvent) {
        let pos = new Pos(e.x, e.y);
        if(this.modal) {
            if(this.modal instanceof UIContainer) {
                this.modal.postMouseEvent(name, e);
            }
            else {
                let handler: (e: MouseEvent) => void = this.modal[name];
                if (handler) {
                    handler.call(this.modal, e);
                }
            }
            return;
        }
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
    onMouseLeave(e:MyMouseEvent)
    {
        this.objects.forEach((obj)=>obj.onMouseLeave(e));
        this.currentMouseOver=null;
    }
    draw()
    {
        this.objects.forEach((obj)=>obj.draw());
        if(this.modal) {
            this.modal.draw();
        }
    }
    pauseBindings()
    {
        super.pauseBindings();
        this.objects.forEach((obj)=>obj.pauseBindings());
    }

    resumeBindings()
    {
        super.resumeBindings();
        this.objects.forEach((obj)=>obj.resumeBindings());
    }
    autoSize()
    {
        let rv=new Size;
        let that=this;
        this.objects.forEach(function(obj){
            let br=obj.rect.bottomRight().sub(that.rect.pos);
            if(br.x>rv.width)rv.width=br.x;
            if(br.y>rv.height)rv.height=br.y;
        });
        this.rect.size.assign(rv);
        return rv;
    }
}
