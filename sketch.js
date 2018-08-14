const SPRITE_WIDTH = 8;
const SPRITE_HEIGHT = 8;

const SPRITE_SHEET_COLS = 7;
const SPRITE_SHEET_ROWS = 3;

const EXCEPTION_COL = 5;
const EXCEPTION_ROW = 0;
const EXCEPTION_WIDTH = 16;
const EXCEPTION_DRAW_OFFSET = 4;

const SPRITE_SHEET_WIDTH  = SPRITE_WIDTH * SPRITE_SHEET_COLS;
const SPRITE_SHEET_HEIGHT = SPRITE_HEIGHT * SPRITE_SHEET_ROWS;

const LEFT_INDEX  = 0;
const RIGHT_INDEX = 1;
const DOWN_INDEX  = 2;
const UP_INDEX    = 3;

const DIR_ROW = [
    0,
    0,
    1,
    2,
];

const IDLE_START = [
    0,
    0,
    0,
    0,
];

const IDLE_END = [
    0,
    0,
    0,
    0,
];

const WALK_START = [
    0,
    0,
    1,
    1,
];

const WALK_END = [
    1,
    1,
    2,
    2,
];

const SHOOT_START = [
    4,
    4,
    4,
    4,
];

const SHOOT_END = [
    5,
    5,
    5,
    5,
];



let direction = 0;
let shooting = false;
let walking = false;

let deltaTime = 0.0;
let time = 0.0;
let lastKey = -1;

let animationSpeed = 0.25 * 1000;
let animationTimer = 0.0;
let animationIndex = 0;

let spritesheet;
let sprites = []; //2D array


// new stuff
let characters = []; //3D array
let armours = []; //4D array
let weapons = []; //4D array

//ui
let none;
let characterImages = [];
let characterIndex = 0;

let characterArmourType = [
    0,
    0,
    1,
    1,
    2,
    2,
    2,
    0,
    1,
    0,
    1,
    0,
    1,
    0
];

let characterWeaponType = [
    0,
    1,
    2,
    3,
    4,
    4,
    4,
    0,
    2,
    1,
    2,
    0,
    3,
    5
];

let armourImages = []; //2D array
let armourIndex = -1;

let weaponImages = []; //2D array
let weaponIndex = -1;

// source images
let img_allCharacters;
let img_characterButtons;

let img_armourT11;
let img_armourT12;
let img_armourT13;
let img_armourT14;

let img_armourButtons;

let img_weaponT10;
let img_weaponT11;
let img_weaponT12;
let img_weaponT13;

let img_weaponButtons;



// character graphics outline effect adder
let characterGFX;

function preload() {

    none = loadImage("./media/img/none.png");

    img_allCharacters = loadImage("./media/img/All Characters.png");

    img_characterButtons = loadImage("./media/img/CharacterButtons.PNG");

    img_armourT11 = loadImage("./media/img/Armor T11.png");
    img_armourT12 = loadImage("./media/img/Armor T12.png");
    img_armourT13 = loadImage("./media/img/Armor T13.png");
    img_armourT14 = loadImage("./media/img/Armor T14.png");

    img_armourButtons = loadImage("./media/img/ArmourButtons.PNG");

    img_weaponT10 = loadImage("./media/img/Weapons T10.png");
    img_weaponT11 = loadImage("./media/img/Weapons T11.png");
    img_weaponT12 = loadImage("./media/img/Weapons T12.png");
    img_weaponT13 = loadImage("./media/img/Weapons T13.png");

    img_weaponButtons = loadImage("./media/img/WeaponButtons.PNG");
}


