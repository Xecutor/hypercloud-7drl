import { ConnectionPiece } from './connection';
import { Player } from './player';
import { Entity } from './entity';
import { TileInfo, TileBase, WallTile, dirX, dirY, FloorTurtle, DIR, dirs, inverseDir } from './tiles';
import { MapAccessor, LevelGenerator } from './generators';
import { TileManager, tileSize, tileFullSize } from './tilemanager';
import { hudWIdth } from './hud';
import { UIBase, MyMouseEvent } from './uibase';
import * as gr from './graphics'
import { Rect, Pos } from './utils';


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

    constructor()
    {
        super();
        let sz=gr.getAppSize();
        this.rect=new Rect(0, 0, sz.width-hudWIdth, sz.height);
    }
    onAdd()
    {
        for(let key of ['up','down','left','right']) {
            console.log('bind', key);
            this.bindings.bind(key, ()=>this.move(key));
        }
        this.bindings.bind('q',()=>this.toggleDebugTiles());
        this.bindings.bind('c', ()=>this.toggleConnMode());
        this.bindings.bind('tab', ()=>this.switchConn());
        this.bindings.bind('b', ()=>this.branchConn());
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
        this.mapGet(this.player.pos.x, this.player.pos.y).entity=this.player;
    }
    move(key:string)
    {
        console.log('move:'+key);
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
                ti.entity=cp;
                pos.x+=dx;
                pos.y+=dy;
            }
        }
        else {
            let ti=this.mapGet(this.player.pos.x+dx,this.player.pos.y+dy);
            if(ti && ti.passable) {
                let oldTi=this.mapGet(this.player.pos.x, this.player.pos.y);
                ti.entity=oldTi.entity;
                oldTi.entity=null;
                this.player.pos.x+=dx;
                this.player.pos.y+=dy;
            }
        }

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
        this.map[xy]=rv;
        if(x<this.mapRect.pos.x)this.mapRect.pos.x=x;
        if(y<this.mapRect.pos.y)this.mapRect.pos.y=y;
        let br=this.mapRect.bottomRight();
        if(x>br.x)br.x=x;
        if(y>br.y)br.y=y;
        this.mapRect.bottomRight(br);
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
            ctx.drawImage(TileManager.instance.cacheCanvas, 0, 0);
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
    onMouseDown(e:MyMouseEvent)
    {
        this.dragStart=new Pos(e.x, e.y);
        this.offsetStart=this.offset.clone();
    }
    onMouseUp(e:MyMouseEvent)
    {
        this.dragStart = null;
    }
    onMouseMove(e:MyMouseEvent)
    {
        if(this.dragStart)
        {
            this.offset.x=this.offsetStart.x+(this.dragStart.x-e.x);
            this.offset.y=this.offsetStart.y+(this.dragStart.y-e.y);
            let tl=this.mapRect.pos.clone().mul(tileSize).sub(this.rect.size.toPos().div(2));
            let sz=this.mapRect.size.toPos().mul(tileSize).toSize();
            this.offset.clamp(new Rect(tl,sz));
        }
        if(this.debugTiles) {
            this.mouseMapPos.x=Math.floor((this.offset.x+e.x)/tileFullSize);
            this.mouseMapPos.y=Math.floor((this.offset.y+e.y)/tileFullSize);
        }
        else {
            this.mouseMapPos.x=Math.floor((this.offset.x+e.x)/tileSize);
            this.mouseMapPos.y=Math.floor((this.offset.y+e.y)/tileSize);
        }
    }
}