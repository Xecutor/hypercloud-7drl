import { MyMouseEvent } from './uibase';
import { Rect } from './utils';
import {UIBase} from 'uibase';
import {UIContainer} from 'uicontainer';
import {Pos} from 'utils';
import { getBoundingRect, getSize, clear } from 'graphics';

class UIManager extends UIContainer{
    appRect : Rect;
    constructor()
    {
        super();
        var canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
        canvas.onmousedown = (e)=>this.postRawMouseEvent('onMouseDown', e);
        canvas.onmouseup = (e)=>this.postRawMouseEvent('onMouseUp', e);
        canvas.onmousemove = (e)=>this.postRawMouseEvent('onMouseMove', e);
        this.appRect = new Rect(0, 0, canvas.width, canvas.height);
    }
    postRawMouseEvent(name:string, e:MouseEvent)
    {
        let r = getBoundingRect();
        let sz = getSize();
        let x = (e.clientX - r.left) * sz.width / r.width;
        let y = (e.clientY - r.top) * sz.height / r.height;
        let d = new MyMouseEvent(x,y,e);
        this.postMouseEvent(name, d);
        //this.draw();
    }
}

export let uiManager = new UIManager();
