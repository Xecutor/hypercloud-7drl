import { TestGenerator } from './generators';
import { uiManager } from './uimanager';
import { UIContainer } from 'uicontainer';
import { Player } from './player';
import { Hud } from './hud';
import { Level } from './level';
import { UIBase } from './uibase';

export class Game extends UIContainer{
    currentLevel:Level;
    hud:Hud;
    player:Player;
    constructor()
    {
        super();
        this.player=new Player();
        this.currentLevel=new Level();
        this.add(new Hud(this.player, this.currentLevel))
        let gen=new TestGenerator();
        gen.generate(this.currentLevel);
        this.currentLevel.addPlayer(this.player);
        this.add(this.currentLevel);
    }
}