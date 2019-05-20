const fs = require('fs');

let board = fs.readFileSync('board.txt', 'utf8').split("\n").map(_ => _.split("").map(_ => _ === '#' ? 1 : 0));
let legend = fs.readFileSync('legend.txt', 'utf8').split("\n");
board.print = function () {
    this.forEach(_ => console.log(_.map(_ => _ === 1 ? "#" : '.').join("")));
}
legend.print = function () {
    this.forEach(_ => console.log(_));
}

//poruszanie się za pomocą strzałek
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        moveUP();
    }
    if (key == '\u001B\u005B\u0043') {
        moveRight();
    }
    if (key == '\u001B\u005B\u0042') {
        moveDown();
    }
    if (key == '\u001B\u005B\u0044') {
        moveLeft();
    }
    if (key == '\u0003') { process.exit(); }    // ctrl-c
});
function moveLeft(){

}
function moveUP(){
  console.log('góra')
}
function moveRight(){
  console.log('Prawo')
}
function moveDown(){
  console.log('Dół')
}
/*function heroMove(){

}*/
console.log("Witaj w grze RougeLike.\n Sterujesz postacią za pomocą strzałek lub wpisywania kierunków po angielsku")
board.print();
legend.print();
//if()
/*
wstawienie gracza na planszę
wstawienie potworów na planszę(losowo)
przypisanie HP i DMG potworom i graczowi
efekt zebrania przedmiotu/walki(wejście w pole potwora, jeśli potwór umiera po ataku, jeśli żyje, gracz zostaje w tym samym miejscu)

Ruch gracza (strzałki lub komendy - komenda dopasowana do funkcji funkcja wykonuje ruch)
ruch potworów (w strone gracza - wyczytywanie pozycji gracza + kierunek do niego + Ruch)
omijanie ścian (ściana blokuje ruch w nią)
losowe generowanie broni i efektów
zakaz przechodzenia przez granice planszy
*/

Skip to content
Pull requests
Issues
Marketplace
Explore
@ReinaArionAlkira

0
0

    0

tagisgame/praktyki-gra
Code
Issues 0
Pull requests 0
Projects 0
Wiki
Insights
praktyki-gra/main.js
@tagisgame tagisgame XIY 95058c1 25 minutes ago
369 lines (347 sloc) 11.2 KB
const fs = require('fs');
const readlineSync = require('readline-sync');

// <editor-fold desc="Classes">
/**
 * Main class, containing board. list of any instances
 * and useful methods
 * @class
 *
 * @constructor
 *
 * @property {[]} board array used as board for game
 * @property {[]} mobList list of all mobs on board
 * @property {[]} mobIdLeft list of ID's left for mobs
 * @property {[]} itemList list of all items on board
 */
/**
 * Main class, containing board. list of any instances
 * and useful methods
 * @class
 *
 * @constructor
 *
 * @param {string} file path to board
 * @property {[]} board array used as board for game
 * @property {[]} mobList list of all mobs on board, first element is a list of IDs
 * @property {[]} itemList list of all items on board, first element is a list of IDs
 **/
