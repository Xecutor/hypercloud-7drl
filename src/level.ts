import { uiManager } from 'uimanager';
import { Animation } from './animation';
import { ConnectionPiece } from './connection';
import { Player } from './player';
import { Entity } from './entity';
import { TileInfo, TileBase, WallTile, dirX, dirY, FloorTurtle, DIR, dirs, inverseDir, diffToDir } from './tiles';
import { MapAccessor, LevelGenerator } from './generators';
import { TileManager, tileSize, tileFullSize } from './tilemanager';
import { hudWIdth } from './hud';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics'
import { Rect, Pos } from './utils';
import ROT from './rotwrap';

class CenteringAnimation implements Animation {
    callback:()=>boolean;
    constructor(callback:()=>boolean)
    {
        this.callback=callback;
    }
    nextFrame():boolean
    {
        return this.callback();
    }
}

export class Level extends UIBase implements MapAccessor {
    offset=new Pos();
    dragStart:Pos=null;
    offsetStart:Pos=null;
    mapRect=new Rect();
    map:{[xy:string]:TileInfo}={};
    entrance:Pos;

    mouseMapPos=new Pos();

    debugTiles=false;

    player:Player;
    connMode=false;
    activeConn:number=0;
    conns:Array<Pos>=[];
    markerFrame:number=0;

    lastPathPos=new Pos();
    lastPath:Array<Pos>=[];

    mouseMoved=false;

    centerAni=new CenteringAnimation(()=>this.centerStep());
    centering=false;
    centerPos:Pos;

    constructor()
    {
        super();
        let sz=gr.getAppSize();
        this.rect=new Rect(0, 0, sz.width-hudWIdth, sz.height);
    }
    
    onAdd()
    {
        for(let key of ['up','down','left','right']) {
            this.bindings.bind(key, ()=>this.move(key));
        }
        this.bindings.bind('q',()=>this.toggleDebugTiles());
        this.bindings.bind('c', ()=>this.toggleConnMode());
        this.bindings.bind('tab', ()=>this.switchConn());
        this.bindings.bind('b', ()=>this.branchConn());
        this.bindings.bind('shift+c',()=>this.centerCurrent())
    }
    
    toggleDebugTiles()
    {
        this.debugTiles=!this.debugTiles;
    }
    
    toggleConnMode()
    {
        this.connMode=!this.connMode;
        if(this.connMode) {
            this.conns.push(this.player.pos.clone());
        }
    }
    
    switchConn()
    {
        if(this.connMode) {
            this.activeConn=(this.activeConn+1)%this.conns.length;
        }
        return false;
    }
    
    branchConn()
    {
        if(this.connMode) {
            this.conns.push(this.conns[this.activeConn].clone());
        }        
    }
    
    setEntrance(entrance:Pos)
    {
        this.entrance=entrance.clone();
    }

    addPlayer(player:Player)
    {
        this.player=player;
        this.player.pos=this.entrance.clone();
        this.mapGet(this.player.pos.x, this.player.pos.y).setEntity(this.player);
        this.centerPlayer();
    }

    centerCurrent()
    {
        if(this.connMode) {
            this.centerConn();
        }
        else {
            this.centerPlayer();
        }
    }

    centerPlayer()
    {
        if(this.centering)return;
        this.centering=true;
        this.centerPos=this.player.pos;
        uiManager.addAnimation(this.centerAni);
    }

    centerConn()
    {
        if(this.centering || !this.connMode)return;
        this.centering=true;
        this.centerPos=this.conns[this.activeConn];
        uiManager.addAnimation(this.centerAni);
    }

    centerStep()
    {
        let pos=this.mapToScreen(this.centerPos);
        let dir=this.rect.middle().sub(pos);
        let l=dir.length();
        if(l<tileSize) {
            this.centering=false;
            return false;
        }
        dir.div(l).mul(tileSize*2);
        this.offset.sub(dir);
        return this.centering;
    }

    onPlayerAction()
    {

    }

    interactWith(ent:Entity)
    {
        return true;
    }

    isCloseToBorder(pos:Pos)
    {
        pos=this.mapToScreen(pos);
        let r=this.rect.clone();
        let threshold=new Pos(tileSize*3, tileSize*3);
        let br=r.bottomRight();
        r.pos.add(threshold);
        br.sub(threshold);
        r.bottomRight(br);
        return !r.isInside(pos);
    }