function setup() {
    createCanvas(900,700);

    //sprites = loadROTMGSheet("Depths Huntress 8x8.png");
    characters = loadMultiSpriteSheet(img_allCharacters, false);

    characterImages = loadSpriteSheet(img_characterButtons, false, 0, 1, 58, 54, 1, 14, 0, 12)[0];
    
    //armours = new PImage[4][][][];
    armours[0] = loadMultiSpriteSheet(img_armourT11, false);
    armours[1] = loadMultiSpriteSheet(img_armourT12, false);
    armours[2] = loadMultiSpriteSheet(img_armourT13, false);
    armours[3] = loadMultiSpriteSheet(img_armourT14, false);
    

    armourImages = loadSpriteSheet(img_armourButtons, false, 4, 2, 42, 42, 3, 4, 2, 12);
    
    //weapons = new PImage[4][][][];
    weapons[0] = loadMultiSpriteSheet(img_weaponT10, false);
    weapons[1] = loadMultiSpriteSheet(img_weaponT11, false);
    weapons[2] = loadMultiSpriteSheet(img_weaponT12, false);
    weapons[3] = loadMultiSpriteSheet(img_weaponT13, false);
    
    weaponImages = loadSpriteSheet(img_weaponButtons, false, 7, 2, 40, 40, 6, 4, 4, 12);

    noSmooth();
  
}

function draw() {
	KGUI.pre();
  
    deltaTime = millis() - time;
    time = millis();
    
    //background(100, 200, 100);
    background(255);
    
    textAlign(CENTER);
    textSize(24);
    //text("Press SPACE to select an image", width/2, 50);

    keyInput();
    
    for(let i = 0; i < characterImages.length; i++) {
        if(characterIndex == i) {
        fill(0);
        rect(8, 38 + i*47, 49, 49);
        } 
        if(KGUI.ImageButton(characterImages[i], 10, 40 + i*47, 45, 45)) {
        characterIndex = i;
        }
    }

    for(let i = -1; i < armourImages[characterArmourType[characterIndex]].length; i++) {
        if(armourIndex == i) {
        fill(0);
        rect(58, 38 + i*47, 49, 49);
        }
        let img = (i == -1 ? none : armourImages[characterArmourType[characterIndex]][i]);
        if(KGUI.ImageButton(img, 60, 40 + i*47, 45, 45)) {
        armourIndex = i;
        }
    }
    
    for(let i = -1; i < weaponImages[characterWeaponType[characterIndex]].length; i++) {
        if(weaponIndex == i) {
        fill(0);
        rect(108, 38 + i*47, 49, 49);
        }
        let img = (i == -1 ? none : weaponImages[characterWeaponType[characterIndex]][i]);
        if(KGUI.ImageButton(img, 110, 40 + i*47, 45, 45)) {
        weaponIndex = i;
        }
    }
    
    imageMode(CENTER);
    
    
    animationTimer += deltaTime;
    if(animationTimer >= animationSpeed) {
        animationIndex++;
        animationTimer -= animationSpeed;
    }
    
    
    let spriteCol = 0;
    let spriteRow = DIR_ROW[direction];
    
    if( shooting ) {
        if(SHOOT_START[direction] + animationIndex > SHOOT_END[direction]){
        animationIndex = 0;
        }
        spriteCol = SHOOT_START[direction] + animationIndex;
    } else if( walking ) {
        if(WALK_START[direction] + animationIndex > WALK_END[direction]){
        animationIndex = 0;
        }
        spriteCol = WALK_START[direction] + animationIndex; 
    } else {
        if(IDLE_START[direction] + animationIndex > IDLE_END[direction]){
        animationIndex = 0;
        }
        spriteCol = IDLE_START[direction] + animationIndex; 
    }
    
    
    // DRAW CHARACTER
        
    let flip = direction == LEFT_INDEX;
    
    let w = SPRITE_WIDTH;
    let h = SPRITE_HEIGHT;
    let xOff = 0;
    let yOff = 0;
    
    if(spriteCol == EXCEPTION_COL && spriteRow == EXCEPTION_ROW) {
        w = EXCEPTION_WIDTH;
        xOff = EXCEPTION_DRAW_OFFSET;
    }
    
    // scale
    w *= 6;
    h *= 6;
    xOff *= 6;
    yOff *= 6;
    
    
    if(characterGFX !== null && characterGFX !== undefined)
        characterGFX.remove()
    characterGFX = createGraphics(w+2, h+2);
    characterGFX.noSmooth();

    //characterGFX.beginDraw();
    
    characterGFX.imageMode(CENTER);
    
    characterGFX.push();
        
    if(flip) {
        characterGFX.scale(-1.0, 1.0);
    }
    
    //draw character
    characterGFX.image(characters[characterIndex][spriteCol][spriteRow], xOff + (flip ? -1 : 1) * characterGFX.width/2, characterGFX.height/2, w, h);
    
    //draw armour
    if(armourIndex >= 0)
        characterGFX.image(armours[armourIndex][characterIndex][spriteCol][spriteRow], xOff + (flip ? -1 : 1) * characterGFX.width/2, characterGFX.height/2, w, h);
    
    //draw weapon
    if(weaponIndex >= 0)
        characterGFX.image(weapons[weaponIndex][characterIndex][spriteCol][spriteRow], xOff + (flip ? -1 : 1) * characterGFX.width/2, characterGFX.height/2, w, h);
    
    characterGFX.pop();
    characterGFX.loadPixels();
    
    let outline = createImage(characterGFX.width, characterGFX.height);
    outline.loadPixels();
    for(let y = 0; y < characterGFX.height; y++) {
        for(let x = 0; x < characterGFX.width; x++) {
            let index = (x + y * characterGFX.width) * 4;
            // if alpha
            if(characterGFX.pixels[index + 3] === 0) {
                //check for non-alpha edge/corner
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(y + i > 0 && y + i < characterGFX.height && x + j > 0 && x + j < characterGFX.width) {
                            let checkIndex = ((x + j) + (y + i) * characterGFX.width) * 4;
                            if(characterGFX.pixels[checkIndex + 3] === 255) {
                                outline.pixels[index + 0] = 0;
                                outline.pixels[index + 1] = 0;
                                outline.pixels[index + 2] = 0;
                                outline.pixels[index + 3] = 255;
                            }
                        }
                    }
                }
            }
        }
    }
    outline.updatePixels();
    characterGFX.imageMode(CORNER);
    characterGFX.image(outline, 0, 0);
    
    //characterGFX.endDraw();
    
    image(characterGFX, width/2, height/2, characterGFX.width, characterGFX.height);
}