function Game (board) {
  this.board = board;
  for (let x = 0; x < this.board.length; x++) {
    for (let y = 0; y < this.board[x].length; y++) {
      this.board[x][y] = this.board[x][y] === "." ? new Cell(x, y) : new Cell(x, y, true);
    }
  }

  this.mobList = [];
  this.mobList[0] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  this.itemList = [];
  this.itemList[0] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

  /**
   * Searches for all properties of mob with specified ID
   * Firts elemnent of returned Array is a mobList index of mob
   *
   * @param {number} targetId ID of mob, which needs to be found
   *
   * @returns {Array} array with properties, 1st element is index in mobList
   **/
  this.findMobAttribs = function (targetId) {
    let targetIndex = null;

    for (let i = 0; i < this.mobList.length; i++) {
      if (this.mobList[i].id !== targetId) continue;

      targetIndex = i;
      break;
    }

    let array = Object.values(this.mobList[targetIndex]);
    array.unshift(targetIndex);

    return array;
  }
  /**
   * Searches for all properties of item with specified ID
   * Firts elemnent of returned Array is a itemList index of item
   *
   * @param {number} targetId ID of item, which needs to be found
   *
   * @returns {Array} array with properties, 1st element is index in itemList
   **/
  this.findItemAttribs = function (targetId) {
    let targetIndex = null;

    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].id !== targetId) continue;

      targetIndex = i;
      break;
    }

    let array = [targetIndex];
    for (let key in this.itemList[targetIndex]) {
      array.push(key);
    }

    return array;
  }
  /**
   * Fills board with mobs. If mob type not specified, fills with random mobs.
   *
   * @param {number} type number which defines type of mob (look at table of types)
   * @param {number} count number which defines type of mob (look at table of types)
   *
   * @returns {Array} mobList array
   **/
  this.fillWithMobs = function (type, count) {
    let mob = type;
    while (count > 0) {
      let randX = Math.floor(Math.random() * (this.board.length - 1));
      let randY = Math.floor(Math.random() * (this.board[randX].length - 1));
      if(this.board[randX][randY].mob !== null || this.board[randX][randY].wall) {
        continue;
      }

      if (type === "random") {
        mob = Math.random() < 0.5 ? "snake" : "dragon";
      }
      let id = this.mobList[0].shift();
      let hp = mob === "snake" ? 2 : (mob === "dragon" ? 25 : 10);
      this.mobList.push(new Mob(id, randX, randY, mob, hp));
      this.board[randX][randY].mob = id;

      count--;
    }
    return this.mobList;
  }
  /**
   * Puts player on board.
   *
   * @returns {Array} mobList array
   **/
  this.putPlayer = function () {
    while (true) {
      let randX = Math.floor(Math.random() * (this.board.length - 1));
      let randY = Math.floor(Math.random() * (this.board[randX].length - 1));
      if(this.board[randX][randY].mob !== null || this.board[randX][randY].wall) {
        continue;
      }
      let id = 0;
      let hp = 10;
      this.mobList.push(new Mob(id, randX, randY, "player", hp));
      this.board[randX][randY].mob = id;

      break;
    }
    return this.mobList;
  }
  /**
   * Draws a board in console
   **/
  this.draw = function () {
    for (let y = 0; y < this.board.length; y++) {
      let buf = "";
      for (let x = 0; x < this.board[y].length; x++) {
        if(this.board[y][x].wall) {
          buf += "#";
        } else if (this.board[y][x].mob !== null) {
          let type = this.findMobAttribs(this.board[y][x].mob)[4];
          if (type === "snake") {
            buf += "S";
          } else if (type === "dragon") {
            buf += "D";
          } else {
            buf += "@";
          }
        } else {
          buf += ".";
        }
      }
      console.log(buf);
    }
    console.log("HP: " + this.findMobAttribs(0)[5]);
  }
}
/**
 * A single cell on board, stores informations about what is placed
 * on that certain coordinates
 * @class
 *
 * @constructor
 *
 * @property {number} x x position of cell
 * @property {number} y y position of cell
 * @property {bool} wall true when there is a wall on that spot
 * @property {number} mob ID of mob standing on that spot (null if there is not any mob)
 * @property {number} item ID of item placed on that spot (null if there is not any item)
 **/
function Cell (x, y, wall = false, mob = null, item = null) {
  this.x = x;
  this.y = y;
  this.wall = wall;
  this.mob = mob;
  this.item = item;
}
/**
 * A mob, a single creature living in our game :D It could be monter or player.
 * @class
 *
 * @constructor
 *
 * @property {number} id ID of mob, used to finding mob in Game.mobList
 * @property {number} x x position of mob
 * @property {number} y y position of mob
 * @property {string} type type of mob (player/snake/dragon)
 * @property {number} [hp] mob's health points
 * @property {number} [dmg] mob's attack points (damage)
 *
 **/
