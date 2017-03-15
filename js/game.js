define(["require", "exports", "./generators", "uicontainer", "./player", "./hud", "./level"], function (require, exports, generators_1, uicontainer_1, player_1, hud_1, level_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game extends uicontainer_1.UIContainer {
        constructor() {
            super();
            this.player = new player_1.Player();
            this.currentLevel = new level_1.Level();
            this.add(new hud_1.Hud(this.player, this.currentLevel, this));
            let gen = new generators_1.TestGenerator();
            gen.generate(this.currentLevel);
            this.currentLevel.addPlayer(this.player);
            this.add(this.currentLevel);
        }
        openPrograms() {
            this.currentLevel.showPrograms();
        }
        toggleConnMode() {
            this.currentLevel.toggleConnMode();
        }
        addBranch() {
            this.currentLevel.branchConn();
        }
        nextConnect() {
            this.currentLevel.switchConn();
        }
    }
    exports.Game = Game;
});