function keyInput() {
    walking = false;
    if(keyIsPressed) {
        if((keyCode == LEFT_ARROW) || key == 'a' || key == 'A') {
            walking = true;
            direction = LEFT_INDEX;
        }
        if((keyCode == RIGHT_ARROW) || key == 'd' || key == 'D') {
            walking = true;
            direction = RIGHT_INDEX;
        }
        if((keyCode == UP_ARROW) || key == 'w' || key == 'W') {
            walking = true;
            direction = UP_INDEX;
        }
        if((keyCode == DOWN_ARROW) || key == 's' || key == 'S') {
            walking = true;
            direction = DOWN_INDEX;
        }
    }
    
    if(keyIsPressed && key == ' ' && lastKey != key) {
         selectInput("Select a file to process:", "loadSpriteFromFile");
    }
    
    shooting = mouseIsPressed;
    
    lastKey = key;
    
}


function loadMultiSpriteSheet(imgOrFilename, isFile) { //returns 3D array
	let image;
    if(isFile === true) {
        image = loadImage(imgOrFilename);
    } else {
        image = imgOrFilename;
    }
    
    
    let numSheets = floor(image.height / SPRITE_SHEET_HEIGHT);
    console.log(numSheets);
    
    //PImage[][][] multi = new PImage[numSheets][SPRITE_SHEET_COLS][SPRITE_SHEET_ROWS];
    let multi = [];
    
    for(let i = 0; i < numSheets; i++) {
        multi[i] = loadROTMGSheet(image, 0, i * SPRITE_SHEET_HEIGHT);
    }
    
    return multi;
}

