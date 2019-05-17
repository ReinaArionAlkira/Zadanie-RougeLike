const fs = require('fs');

let board = fs.readFileSync('board.txt', 'utf8').split("\n").map(_ => _.split("").map(_ => _ === '#' ? 1 : 0));
let legend = fs.readFileSync('legend.txt', 'utf8').split("\n");
board.print = function () {
    this.forEach(_ => console.log(_.map(_ => _ === 1 ? "#" : '.').join("")));
}
legend.print = function () {
    this.forEach(_ => console.log(_));
}
/*
const mob = {
  position:
}
*/
//const Dragon = Object.create(mob);

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
  console.log('przesuń')
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
