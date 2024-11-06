//punt 1 is af
//punt 2 is af
//punt 3 is af
//punt 4 is af
//punt 5 is af
//punt 6 is af
//punt 7 is af
//punt 8 is af
//punt 9 is af
//punt 10 is af
//punt 11 (bonus) 
//kijk classroom voor opdrachten

//issues: Appels moeten verdwijnen als je ze opeet, misschien nog een extra feature

var levens = 3;

class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }
  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  
  teken() {
    push();
    stroke('grey');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        if (kolom == 17 || rij == 11) {
          fill('orange')
        }
        else {
          noFill()
        }
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
};

var rodeAppel = {
  x: null,
  y: null,
  toon() {
    image(rodeAppelImage, this.x, this.y, raster.celGrootte, raster.celGrootte)
  }
};

var groeneAppel = {
  x: null,
  y: null,
  snelheidX: 30,
  snelheidY: 30,
  demping: 1.0,


  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;


    if (this.x <= 0 || this.x >= canvas.width - raster.celGrootte) {
      this.snelheidX *= -this.demping;
    }

    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.snelheidY *= -this.demping;
    }
  },
  toon() {
    image(groeneAppelImage, this.x, this.y, raster.celGrootte, raster.celGrootte)
  }

};

class Bom {
  constructor(xPositie) {
    this.snelheidY = floor(random(0, raster.celGrootte * 0.5));
    this.stapGrootte = raster.celGrootte
    this.x = xPositie
    this.y = floor(random(1, raster.aantalRijen - 1)) * raster.celGrootte;
  }

  beweeg() {
    this.y += this.snelheidY;

    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.snelheidY *= -1;
    }
  }

  toon() {
    image(bomImage, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

var bommenArray = [];
var gebruikteKolommen = [];

function toonEindScherm(gewonnen) {
  if (gewonnen) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 30, 300);
  } else {
    background('red');
    fill('white');
    textSize(30);
    text("Helaas, je hebt verloren", (canvas.width/2)+.180, canvas.height/2);
  }
  noLoop();
}


class Jos {
  constructor() {
    this.spawn();
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
  }
  spawn() {
    this.x = raster.celGrootte * 0;
    this.y = raster.celGrootte * 5;
  }
  wordtGeraaktPositief2() {
    if (this.x >= groeneAppel.x && this.x < groeneAppel.x + raster.celGrootte &&
      this.y >= groeneAppel.y && this.y < groeneAppel.y + raster.celGrootte) {
      levens++;
      return true;
    }
  }
  wordtGeraaktPositief() {
    if (this.x >= rodeAppel.x && this.x < rodeAppel.x + raster.celGrootte &&
      this.y >= rodeAppel.y && this.y < rodeAppel.y + raster.celGrootte) {
      levens++;
      return true;
    }
    else {
      return false;
    }
  }

  beweeg() {
    if (keyIsDown(65)) { // A
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) { // D
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) { // W
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) { // S
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    if (this.y >= canvas.height) {
      this.y = 0;
    }

    if (this.y < 0) {
      this.y = canvas.height - raster.celGrootte;
    }

    this.x = constrain(this.x, 0, canvas.width);

    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x >= vijand.x && this.x < vijand.x + raster.celGrootte &&
      this.y >= vijand.y && this.y < vijand.y + raster.celGrootte) {
      levens--;
      return true;
    }
    else {
      return false;
    }
  }


  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
  groeneAppelImage = loadImage("images/sprites/appel_1.png")
  rodeAppelImage = loadImage("images/sprites/appel_2.png")
  bomImage = loadImage("images/sprites/bom.png")
  backgroundExtra2 = loadImage("images/nederland.jpeg")
  backgroundMain = loadImage("images/backgrounds/nasa.jpeg")
  bomGeluid = loadSound("geluid/bom explosie.mp3")
}

function setup() {
  canvas = createCanvas(900, 600); //grootte speelveld (1880, 1100 is perfect)
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  raster = new Raster(12,18);

  raster.berekenCelGrootte();
  
  rodeAppel.x = floor(random(1, raster.aantalKolommen)) * raster.celGrootte;
  rodeAppel.y = floor(random(1, raster.aantalRijen)) * raster.celGrootte;

  groeneAppel.x = floor(random(1, raster.aantalKolommen - 1)) * raster.celGrootte; //mogelijke x coördinaten waar de groene appel terecht komt
  groeneAppel.y = floor(random(1, raster.aantalRijen - 1)) * raster.celGrootte;


  for (var b = 0; b < 5; b++) {
    var nieuweKolom;
    do {
      nieuweKolom = floor(random(0.5 * raster.aantalKolommen, raster.aantalKolommen - 1));
    } while (gebruikteKolommen.includes(nieuweKolom));

    gebruikteKolommen.push(nieuweKolom);
    bommenArray.push(new Bom(nieuweKolom * raster.celGrootte, 0));
  }



  console.log(bommenArray[0].snelheidY);
  console.log(bommenArray[1].snelheidY);
  console.log(bommenArray[2].snelheidY);


  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    var frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  
}

function draw() {
  background(backgroundMain);
  fill('snow');
  text("Aantal Levens: " + levens, raster.celGrootte * 0.5, raster.celGrootte * 0.5);
  textSize(15);
  raster.teken();

  if (mouseX >= canvas.width - raster.celGrootte && mouseX <= canvas.width) {
    background(backgroundExtra2);
    raster.teken();
    text("Aantal Levens: " + levens, raster.celGrootte * 0.5, raster.celGrootte * 0.5);
  }

  if (mouseY >= canvas.height - raster.celGrootte && mouseY <= canvas.height) {
    background();
    raster.teken();
  }

  rodeAppel.toon();
  groeneAppel.beweeg();
  groeneAppel.toon();
  

  for (var b = 0; b < bommenArray.length; b++) {
    bommenArray[b].beweeg();
    bommenArray[b].toon();

  }

  bob.beweeg();
  eve.beweeg();
  alice.beweeg();
  bob.toon();
  eve.toon();
  alice.toon();
  
  
  
  if (eve.wordtGeraaktPositief(rodeAppel)) {
    rodeAppel.x = 2000;
  }

  if (eve.wordtGeraaktPositief2(groeneAppel)) {
    groeneAppel.x = 2000;
  }
  //if (eve.wordtGeraakt (alice) || eve.wordtGeraakt (bob) {
    //levens = levens - 1
  //}


  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) ||
    bommenArray.some(bom => eve.wordtGeraakt(bom))) {
    eve.spawn();
  }

  if (bommenArray.some(bom => eve.wordtGeraakt(bom))) {
     bomGeluid.play();
  }
  
  if (levens <= 0) {
    toonEindScherm(false);
  }

  if (eve.gehaald) {
    toonEindScherm(true);
  }

}

