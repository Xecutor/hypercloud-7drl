import { Animation } from './animation';
import { MyMouseEvent } from './uibase';
import { Rect } from './utils';
import {UIBase} from 'uibase';
import {UIContainer} from 'uicontainer';
import {Pos} from 'utils';
import * as gr from 'graphics';

class UIManager extends UIContainer{
    timerId:number;
    animations:Array<Animation>=[];
    constructor()
    {
        super();
        var canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
        canvas.onmousedown = (e)=>this.postRawMouseEvent('onMouseDown', e);
        canvas.onmouseup = (e)=>this.postRawMouseEvent('onMouseUp', e);
        canvas.onmousemove = (e)=>this.postRawMouseEvent('onMouseMove', e);
        this.timerId=setInterval(()=>this.draw(), 40);
    }
    postRawMouseEvent(name:string, e:MouseEvent)
    {
        let r = gr.getBoundingRect();
        let sz = gr.getAppSize();
        let x = (e.clientX - r.left) * sz.width / r.width;
        let y = (e.clientY - r.top) * sz.height / r.height;
        let d = new MyMouseEvent(x,y,e);
        this.postMouseEvent(name, d);
    }
    draw()
    {
        gr.clear();
        this.animations=this.animations.filter((ani:Animation)=>ani.nextFrame());
        super.draw();
    }
    addAnimation(ani:Animation)
    {
        this.animations.push(ani);
    }
}

export let uiManager = new UIManager();
