import { SecurityAnalyzer } from './programs';
import { TestGenerator } from './generators';
import { uiManager } from './uimanager';
import { UIContainer } from 'uicontainer';
import { Player } from './player';
import { Hud, PlayerActions } from './hud';
import { Level } from './level';
import { UIBase } from './uibase';

export class Game extends UIContainer implements PlayerActions{
    currentLevel:Level;
    hud:Hud;
    player:Player;
    constructor()
    {
        super();
        this.player=new Player();
        this.currentLevel=new Level();
        this.add(new Hud(this.player, this.currentLevel,this));
        let gen=new TestGenerator();
        gen.generate(this.currentLevel);
        this.currentLevel.addPlayer(this.player);
        this.add(this.currentLevel);
    }
    openPrograms()
    {
        this.currentLevel.showPrograms();
    }
    toggleConnMode()
    {
        this.currentLevel.toggleConnMode();
    }
    addBranch()
    {
        this.currentLevel.branchConn();
    }
    nextConnect()
    {
        this.currentLevel.switchConn();
    }

}