    move(key:string)
    {
        let dir;
        switch(key){
            case 'up':dir=DIR.t;break;
            case 'down':dir=DIR.b;break;
            case 'left':dir=DIR.l;break;
            case 'right':dir=DIR.r;break;
        }
        let dx=dirX[dir];
        let dy=dirY[dir];
        if(this.connMode) {
            let pos=this.conns[this.activeConn];
            let ti=this.mapGet(pos.x+dx,pos.y+dy);
            if(ti && ti.passable && !ti.entity) {
                let pTi=this.mapGet(pos.x,pos.y);
                let frame=0;
                if(pTi.entity instanceof ConnectionPiece) {
                    let c=<ConnectionPiece>pTi.entity;
                    c.conn[dir]=true;
                    c.update();
                    frame=c.tileFrame;
                }
                let cp=new ConnectionPiece(inverseDir[dir], frame);
                ti.setEntity(cp);
                pos.x+=dx;
                pos.y+=dy;
                this.onPlayerAction();
                if(this.isCloseToBorder(pos)) {
                    this.centerConn();
                }
            }
        }
        else {
            let ti=this.mapGet(this.player.pos.x+dx,this.player.pos.y+dy);
             let oldTi=this.mapGet(this.player.pos.x, this.player.pos.y);
            if(ti && ti.passable && oldTi.conn[dir]) {
                if(ti.entity && this.interactWith(ti.entity)) {
                    return;
                }
                ti.entity=oldTi.entity;
                oldTi.entity=null;
                this.player.pos.x+=dx;
                this.player.pos.y+=dy;
                if(this.isCloseToBorder(this.player.pos)) {
                    this.centerPlayer();
                }
                this.onPlayerAction();
            }
        }

    }

    addEntity(pos:Pos, entity:Entity)
    {
        this.mapGet(pos.x, pos.y).setEntity(entity);
    }
    mapClear(pos:Pos)
    {
        let xy=pos.x+'x'+pos.y;
        delete this.map[xy];
    }
    mapSet(x:number, y:number, tile:TileBase)
    mapSet(pos:Pos, tile:TileBase);
    mapSet(posOrX:Pos|number, tileOrY:TileBase|number,maybeTile?:TileBase)
    {
        let x:number;
        let y:number;
        let tile:TileBase;
        if(posOrX instanceof Pos) {
            x=posOrX.x;
            y=posOrX.y;
            tile=<TileBase>tileOrY;
        }
        else {
            x=posOrX;
            y=<number>tileOrY;
            tile=maybeTile;
        }
        let xy=x+'x'+y;
        let rv=new TileInfo(tile);
        rv.pos=new Pos(x,y);
        this.map[xy]=rv;
        let tlx=this.mapRect.pos.x;
        let tly=this.mapRect.pos.y;
        let uptl=false;
        if(x<tlx){
            tlx=x;
            uptl=true;
        }
        if(y<tly){
            tly=y;
            uptl=true;
        }
        if(uptl) {
            this.mapRect.setTopLeft(new Pos(tlx, tly));
        }
        let br=this.mapRect.bottomRight();
        let upbr=false;
        if(x>br.x){
            upbr=true;
            br.x=x;
        }
        if(y>br.y) {
            br.y=y;
            upbr=true;
        }
        if(upbr){
            this.mapRect.bottomRight(br);
        }
        return rv;
    }
    mapGet(x:number,y:number)
    {
        let xy=x+'x'+y;
        return this.map[xy];
    }
    mapToScreen(pos:Pos)
    {
        return pos.clone().mul(tileSize).sub(this.offset);
    }

