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
