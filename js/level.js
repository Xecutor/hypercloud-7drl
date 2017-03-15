define(["require", "exports", "./programlist", "uimanager", "./connection", "./tiles", "./tilemanager", "./hud", "./uibase", "./graphics", "./utils", "./rotwrap"], function (require, exports, programlist_1, uimanager_1, connection_1, tiles_1, tilemanager_1, hud_1, uibase_1, gr, utils_1, rotwrap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CenteringAnimation {
        constructor(callback) {
            this.callback = callback;
        }
        nextFrame() {
            return this.callback();
        }
    }
    class Level extends uibase_1.UIBase {
        constructor() {
            super();
            this.offset = new utils_1.Pos();
            this.dragStart = null;
            this.offsetStart = null;
            this.mapRect = new utils_1.Rect();
            this.map = {};
            this.mouseMapPos = new utils_1.Pos();
            this.debugTiles = false;
            this.connMode = false;
            this.activeConn = 0;
            this.conns = [];
            this.connNodes = [];
            this.markerFrame = 0;
            this.lastPathSrc = new utils_1.Pos();
            this.lastPathPos = new utils_1.Pos();
            this.lastPath = [];
            this.mouseMoved = false;
            this.centerAni = new CenteringAnimation(() => this.centerStep());
            this.centering = false;
            this.entities = [];
            let sz = gr.getAppSize();
            this.rect = new utils_1.Rect(0, 0, sz.width - hud_1.hudWIdth, sz.height);
        }
        onAdd() {
            let moveKeys = [['up', 'w'], ['down', 's'], ['left', 'a'], ['right', 'd']];
            for (let i = 0; i < 4; ++i) {
                this.bindings.bind(moveKeys[i], () => this.move(i));
            }
            this.bindings.bind('q', () => this.toggleDebugTiles());
            this.bindings.bind('c', () => this.toggleConnMode());
            this.bindings.bind('tab', () => this.switchConn());
            this.bindings.bind('b', () => this.branchConn());
            this.bindings.bind('shift+c', () => this.centerCurrent());
            this.bindings.bind('i', () => this.showPrograms());
        }
        toggleDebugTiles() {
            this.debugTiles = !this.debugTiles;
        }
        toggleConnMode() {
            this.connMode = !this.connMode;
            if (this.connMode) {
                this.conns.push(this.player.pos.clone());
                this.activeConn = 0;
            }
            else {
                for (let pos of this.connNodes) {
                    this.mapPGet(pos).entity.alive = false;
                    this.mapPGet(pos).entity = null;
                }
                this.connNodes = [];
                this.conns = [];
            }
        }
        switchConn() {
            if (this.connMode) {
                this.activeConn = (this.activeConn + 1) % this.conns.length;
            }
            return false;
        }
        branchConn() {
            if (this.connMode) {
                this.conns.push(this.conns[this.activeConn].clone());
            }
        }
        setEntrance(entrance) {
            this.entrance = entrance.clone();
        }
        showPrograms() {
            uimanager_1.uiManager.showModal(new programlist_1.ProgramList(this.player));
        }
        addPlayer(player) {
            this.player = player;
            this.player.pos = this.entrance.clone();
            this.mapPGet(this.player.pos).setEntity(this.player);
            this.centerPlayer();
        }
        centerCurrent() {
            if (this.connMode) {
                this.centerConn();
            }
            else {
                this.centerPlayer();
            }
        }
        centerPlayer() {
            if (this.centering)
                return;
            this.centering = true;
            this.centerPos = this.player.pos;
            uimanager_1.uiManager.addAnimation(this.centerAni);
        }
        centerConn() {
            if (this.centering || !this.connMode)
                return;
            this.centering = true;
            this.centerPos = this.conns[this.activeConn];
            uimanager_1.uiManager.addAnimation(this.centerAni);
        }
        centerStep() {
            let pos = this.mapToScreen(this.centerPos);
            let dir = this.rect.middle().sub(pos);
            let l = dir.length();
            if (l < tilemanager_1.tileSize) {
                this.centering = false;
                return false;
            }
            dir.div(l).mul(tilemanager_1.tileSize * 2);
            this.offset.sub(dir);
            return this.centering;
        }
        onPlayerAction() {
            let that = this;
            this.entities = this.entities.filter(function (ent) {
                ent.onTurn(that);
                return ent.alive;
            });
        }
        interactWith(ent) {
            return true;
        }
        isCloseToBorder(pos) {
            pos = this.mapToScreen(pos);
            let r = this.rect.clone();
            let threshold = new utils_1.Pos(tilemanager_1.tileSize * 3, tilemanager_1.tileSize * 3);
            let br = r.bottomRight();
            r.pos.add(threshold);
            br.sub(threshold);
            r.bottomRight(br);
            return !r.isInside(pos);
        }
        move(dir) {
            let dx = tiles_1.dirX[dir];
            let dy = tiles_1.dirY[dir];
            if (this.connMode) {
                let pos = this.conns[this.activeConn];
                let ti = this.mapGet(pos.x + dx, pos.y + dy);
                if (ti && ti.passable && !ti.entity) {
                    let pTi = this.mapPGet(pos);
                    let frame = 0;
                    if (pTi.entity instanceof connection_1.ConnectionPiece) {
                        let c = pTi.entity;
                        c.conn[dir] = true;
                        c.update();
                        frame = c.tileFrame;
                    }
                    let cp = new connection_1.ConnectionPiece(tiles_1.inverseDir[dir], frame);
                    ti.setEntity(cp);
                    pos.x += dx;
                    pos.y += dy;
                    this.connNodes.push(pos.clone());
                    if ((this.connNodes.length & 1) == 0)
                        this.onPlayerAction();
                    if (this.isCloseToBorder(pos)) {
                        this.centerConn();
                    }
                }
            }
            else {
                let ti = this.mapGet(this.player.pos.x + dx, this.player.pos.y + dy);
                let oldTi = this.mapPGet(this.player.pos);
                if (ti && ti.passable && oldTi.conn[dir]) {
                    if (ti.entity && this.interactWith(ti.entity)) {
                        return;
                    }
                    ti.entity = oldTi.entity;
                    oldTi.entity = null;
                    this.player.pos.x += dx;
                    this.player.pos.y += dy;
                    if (this.isCloseToBorder(this.player.pos)) {
                        this.centerPlayer();
                    }
                    this.onPlayerAction();
                }
            }
        }
        addEntity(pos, entity) {
            if (this.mapGet(pos.x, pos.y).entity) {
                return false;
            }
            this.mapGet(pos.x, pos.y).setEntity(entity);
            this.entities.push(entity);
            return true;
        }
        mapClear(pos) {
            let xy = pos.x + 'x' + pos.y;
            delete this.map[xy];
        }
        mapPSet(pos, tile) {
            return this.mapSet(pos.x, pos.y, tile);
        }
        mapSet(x, y, tile) {
            let xy = x + 'x' + y;
            let rv = new tiles_1.TileInfo(tile);
            rv.pos = new utils_1.Pos(x, y);
            this.map[xy] = rv;
            let tlx = this.mapRect.pos.x;
            let tly = this.mapRect.pos.y;
            let uptl = false;
            if (x < tlx) {
                tlx = x;
                uptl = true;
            }
            if (y < tly) {
                tly = y;
                uptl = true;
            }
            if (uptl) {
                this.mapRect.setTopLeft(new utils_1.Pos(tlx, tly));
            }
            let br = this.mapRect.bottomRight();
            let upbr = false;
            if (x > br.x) {
                upbr = true;
                br.x = x;
            }
            if (y > br.y) {
                br.y = y;
                upbr = true;
            }
            if (upbr) {
                this.mapRect.bottomRight(br);
            }
            return rv;
        }
        mapGet(x, y) {
            let xy = x + 'x' + y;
            return this.map[xy];
        }
        mapPGet(pos) {
            let xy = pos.x + 'x' + pos.y;
            return this.map[xy];
        }
        mapToScreen(pos) {
            return pos.clone().mul(tilemanager_1.tileSize).sub(this.offset);
        }
        draw() {
            if (this.debugTiles) {
                let ctx = gr.getCtx();
                let c = tilemanager_1.TileManager.instance.cacheCanvas;
                ctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(this.mouseMapPos.x * tilemanager_1.tileFullSize, this.mouseMapPos.y * tilemanager_1.tileFullSize, tilemanager_1.tileFullSize, tilemanager_1.tileFullSize);
                return;
            }
            const countX = Math.ceil(this.rect.size.width / tilemanager_1.tileSize) + 1;
            const countY = Math.ceil(this.rect.size.height / tilemanager_1.tileSize) + 1;
            gr.setClip(this.rect);
            let pos = this.offset.clone();
            let x0 = Math.floor(pos.x / tilemanager_1.tileSize);
            let y0 = Math.floor(pos.y / tilemanager_1.tileSize);
            pos.x = -((pos.x % tilemanager_1.tileSize + tilemanager_1.tileSize) % tilemanager_1.tileSize);
            pos.y = -((pos.y % tilemanager_1.tileSize + tilemanager_1.tileSize) % tilemanager_1.tileSize);
            let pos0 = pos.clone();
            for (let y = 0; y < countY; ++y) {
                for (let x = 0; x < countX; ++x) {
                    let ti = this.mapGet(x0 + x, y0 + y);
                    if (ti) {
                        tilemanager_1.TileManager.instance.drawTile(pos, ti.tileName, ti.tileFrame);
                        if (ti.entity) {
                            let en = ti.entity;
                            tilemanager_1.TileManager.instance.drawTile(pos, en.tileName, en.tileFrame);
                        }
                    }
                    if (x0 + x == this.mouseMapPos.x && y0 + y == this.mouseMapPos.y) {
                        tilemanager_1.TileManager.instance.drawTile(pos, 'tile-highlight', 0);
                    }
                    pos.x += tilemanager_1.tileSize;
                }
                pos0.y += tilemanager_1.tileSize;
                pos.assign(pos0);
            }
            if (this.connMode) {
                pos = this.mapToScreen(this.conns[this.activeConn]);
                let fc = tilemanager_1.TileManager.instance.drawTile(pos, 'marker', this.markerFrame);
                this.markerFrame = (this.markerFrame + 1) % fc;
                for (let i = 0; i < this.conns.length; ++i) {
                    if (i == this.activeConn) {
                        continue;
                    }
                    pos = this.mapToScreen(this.conns[i]);
                    tilemanager_1.TileManager.instance.drawTile(pos, 'marker', 1);
                }
            }
            gr.resetClip();
        }
        resetLastPath() {
            for (let pos of this.lastPath) {
                this.mapGet(pos.x, pos.y).tileFrame = 0;
            }
            this.lastPath = [];
        }
        addToPath(x, y) {
            this.lastPath.push(new utils_1.Pos(x, y));
        }
        updatePath() {
            if (this.lastPathPos.isEqual(this.mouseMapPos)) {
                return;
            }
            if (!this.mapPGet(this.mouseMapPos)) {
                return;
            }
            this.resetLastPath();
            let src = this.connMode ? this.conns[this.activeConn] : this.player.pos;
            this.lastPathSrc.assign(src);
            this.lastPathPos.assign(this.mouseMapPos);
            if (src.isEqual(this.lastPathPos)) {
                return;
            }
            let path = new rotwrap_1.default.Path.AStar(this.lastPathPos.x, this.lastPathPos.y, (x, y, sx, sy) => this.passabilityTest(x, y, sx, sy), { topology: 4 });
            path.compute(src.x, src.y, (x, y) => this.addToPath(x, y));
            for (let pos of this.lastPath) {
                this.mapGet(pos.x, pos.y).tileFrame = 3;
            }
        }
        passabilityTest(x, y, sx, sy) {
            let sti = this.mapGet(sx, sy);
            if (!this.connMode) {
                let dir = tiles_1.diffToDir(sx, sy, x, y);
                if (!sti.conn[dir])
                    return false;
            }
            if (this.lastPathSrc.x == x && this.lastPathSrc.y == y) {
                return true;
            }
            let ti = this.mapGet(x, y);
            return ti && ti.passable && !ti.entity;
        }
        onMouseDown(e) {
            this.dragStart = new utils_1.Pos(e.x, e.y);
            this.offsetStart = this.offset.clone();
            this.mouseMoved = false;
            this.updateMapMousePos(e);
            this.centering = false;
        }
        onMouseUp(e) {
            this.dragStart = null;
            if (!this.mouseMoved) {
                this.onClick(e);
            }
        }
        updateMapMousePos(e) {
            if (this.debugTiles) {
                this.mouseMapPos.x = Math.floor((e.x) / tilemanager_1.tileFullSize);
                this.mouseMapPos.y = Math.floor((e.y) / tilemanager_1.tileFullSize);
            }
            else {
                this.mouseMapPos.x = Math.floor((this.offset.x + e.x) / tilemanager_1.tileSize);
                this.mouseMapPos.y = Math.floor((this.offset.y + e.y) / tilemanager_1.tileSize);
                this.updatePath();
            }
        }
        onMouseMove(e) {
            this.mouseMoved = true;
            if (this.dragStart) {
                this.offset.x = this.offsetStart.x + (this.dragStart.x - e.x);
                this.offset.y = this.offsetStart.y + (this.dragStart.y - e.y);
                let tl = this.mapRect.pos.clone().mul(tilemanager_1.tileSize).sub(this.rect.size.toPos().div(2));
                let sz = this.mapRect.size.toPos().mul(tilemanager_1.tileSize).toSize();
                this.offset.clamp(new utils_1.Rect(tl, sz));
            }
            this.updateMapMousePos(e);
        }
        onClick(e) {
            if (this.lastPath.length) {
                let src = this.connMode ? this.conns[this.activeConn] : this.player.pos;
                let dst = this.lastPath[1];
                let dir = tiles_1.diffToDir(src.x, src.y, dst.x, dst.y);
                this.move(dir);
                this.lastPathPos.assign(src);
                this.updatePath();
            }
        }
    }
    exports.Level = Level;
});
