define(["require", "exports", "./utils", "./tiles", "./enemies", "./rotwrap"], function (require, exports, utils_1, tiles_1, enemies_1, rotwrap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function inXRange(pos, range, r) {
        let minX = pos.x - range;
        if (minX < r.pos.x)
            return false;
        let maxX = pos.x + range;
        if (maxX > r.pos.x + r.size.width)
            return false;
        return true;
    }
    function inYRange(pos, range, r) {
        let minY = pos.y - range;
        if (minY < r.pos.y)
            return false;
        let maxY = pos.y + range;
        if (maxY > r.pos.y + r.size.height)
            return false;
        return true;
    }
    function makeSurroundingRect(p1, p2, size) {
        let x1 = p1.x;
        let x2 = p2.x;
        let y1 = p1.y;
        let y2 = p2.y;
        if (x1 > x2) {
            [x1, x2] = [x2, x1];
        }
        if (y1 > y2) {
            [y1, y2] = [y2, y1];
        }
        return new utils_1.Rect(x1 - size / 2, y1 - size / 2, x2 - x1 + size, y2 - y1 + size);
    }
    class TestGenerator {
        constructor() {
            this.difficulty = 1;
            this.walls = [];
            this.corridors = [];
        }
        fixWallConn() {
            let m = this.m;
            for (let it = m.mapRect.getIterator(); it.next();) {
                let ti = m.mapPGet(it.value);
                if (!ti || !(ti.tile instanceof tiles_1.WallTile))
                    continue;
                for (let i = 0; i < 4; ++i) {
                    let n = m.mapGet(it.value.x + tiles_1.dirX[i], it.value.y + tiles_1.dirY[i]);
                    if (n && n.tile instanceof tiles_1.WallTile) {
                        ti.conn[i] = true;
                    }
                }
            }
        }
        fillRect(r) {
            for (let it = r.getIterator(); it.next();) {
                this.m.mapPSet(it.value, null);
            }
        }
        makeWalls() {
            let m = this.m;
            let dx = [0, 1, 1, 1, 0, -1, -1, -1];
            let dy = [-1, -1, 0, 1, 1, 1, 0, -1];
            for (let it = m.mapRect.getIterator(); it.next();) {
                let ti = m.mapPGet(it.value);
                if (!ti || ti.tile) {
                    continue;
                }
                for (let i = 0; i < 8; ++i) {
                    let x = it.value.x + dx[i];
                    let y = it.value.y + dy[i];
                    let dti = m.mapGet(x, y);
                    if (!dti) {
                        m.mapSet(x, y, new tiles_1.WallTile);
                        this.walls.push(new utils_1.Pos(x, y));
                    }
                }
            }
        }
        clearUnused() {
            let m = this.m;
            let dx = [0, 1, 1, 1, 0, -1, -1, -1];
            let dy = [-1, -1, 0, 1, 1, 1, 0, -1];
            for (let it = m.mapRect.getIterator(); it.next();) {
                let ti = m.mapPGet(it.value);
                if (ti && !ti.tile) {
                    m.mapClear(it.value);
                }
            }
        }
        getPassability(x, y, src, dst) {
            if (this.pfCount > 50000) {
                console.log('limit');
                return false;
            }
            if ((src.x == x && src.y == y) || (dst.x == x && dst.y == y))
                return true;
            let ti = this.m.mapGet(x, y);
            ++this.pfCount;
            return ti && (!ti.tile || ti.tile instanceof tiles_1.FloorTile);
        }
        connect(src, dst) {
            this.pfCount = 0;
            let astar = new rotwrap_1.default.Path.AStar(dst.x, dst.y, (x, y) => this.getPassability(x, y, src, dst), { topology: 4 });
            let turtle = new tiles_1.FloorTurtle(this.m, src.clone());
            let lastx = src.x;
            let lasty = src.y;
            let success = false;
            let cor = this.corridors;
            astar.compute(src.x, src.y, function (x, y) {
                success = true;
                if (lastx == x && lasty == y) {
                    return;
                }
                cor.push(new utils_1.Pos(x, y));
                let dir = tiles_1.diffToDir(lastx, lasty, x, y);
                turtle.move(dir, 1);
                lastx = x;
                lasty = y;
            });
            return success;
        }
        isWall(x, y) {
            let ti = this.m.mapGet(x, y);
            return ti && ti.tile instanceof tiles_1.WallTile;
        }
        generate(m) {
            this.m = m;
            let poi = [];
            let maxPoi = 10 + 5 * this.difficulty;
            let hubSize = 20;
            let maxRange = hubSize * 2 + this.difficulty * 10;
            let minRangeSquared = 5 * 5;
            let maxInHub = maxPoi / 4;
            let inHub = 0;
            let hubRect = new utils_1.Rect(-hubSize / 2, -hubSize / 2, hubSize, hubSize);
            for (let i = 0; i < maxPoi; ++i) {
                let tooClose = false;
                let x;
                let y;
                do {
                    tooClose = false;
                    y = (Math.random() * maxRange - maxRange / 2) | 0;
                    x = (Math.random() * maxRange - maxRange / 2) | 0;
                    if (inHub > maxInHub && hubRect.isInside(new utils_1.Pos(x, y))) {
                        tooClose = true;
                        continue;
                    }
                    for (let j = 0; j < i; ++j) {
                        let dx = poi[j].x - x;
                        let dy = poi[j].y - y;
                        let distSquared = dx * dx + dy * dy;
                        if (distSquared < minRangeSquared) {
                            tooClose = true;
                            break;
                        }
                    }
                } while (tooClose);
                let pos = new utils_1.Pos(x, y);
                poi.push(pos);
                if (hubRect.isInside(pos)) {
                    ++inHub;
                }
            }
            this.fillRect(hubRect);
            let pos;
            const tunnelSize = 10;
            let mid = hubRect.middle();
            for (pos of poi) {
                let tun = makeSurroundingRect(pos, mid, tunnelSize);
                if (tun.size.width <= tunnelSize || tun.size.height <= tunnelSize) {
                    this.fillRect(tun);
                }
                else {
                    let inter = new utils_1.Pos(pos.x, mid.y);
                    tun = makeSurroundingRect(pos, inter, tunnelSize);
                    this.fillRect(tun);
                    tun = makeSurroundingRect(inter, mid, tunnelSize);
                    this.fillRect(tun);
                }
            }
            this.makeWalls();
            this.fixWallConn();
            //this.clearUnused();
            for (pos of poi) {
                let arr = [tiles_1.DataBoxTile, tiles_1.DataProcessorTile];
                let cls = utils_1.randomFromArray(arr);
                let t = new cls();
                m.mapPSet(pos, t);
            }
            for (let i = 0; i < poi.length; ++i) {
                for (let j = i + 1; j < poi.length; ++j) {
                    this.connect(poi[i], poi[j]);
                }
            }
            console.log("generating entrances");
            let entrances = [];
            let ecount = 3 + (2 * Math.random()) | 0;
            for (let i = 0; i < ecount || entrances.length == 0; ++i) {
                if (i > 20)
                    break;
                let wp;
                let goodWall = false;
                do {
                    wp = utils_1.randomFromArray(this.walls);
                    if (this.isWall(wp.x + 1, wp.y) && this.isWall(wp.x - 1, wp.y) && !this.isWall(wp.x, wp.y + 1) && !this.isWall(wp.x, wp.y - 1)) {
                        goodWall = true;
                    }
                    if (!this.isWall(wp.x + 1, wp.y) && !this.isWall(wp.x - 1, wp.y) && this.isWall(wp.x, wp.y + 1) && this.isWall(wp.x, wp.y - 1)) {
                        goodWall = true;
                    }
                } while (!goodWall);
                m.mapPGet(wp).tile.connector = true;
                for (let j = 0; j < 3; ++j) {
                    let p = utils_1.randomFromArray(poi);
                    if (!this.connect(wp, p)) {
                        console.log("failed from ", wp, " to ", p);
                    }
                }
                for (let j = 0; j < 4; ++j) {
                    let ti = m.mapGet(wp.x + tiles_1.dirX[j], wp.y + tiles_1.dirY[j]);
                    if (ti && ti.tile && ti.tile instanceof tiles_1.FloorTile) {
                        entrances.push(new utils_1.Pos(wp.x + tiles_1.dirX[j], wp.y + tiles_1.dirY[j]));
                    }
                }
            }
            // let t=new FloorTurtle(m,new Pos(1,1));
            // t.move(DIR.r,8).move(DIR.b,8).move(DIR.l,8).move(DIR.t,8).
            // goto(new Pos(1,5)).move(DIR.r,8).
            // goto(new Pos(5,1)).move(DIR.b,8);
            this.clearUnused();
            for (let i = 0; i < 5; ++i) {
                pos = utils_1.randomFromArray(this.corridors);
                let enemies = [enemies_1.Spyware, enemies_1.Muncher];
                let cls = utils_1.randomFromArray(enemies);
                m.addEntity(pos, new cls);
            }
            for (let it = m.mapRect.getIterator(); it.next();) {
                let ti = m.mapPGet(it.value);
                if (ti && ti.tile) {
                    ti.update();
                }
            }
            if (entrances.length) {
                m.setEntrance(utils_1.randomFromArray(entrances));
            }
            else {
                m.setEntrance(new utils_1.Pos(0, 0));
            }
        }
    }
    exports.TestGenerator = TestGenerator;
});