function Mob (id, x, y, type = "player", hp = 10, dmg = 1) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.type = type;
  this.hp = (this.type === "snake" ? 2 : (this.type === "dragon" ? 25 : hp));
  this.dmg = (this.type === "snake" ? 1 : (this.type === "dragon" ? 4 : dmg));

  /**
   * Moves mob in defined direction
   * @param {Object} game main object, board on which the mob is
   * @param {string} dir direction to move mob (u,r,d,l)
   *
   * @returns {bool} false if mob cannot be moved (eg. because of wall)
   **/
  this.move = function (game, dir) {
    /** Move mob */
    let go = (game, offsetX = 0, offsetY = 0) => {
      console.log("-=-=-==-=-=-=-=-=-=-=-=-=-= \n", offsetX, offsetY, dir);
      if (this.x + Number.parseInt(offsetX) < 0 || this.x + Number.parseInt(offsetX) > game.board[this.x].length - 1) {
        console.log("-=-=-==-=-=-=-=-=-=-=-=-=-= \n" + "x jest zle\n" /*this.x + offsetX */, this);
        return false;
      }
      if (this.y + Number.parseInt(offsetY) < 0 || this.y + Number.parseInt(offsetY) > game.board.length - 1) {
        console.log("-=-=-==-=-=-=-=-=-=-=-=-=-= \n" + "y jest zle\n" /*this.y + offsetY*/, this);
        return false;
      }
      /*if (game.board[this.x + offsetX][this.y + offsetY].wall) {
        return false;
      }
      if (game.board[this.x + offsetX][this.y + offsetY].mob !== null) {
        if (!(this.attack(game, game.board[this.x + offsetX][this.y + offsetY].mob))) {
          return false;
        }
      } else if (this.type === "player" && game.board[this.x + offsetX][this.y + offsetY].item !== null) {
        this.equip(game.board[this.x + offsetX][this.y + offsetY].item);
      }*/
      game.board[this.x][this.y].mob = null;
      game.board[this.x + offsetX][this.y + offsetY].mob = this.id;
      this.x += offsetX;
      this.y += offsetY;
      console.log("-=-=-==-=-=-=-=-=-=-=-=-=-= \n", this, dir);
      return true;
    }
    console.log(this, dir);
    switch (dir) {
      case "u":
        return go(game, 0, -1);
        break;
      case "r":
        return go(game, 1, 0);
        break;
      case "d":
        return go(game, 0, 1);
        break;
      case "l":
        return go(game, -1, 0);
        break;
    }
  }

  /**
   * Moves a MONSTER in player's direction
   * (very simple 'AI')
   * @param {Object} game main object, board on which the mob is
   *
   * @return {bool} false if mob cannot be moved (eg. because of wall)
   **/
  this.moveToPlayer = function (game) {
    let playerX = game.findMobAttribs(0)[2];
    let playerY = game.findMobAttribs(0)[3];

    if (this.x > playerX) {
      /** player is on left-up */
      if (this.y > playerY) {
        let randomDir = Math.random() < 0.5 ? "u" : "l";
        return this.move(game, randomDir);
      }
      /** player is on left-down */
      if (this.y < playerY) {
        let randomDir = Math.random() < 0.5 ? "u" : "r";
        return this.move(game, randomDir);
      }
      /** player is on left*/
      return this.move(game, "u");
    }
    if (this.x < playerX) {
      /** player is on right-up */
      if (this.y > playerY) {
        let randomDir = Math.random() < 0.5 ? "d" : "l";
        return this.move(game, randomDir);
      }
      /** player is on right-down */
      if (this.y < playerY) {
        let randomDir = Math.random() < 0.5 ? "d" : "r";
        return this.move(game, randomDir);
      }
      /** player is on right*/
      return this.move(game, "d");
    }
    /** player is on up */
    if (this.y > playerY) return this.move(game, "l");
    /** player is on down */
    if (this.y > playerY) return this.move(game, "r");
  }

  /**
   * Attacks mob with specified ID
   * @param {Object} game main object, board on which the target is
   * @param {number} targetId ID of attacked mob
   *
   * @return {bool} true if target is killed
   **/
  this.attack = function (game, targetId) {
    return game.mobList[game.findMobAttribs(targetId)[0]].getDamage(this.dmg);
  }

  /**
   * Changes hp of mob when is attacked and checking for death
   *
   * @param {number} amount amount of dmg dealt
   *
   * @returns {bool} true if killed
   **/
  this.getDamage = function (game, amount) {
    if (hp - amount <= 0) {
      game.board[this.x][this.y].mob = null;
      game.mobList[0].unshift(this.id);
      game.mobList.splice(game.findMobAttribs(this.id)[0],1);
    } else {
      this.hp -= amount;
    }
  }
 }
// </editor-fold>

// <editor-fold desc="Game loop">
let randBoard = 1;
let game = new Game(fs.readFileSync('zestaw_plansz/board' + randBoard + '.txt', 'utf8').split("\n").map(_ => _.split("")));
game.putPlayer();
game.fillWithMobs("random",5);
//while(game.mobList[game.findMobAttribs(0)[0]].hp > 0) {
for (let j = 0; j < 5; j++) {
  game.draw();
  let getKeyAndMove = function getKeyAndMove(){
  	var code = readlineSync.question("Jak chcesz się poruszyć?: ").toLowerCase();
  	switch(code){
  		case "left": //left arrow key
  			game.mobList[game.findMobAttribs(0)[0]].move(game, "l");
  			break;
  		case "up": //Up arrow key
  			game.mobList[game.findMobAttribs(0)[0]].move(game, "u");
  			break;
			case "right": //right arrow key
				game.mobList[game.findMobAttribs(0)[0]].move(game, "r");
				break;
  		case "down": //down arrow key
  			game.mobList[game.findMobAttribs(0)[0]].move(game, "d");
  			break;
  	}
  }
  getKeyAndMove();

  for (let i = 1; i < game.mobList.length; i++) {
    if (game.mobList[i].type !== "player") game.mobList[i].moveToPlayer(game);
  }
}
// </editor-fold>

    © 2019 GitHub, Inc.
    Terms
    Privacy
    Security
    Status
    Help

    Contact GitHub
    Pricing
    API
    Training
    Blog
    About