function loadROTMGSheet(filename) {
    spritesheet = loadImage(filename);
    return loadROTMGSheet(spritesheet, 0, 0);
}

function loadROTMGSheet(sheet, offsetX, offsetY) {
    let spriteSheet = loadSpriteSheet(sheet, false, offsetX, offsetY, SPRITE_WIDTH, SPRITE_HEIGHT, SPRITE_SHEET_COLS, SPRITE_SHEET_ROWS, 0, 0);
    
    //merge the attack together
    let exception = createImage(EXCEPTION_WIDTH, SPRITE_HEIGHT);
    exception.loadPixels();
    spriteSheet[EXCEPTION_COL][EXCEPTION_ROW].loadPixels();
    spriteSheet[EXCEPTION_COL+1][EXCEPTION_ROW].loadPixels();
    for(let y = 0; y < exception.height; y++) {
        for(let x = 0; x < exception.width; x++) {
            let index = (x + y * exception.width) * 4;
            let fromIndex = ((x % SPRITE_WIDTH) + y * SPRITE_WIDTH) * 4;
            exception.pixels[index + 0] = spriteSheet[EXCEPTION_COL + (x < SPRITE_WIDTH ? 0 : 1)][EXCEPTION_ROW].pixels[fromIndex + 0];
            exception.pixels[index + 1] = spriteSheet[EXCEPTION_COL + (x < SPRITE_WIDTH ? 0 : 1)][EXCEPTION_ROW].pixels[fromIndex + 1];
            exception.pixels[index + 2] = spriteSheet[EXCEPTION_COL + (x < SPRITE_WIDTH ? 0 : 1)][EXCEPTION_ROW].pixels[fromIndex + 2];
            exception.pixels[index + 3] = spriteSheet[EXCEPTION_COL + (x < SPRITE_WIDTH ? 0 : 1)][EXCEPTION_ROW].pixels[fromIndex + 3];
        }
    }
    exception.updatePixels();
    
    spriteSheet[EXCEPTION_COL][EXCEPTION_ROW] = exception;
    
    return spriteSheet;
}


function loadSpriteSheet(sheetOrFilename, isFile, offsetX, offsetY, spriteW, spriteH, columns, rows, spaceX, spaceY) {
	let sheet;
	if(isFile === true) {
        let sheet = loadImage(sheetOrFilename);
    } else {
        sheet = sheetOrFilename;
    }
    
    let sprites = [];//new PImage[columns][rows];
    
    for(let i = 0; i < columns; i++) {
        let row = [];
        for(let j = 0; j < rows; j++) {
            let sprite = sheet.get(offsetX + i*(spriteW + spaceX), offsetY + j*(spriteH + spaceY), spriteW, spriteH);//getRegion(sheet, offsetX + i*(spriteW + spaceX), offsetY + j*(spriteH + spaceY), spriteW, spriteH);
            row.push(sprite);
        } 
        sprites.push(row);
    }
    
    return sprites;

}


function loadSpriteFromFile(selection) {
    
    if(selection == null)
        return;
    
    try {
        
        sprites = loadROTMGSheet(selection.getAbsolutePath());
        
    } catch (e) {
        console.log(e);
    }
  
}


// KGUI



const KGUI = {
    
    app: null,
    
    pMousePressed: false,
    mousePressed: false,
    
    
    pre: function() {
        this.pMousePressed = this.mousePressed;
        this.mousePressed = mouseIsPressed;
    },
    
    ImageButton: function(img, x, y, w, h) {
        
        let hover = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y+h;
        
        imageMode(CORNER);
        if (hover) {
        if (this.mousePressed) {
        image(img, x + 1, y + 1, w - 2, h - 2);
        } else {
        image(img, x - 1, y - 1, w + 2, h + 2);
        }
        } else {
        image(img, x, y, w, h);
        }
        
        return hover && this.pMousePressed && !this.mousePressed;
    }
  
  
}