    draw()
    {
        if(this.debugTiles) {
            let ctx=gr.getCtx();
            let c=TileManager.instance.cacheCanvas;
            ctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
            ctx.fillStyle='rgba(255,255,255,0.3)';
            ctx.fillRect(this.mouseMapPos.x*tileFullSize, this.mouseMapPos.y*tileFullSize, tileFullSize, tileFullSize);
            return;
        }
        const countX = Math.ceil(this.rect.size.width / tileSize) + 1;
        const countY = Math.ceil(this.rect.size.height / tileSize) + 1;
        gr.setClip(this.rect);
        let pos=this.offset.clone();
        let x0=Math.floor(pos.x/tileSize);
        let y0=Math.floor(pos.y/tileSize);
        pos.x=-((pos.x%tileSize+tileSize)%tileSize);
        pos.y=-((pos.y%tileSize+tileSize)%tileSize);
        let pos0=pos.clone();
        for(let y=0;y<countY;++y) {
            for(let x=0;x<countX;++x) {
                let ti=this.mapGet(x0+x, y0+y);
                if(ti) {
                    TileManager.instance.drawTile(pos, ti.tileName, ti.tileFrame);
                    if(ti.entity) {
                        let en=ti.entity;
                        TileManager.instance.drawTile(pos, en.tileName, en.tileFrame);
                    }
                }
                if(x0+x==this.mouseMapPos.x && y0+y==this.mouseMapPos.y) {
                    TileManager.instance.drawTile(pos, 'tile-highlight',0);
                }
                pos.x+=tileSize;
            }
            pos0.y+=tileSize;
            pos.assign(pos0);
        }
        if(this.connMode) {
            pos=this.mapToScreen(this.conns[this.activeConn]);
            let fc=TileManager.instance.drawTile(pos, 'marker', this.markerFrame);
            this.markerFrame=(this.markerFrame+1)%fc;
        }
        gr.resetClip();
    }

    resetLastPath()
    {
        for(let pos of this.lastPath) {
            this.mapGet(pos.x, pos.y).tileFrame=0;
        }
        this.lastPath=[];
    }

    addToPath(x:number, y:number)
    {
        this.lastPath.push(new Pos(x,y));
    }

    updatePath()
    {
        if(this.lastPathPos.isEqual(this.mouseMapPos)) {
            return;
        }
        if(!this.mapGet(this.mouseMapPos.x, this.mouseMapPos.y)) {
            return;
        }
        this.resetLastPath();
        this.lastPathPos.assign(this.mouseMapPos);
        if(this.player.pos.isEqual(this.lastPathPos)) {
            return;
        }
        let path=new ROT.Path.AStar(this.lastPathPos.x, this.lastPathPos.y, (x,y, sx, sy)=>this.passabilityTest(x,y,sx,sy),{topology:4});
        path.compute(this.player.pos.x, this.player.pos.y, (x,y)=>this.addToPath(x,y));
        for(let pos of this.lastPath) {
            this.mapGet(pos.x, pos.y).tileFrame=3;
        }
    }

    passabilityTest(x:number, y:number, sx: number, sy:number)
    {
        let sti=this.mapGet(sx,sy);
        let dir=diffToDir(sx,sy,x,y);
        if(!sti.conn[dir])return false;
        let ti=this.mapGet(x,y);
        return ti && ti.passable;
    }

    onMouseDown(e:MyMouseEvent)
    {
        this.dragStart=new Pos(e.x, e.y);
        this.offsetStart=this.offset.clone();
        this.mouseMoved=false;
        this.updateMapMousePos(e);
        this.centering=false;
    }
    
    onMouseUp(e:MyMouseEvent)
    {
        this.dragStart = null;
        if(!this.mouseMoved) {
            this.onClick(e);
        }
    }

    updateMapMousePos(e:MyMouseEvent)
    {
        if(this.debugTiles) {
            this.mouseMapPos.x=Math.floor((this.offset.x+e.x)/tileFullSize);
            this.mouseMapPos.y=Math.floor((this.offset.y+e.y)/tileFullSize);
        }
        else {
            this.mouseMapPos.x=Math.floor((this.offset.x+e.x)/tileSize);
            this.mouseMapPos.y=Math.floor((this.offset.y+e.y)/tileSize);
            this.updatePath();
        }
    }
    
    onMouseMove(e:MyMouseEvent)
    {
        this.mouseMoved=true;
        if(this.dragStart)
        {
            this.offset.x=this.offsetStart.x+(this.dragStart.x-e.x);
            this.offset.y=this.offsetStart.y+(this.dragStart.y-e.y);
            let tl=this.mapRect.pos.clone().mul(tileSize).sub(this.rect.size.toPos().div(2));
            let sz=this.mapRect.size.toPos().mul(tileSize).toSize();
            this.offset.clamp(new Rect(tl,sz));
        }
        this.updateMapMousePos(e);
    }

    onClick(e:MyMouseEvent)
    {
        let ti=this.mapGet(this.mouseMapPos.x, this.mouseMapPos.y);
        if(ti) {
            console.log(ti.passable);
        }
    }
}