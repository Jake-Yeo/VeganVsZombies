"use strict";
/* 
 * Copyright (c) 2012, 2016 Carson Cheng.
 * Licensed under the MIT-License (http://opensource.org/licenses/MIT)
 * which can be found in the file MIT-LICENSE.txt in the LICENSE directory
 * at the root of this project distribution.
 */
// There are a bunch of special variables and functions.
// Here are some notable ones, but there are many more:
// setup, draw, PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT
var allZoms = [];
var allBullets = [];
var allTexts = [];
var player = [];
var background = [];
var laserhit = new Audio('sound/laserhit.mp3');
var blip = new Audio('sound/blip.mp3');
var bash = new Audio('sound/bash.mp3');
var audio = new Audio('sound/Fuchsia Red Sky.mp3');
var turret = [];
var newzom = 4;
var wavecounter = 0;
var gameover = "false";
var farmhp = 100;
var pts = 0;
var numofzomskilled = 0;
var gamestart = "no";
var wave = 0;
var player0xpos;
var player0ypos;
var timetillclick = 0;
var decayrate = 0.98;
var wait = 0;
var canshootbulletnow;
var backgroundGroupName = "backgroundGroup";
var playerGroupName = "playerGroup";
var bulletGroupName = "bulletGroup";
var zomGroupName = "zomGroup";
var ghostGroupName = "ghostGroup";
var textGroupName = "textGroup";
var turretGroupName = "turretGroup";
var setup = function () {
    createGroupInPlayground(backgroundGroupName);
    createGroupInPlayground(ghostGroupName);
    createGroupInPlayground(turretGroupName);
    createGroupInPlayground(playerGroupName);
    createGroupInPlayground(bulletGroupName);
    createGroupInPlayground(zomGroupName);
    createGroupInPlayground(textGroupName);
    createbackground();
    addtext();
    addtext();
    addtext();
    addtext();
    addplayer();
    addturret();
};
var addtext = function () {
    var spriteInfo;
    var index;
    index = allTexts.length;
    allTexts[index] = {
        "id": "text" + index,
        "width": 5000,
        "height": 50,
        "xpos": 100,
        "ypos": 100
    };
    spriteInfo = allTexts[index];
    createTextSpriteInGroup(textGroupName, spriteInfo["id"], spriteInfo["width"], spriteInfo["height"], spriteInfo["xpos"], spriteInfo["ypos"]);
};
var createbackground = function () {
    var spriteInfo;
    var index;
    index = background.length;
    background[index] = {
        "id": "background" + index,
        "width": 1000,
        "height": 480,
        "screen1": newGQAnimation("img/screen1.png"),
        "screen2": newGQAnimation("img/screen2.png"),
        "screen3": newGQAnimation("img/screen3.png"),
        "screen4": newGQAnimation("img/screen4.png"),
        "gameoverscreen": newGQAnimation("img/gameoverscreen.png"),
        "youwonscreen": newGQAnimation("img/youwonscreen.png"),
        "tips": newGQAnimation("img/tips.png"),
        "screen5": newGQAnimation("img/screen5.png"),
        "startanim": newGQAnimation("img/gamescreen.png"),
        "xpos": 0,
        "ypos": 0
    };
    spriteInfo = background[index];
    createSpriteInGroup(backgroundGroupName, spriteInfo["id"], spriteInfo["screen2"], spriteInfo["width"], spriteInfo["height"], spriteInfo["xpos"], spriteInfo["ypos"]);
    spriteSetY(background[0]["id"], 40);
};
var addbullet = function () {
    player0xpos = spriteGetX("player0");
    player0ypos = spriteGetY("player0");
    var spriteInfo;
    var index;
    index = allBullets.length;
    allBullets[index] = {
        "id": "bullet" + index,
        "width": 15,
        "height": 4,
        "stillanim": newGQAnimation("img/bulletlr.png"),
        "xspeed": 15,
        "yspeed": 5,
        "xpos": 63,
        "ypos": player0ypos + 27,
        "shot": "false"
    };
    spriteInfo = allBullets[index];
    createSpriteInGroup(bulletGroupName, spriteInfo["id"], spriteInfo["stillanim"], spriteInfo["width"], spriteInfo["height"], spriteInfo["xpos"], spriteInfo["ypos"]);
};
var addplayer = function () {
    var spriteInfo;
    var index;
    index = player.length;
    player[index] = {
        "id": "player" + index,
        "width": 63,
        "height": 63,
        "stillanim": newGQAnimation("img/character.png"),
        "movinganim": newGQAnimation("img/charactermove.png.png", 43, 63, 50, $.gQ.ANIMATION_HORIZONTAL),
        "currentanim": "stillanim",
        "xspeed": 0,
        "yspeed": 9,
        "xpos": 100,
        "ypos": 0
    };
    spriteInfo = player[index];
    createSpriteInGroup(playerGroupName, spriteInfo["id"], spriteInfo["stillanim"], spriteInfo["width"], spriteInfo["height"], spriteInfo["xpos"], spriteInfo["ypos"]);
};
var addturret = function () {
    player0xpos = spriteGetX("player0");
    player0ypos = spriteGetY("player0");
    var spriteInfo;
    var index;
    index = turret.length;
    turret[index] = {
        "id": "turret" + index,
        "width": 53,
        "height": 72,
        "anim": newGQAnimation("img/turret.png"),
        "xspeed": -2,
        "yspeed": 0,
        "angle": 0,
        "xpos": 10,
        "ypos": player0ypos,
        "health": 100
    };
    spriteInfo = turret[index];
    createSpriteInGroup(turretGroupName, spriteInfo["id"], spriteInfo["anim"], spriteInfo["width"], spriteInfo["height"], spriteInfo["xpos"], spriteInfo["ypos"]);
    spriteRotate(spriteInfo["id"], 90);
};
var addzom = function () {
    var spriteInfo;
    var index;
    index = allZoms.length;
    allZoms[index] = {
        "id": "zom" + index,
        "width": 43,
        "height": 43,
        "anim": newGQAnimation("img/strongzomani.png", 3, 43, 50, $.gQ.ANIMATION_HORIZONTAL),
        "ghostanim": newGQAnimation("img/ghost.png", 7, 43, 200, $.gQ.ANIMATION_HORIZONTAL),
        "mutatedanim": newGQAnimation("img/mutatedzom.png"),
        "skeletonanim": newGQAnimation("img/skeleton.png", 3, 43, 50, $.gQ.ANIMATION_HORIZONTAL),
        "goblinanim": newGQAnimation("img/goblin.png", 3, 43, 50, $.gQ.ANIMATION_HORIZONTAL),
        "camoanim": newGQAnimation("img/camozom.png"),
        "fallenghostanim": newGQAnimation("img/fallenghost.png"),
        "redskullanim": newGQAnimation("img/redskull.png", 3, 43, 50, $.gQ.ANIMATION_HORIZONTAL),
        "skullatronanim": newGQAnimation("img/skullatron.png", 3, 83, 50, $.gQ.ANIMATION_HORIZONTAL),
        "fastzomanim": newGQAnimation("img/fastzom.png", 7, 43, 100, $.gQ.ANIMATION_HORIZONTAL),
        "playerknockback": 63,
        "bulletknockback": 5,
        "playerdmg": 1,
        "bulletdmg": 1,
        "xspeed": -1,
        "yspeed": 0,
        "angle": 0,
        "xpos": PLAYGROUND_WIDTH,
        "ypos": Math.random() * (PLAYGROUND_HEIGHT - 43),
        "enemyhit": "false",
        "health": 3,
        "dmg": 5,
        "pts": 3,
        "healthwhenrespawn": 3,
        "respawntime": -600
    };
    spriteInfo = allZoms[index];
    createSpriteInGroup(zomGroupName, spriteInfo["id"], spriteInfo["anim"], spriteInfo["width"], spriteInfo["height"], spriteInfo["xpos"], spriteInfo["ypos"]);
};
var startgame = function () {
    timetillclick = timetillclick + 1;
    if (getKeyState(52) && gamestart == "no") {
        spriteSetAnimation(background[0]["id"], background[0]["screen2"]);
        gamestart = 1;
    }
    if (getKeyState(52) && gamestart == 1 && timetillclick > 10) {
        spriteSetAnimation(background[0]["id"], background[0]["screen1"]);
        timetillclick = 10;
        gamestart = 2;
    }
    if (getKeyState(52) && gamestart == 2 && timetillclick > 20) {
        spriteSetAnimation(background[0]["id"], background[0]["screen3"]);
        timetillclick = 20;
        gamestart = 3;
    }
    if (getKeyState(52) && gamestart == 3 && timetillclick > 30) {
        spriteSetAnimation(background[0]["id"], background[0]["screen4"]);
        timetillclick = 30;
        gamestart = 4;
    }
    if (getKeyState(52) && gamestart == 4 && timetillclick > 40) {
        spriteSetAnimation(background[0]["id"], background[0]["tips"]);
        timetillclick = 40;
        gamestart = 5;
    }
    if (getKeyState(52) && gamestart == 5 && timetillclick > 50) {
        spriteSetAnimation(background[0]["id"], background[0]["screen5"]);
        timetillclick = 50;
        gamestart = 6;
    }
    if (getKeyState(52) && gamestart == 6 && timetillclick > 60) {
        spriteSetAnimation(background[0]["id"], background[0]["startanim"]);
        timetillclick = 0;
        spriteSetY(background[0]["id"], 0);
        gamestart = "yes";
    }
};
var wavecontroller = function () {
    if (gamestart == "yes") {
        if (getKeyState(32)) {
            numofzomskilled = numofzomskilled + 1;
            pts = pts + 1;
        }
        audio.play();
        if (pts == 0 && wave == 0 && pts < 300) {
            addzom();
            wave = wave + 1;
        }
        if (pts > 30 && wave == 1 && pts < 300) {
            addzom();
            spriteSetAnimation(allZoms[1]["id"], allZoms[1]["goblinanim"]);
            wave = wave + 1;
        }
        if (pts > 60 && wave == 2 && pts < 300) {
            allZoms[0]["yspeed"] = 1;
            wave = wave + 1;
        }
        if (pts > 90 && wave == 3 && pts < 300) {
            addzom();
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["ghostanim"]);
            allZoms[2]["yspeed"] = 5;
            allZoms[2]["xspeed"] = -1;
            allZoms[2]["health"] = 5;
            allZoms[2]["healthwhenrespawn"] = 5;
            wave = wave + 1;
        }
        if (pts > 130 && wave == 4 && pts < 300) {
            allZoms[1]["xspeed"] = -2;
            allZoms[1]["health"] = 20;
            allZoms[1]["healthwhenrespawn"] = 20;
            allZoms[1]["respawntime"] = -700;
            wave = wave + 1;
        }
        if (pts > 130 && pts < 300) {
            if (allZoms[1]["ypos"] > player[0]["ypos"]) {
                allZoms[1]["yspeed"] = -2;
            }
            if (allZoms[1]["ypos"] < player[0]["ypos"]) {
                allZoms[1]["yspeed"] = 2;
            }
        }
        if (pts > 180 && wave == 5 && pts < 300) {
            addzom();
            allZoms[3]["xspeed"] = -1;
            allZoms[3]["health"] = 25;
            allZoms[3]["healthwhenrespawn"] = 25;
            allZoms[3]["respawntime"] = -950;
            spriteSetAnimation(allZoms[3]["id"], allZoms[3]["mutatedanim"]);
            wave = wave + 1;
        }
        if (pts > 180 && pts < 300) {
            if (allZoms[3]["ypos"] > player[0]["ypos"]) {
                allZoms[3]["yspeed"] = 2;
            }
            if (allZoms[3]["ypos"] < player[0]["ypos"]) {
                allZoms[3]["yspeed"] = -2;
            }
            if (allZoms[3]["ypos"] < 5) {
                allZoms[3]["ypos"] = 5;
            }
            if (allZoms[3]["ypos"] > PLAYGROUND_HEIGHT - 100) {
                allZoms[3]["ypos"] = PLAYGROUND_HEIGHT - 100;
            }
        }
        if (pts > 190 && wave == 6 && pts < 300) {
            addzom();
            allZoms[4]["xspeed"] = -0.2;
            allZoms[4]["health"] = 50;
            allZoms[4]["healthwhenrespawn"] = 50;
            allZoms[4]["respawntime"] = -600;
            spriteSetAnimation(allZoms[4]["id"], allZoms[4]["skeletonanim"]);
            wave = wave + 1;
        }
        if (pts > 230 && wave == 7) {
            if (allZoms[3]["xpos"] < -43) {
                allZoms[3]["xspeed"] = 0;
                allZoms[3]["yspeed"] = 0;
                spriteSetAnimation(allZoms[3]["id"], allZoms[3]["anim"]);
            }
            if (allZoms[4]["xpos"] < -43) {
                allZoms[4]["xspeed"] = 0;
                allZoms[4]["yspeed"] = 0;
                spriteSetAnimation(allZoms[4]["id"], allZoms[4]["anim"]);
            }
            if (allZoms[1]["xpos"] < -43) {
                allZoms[1]["xspeed"] = 0;
                allZoms[1]["yspeed"] = 0;
                spriteSetAnimation(allZoms[1]["id"], allZoms[1]["anim"]);
            }
            if (allZoms[2]["xpos"] < -43) {
                allZoms[2]["xspeed"] = 0;
                allZoms[2]["yspeed"] = 0;
                spriteSetAnimation(allZoms[2]["id"], allZoms[2]["anim"]);
            }
            if (allZoms[0]["xpos"] < -43) {
                allZoms[0]["xspeed"] = 0;
                allZoms[0]["yspeed"] = 0;
                spriteSetAnimation(allZoms[0]["id"], allZoms[0]["anim"]);
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0) {
                wave = wave + 1;
            }
        }
        if (wave == 8) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Zombie Army Invading From The East!");
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            allZoms[0]["xspeed"] = -1;
            allZoms[0]["yspeed"] = 0;
            allZoms[0]["healthwhenrespawn"] = 3;
            allZoms[0]["health"] = 3;
            allZoms[1]["xspeed"] = -1;
            allZoms[1]["yspeed"] = 0;
            allZoms[1]["healthwhenrespawn"] = 3;
            allZoms[1]["health"] = 3;
            allZoms[2]["xspeed"] = -1;
            allZoms[2]["yspeed"] = 0;
            allZoms[2]["healthwhenrespawn"] = 3;
            allZoms[2]["health"] = 3;
            allZoms[3]["xspeed"] = -1;
            allZoms[3]["yspeed"] = 0;
            allZoms[3]["healthwhenrespawn"] = 3;
            allZoms[3]["health"] = 3;
            allZoms[4]["xspeed"] = -1;
            allZoms[4]["yspeed"] = 0;
            allZoms[4]["healthwhenrespawn"] = 3;
            allZoms[4]["health"] = 3;
            allZoms[0]["respawntime"] = -600;
            allZoms[1]["respawntime"] = -600;
            allZoms[2]["respawntime"] = -600;
            allZoms[3]["respawntime"] = -600;
            allZoms[4]["respawntime"] = -600;
            wave = wave + 1;
        }
        if (wave == 9 && pts > 630) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Zombie Army Has Been Defeated!");
            wave = wave + 1;
        }
        if (wave == 10 && pts > 630) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = 0;
                    zomInfo["yspeed"] = 0;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0 && allZoms[6]["xspeed"] == 0 && allZoms[7]["xspeed"] == 0 && allZoms[8]["xspeed"] == 0 && allZoms[9]["xspeed"] == 0 && allZoms[10]["xspeed"] == 0 && allZoms[11]["xspeed"] == 0 && allZoms[12]["xspeed"] == 0 && allZoms[13]["xspeed"] == 0 && allZoms[14]["xspeed"] == 0 && allZoms[15]["xspeed"] == 0 && allZoms[16]["xspeed"] == 0 && allZoms[17]["xspeed"] == 0 && allZoms[18]["xspeed"] == 0 && allZoms[19]["xspeed"] == 0) {
                wave = wave + 1;
            }
        }
        if (wave == 11 && wave < 15) {
            allZoms[0]["xspeed"] = -3;
            allZoms[0]["yspeed"] = 0;
            allZoms[0]["pts"] = 4;
            spriteSetAnimation(allZoms[0]["id"], allZoms[0]["camoanim"]);
            wave = wave + 1;
        }
        if (wave > 11 && wave < 15) {
            if (allZoms[0]["ypos"] > player[0]["ypos"]) {
                allZoms[0]["yspeed"] = 3;
            }
            if (allZoms[0]["ypos"] < player[0]["ypos"]) {
                allZoms[0]["yspeed"] = -3;
            }
            if (allZoms[0]["ypos"] < 5) {
                allZoms[0]["ypos"] = 5;
            }
            if (allZoms[0]["ypos"] > PLAYGROUND_HEIGHT - 100) {
                allZoms[0]["ypos"] = PLAYGROUND_HEIGHT - 100;
            }
        }
        if (wave == 12 && pts > 680) {
            allZoms[1]["xspeed"] = -3;
            allZoms[1]["yspeed"] = 0;
            allZoms[1]["pts"] = 5;
            spriteSetAnimation(allZoms[1]["id"], allZoms[1]["camoanim"]);
            wave = wave + 1;
        }
        if (wave > 12 && wave < 15) {
            if (allZoms[1]["ypos"] > player[0]["ypos"]) {
                allZoms[1]["yspeed"] = 4;
            }
            if (allZoms[1]["ypos"] < player[0]["ypos"]) {
                allZoms[1]["yspeed"] = -4;
            }
            if (allZoms[1]["ypos"] < 5) {
                allZoms[1]["ypos"] = 5;
            }
            if (allZoms[1]["ypos"] > PLAYGROUND_HEIGHT - 100) {
                allZoms[1]["ypos"] = PLAYGROUND_HEIGHT - 100;
            }
        }
        if (wave == 13 && pts > 744) {
            if (allZoms[1]["xpos"] < -43) {
                allZoms[1]["xspeed"] = 0;
                allZoms[1]["yspeed"] = 0;
                spriteSetAnimation(allZoms[4]["id"], allZoms[4]["anim"]);
                wave = wave + 1;
            }
        }
        if (wave == 14 && pts > 744) {
            allZoms[1]["xspeed"] = -4;
            allZoms[1]["yspeed"] = 5;
            allZoms[1]["pts"] = 4;
            allZoms[1]["dmg"] = 6;
            allZoms[1]["health"] = 5;
            allZoms[1]["healthwhenrespawn"] = 5;
            allZoms[1]["respawntime"] = -650;
            spriteSetAnimation(allZoms[1]["id"], allZoms[1]["redskullanim"]);
            allZoms[2]["xspeed"] = -3;
            allZoms[2]["yspeed"] = -5;
            allZoms[2]["pts"] = 4;
            allZoms[2]["dmg"] = 5;
            allZoms[2]["health"] = 5;
            allZoms[2]["healthwhenrespawn"] = 5;
            allZoms[2]["respawntime"] = -600;
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["redskullanim"]);
            wave = wave + 1;
        }
        if (wave == 15 && pts > 860) {
            if (allZoms[0]["xpos"] < -43) {
                allZoms[0]["xspeed"] = 0;
                allZoms[0]["yspeed"] = 0;
            }
            if (allZoms[1]["xpos"] < -43) {
                allZoms[1]["xspeed"] = 0;
                allZoms[1]["yspeed"] = 0;
            }
            if (allZoms[2]["xpos"] < -43) {
                allZoms[2]["xspeed"] = 0;
                allZoms[2]["yspeed"] = 0;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0) {
                wave = wave + 1;
            }
        }
        if (wave == 16 && pts > 860) {
            allZoms[0]["xpos"] = -720;
            allZoms[0]["xspeed"] = -1;
            allZoms[0]["yspeed"] = 3;
            allZoms[0]["pts"] = 4;
            allZoms[0]["dmg"] = 6;
            allZoms[0]["health"] = 20;
            allZoms[0]["healthwhenrespawn"] = 20;
            allZoms[0]["respawntime"] = -750;
            spriteSetAnimation(allZoms[0]["id"], allZoms[2]["goblinanim"]);

            allZoms[1]["xpos"] = -720;
            allZoms[1]["xspeed"] = -1;
            allZoms[1]["yspeed"] = -6;
            allZoms[1]["pts"] = 4;
            allZoms[1]["dmg"] = 6;
            allZoms[1]["health"] = 20;
            allZoms[1]["healthwhenrespawn"] = 20;
            allZoms[1]["respawntime"] = -750;
            spriteSetAnimation(allZoms[1]["id"], allZoms[2]["goblinanim"]);

            allZoms[2]["xpos"] = -720;
            allZoms[2]["xspeed"] = -1;
            allZoms[2]["yspeed"] = 1;
            allZoms[2]["pts"] = 4;
            allZoms[2]["dmg"] = 6;
            allZoms[2]["health"] = 20;
            allZoms[2]["healthwhenrespawn"] = 20;
            allZoms[2]["respawntime"] = -750;
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["goblinanim"]);

            allZoms[3]["xpos"] = -720;
            allZoms[3]["xspeed"] = -1;
            allZoms[3]["yspeed"] = -2;
            allZoms[3]["pts"] = 4;
            allZoms[3]["dmg"] = 6;
            allZoms[3]["health"] = 20;
            allZoms[3]["healthwhenrespawn"] = 20;
            allZoms[3]["respawntime"] = -750;
            spriteSetAnimation(allZoms[3]["id"], allZoms[2]["goblinanim"]);

            allZoms[4]["xpos"] = -720;
            allZoms[4]["xspeed"] = -1;
            allZoms[4]["yspeed"] = 5;
            allZoms[4]["pts"] = 4;
            allZoms[4]["dmg"] = 6;
            allZoms[4]["health"] = 20;
            allZoms[4]["healthwhenrespawn"] = 20;
            allZoms[4]["respawntime"] = -750;
            spriteSetAnimation(allZoms[4]["id"], allZoms[2]["goblinanim"]);

            allZoms[5]["xpos"] = -720;
            allZoms[5]["xspeed"] = -1;
            allZoms[5]["yspeed"] = 3;
            allZoms[5]["pts"] = 4;
            allZoms[5]["dmg"] = 6;
            allZoms[5]["health"] = 20;
            allZoms[5]["healthwhenrespawn"] = 20;
            allZoms[5]["respawntime"] = -750;
            spriteSetAnimation(allZoms[5]["id"], allZoms[2]["goblinanim"]);
            wave = wave + 1;
        }
        if (wave > 16 && wave < 18) {
            allZoms[0]["ypos"] = 80;
            allZoms[1]["ypos"] = 160;
            allZoms[2]["ypos"] = 240;
            allZoms[3]["ypos"] = 320;
            allZoms[4]["ypos"] = 400;
            allZoms[5]["ypos"] = 1;
        }
        if (wave == 17 && pts > 940) {
            wave = wave + 1;
        }
        if (wave == 18 && pts > 1010) {
            if (allZoms[0]["xpos"] < -43) {
                allZoms[0]["xspeed"] = 0;
                allZoms[0]["yspeed"] = 0;
            }
            if (allZoms[1]["xpos"] < -43) {
                allZoms[1]["xspeed"] = 0;
                allZoms[1]["yspeed"] = 0;
            }
            if (allZoms[2]["xpos"] < -43) {
                allZoms[2]["xspeed"] = 0;
                allZoms[2]["yspeed"] = 0;
            }
            if (allZoms[3]["xpos"] < -43) {
                allZoms[3]["xspeed"] = 0;
                allZoms[3]["yspeed"] = 0;
            }
            if (allZoms[4]["xpos"] < -43) {
                allZoms[4]["xspeed"] = 0;
                allZoms[4]["yspeed"] = 0;
            }
            if (allZoms[5]["xpos"] < -43) {
                allZoms[5]["xspeed"] = 0;
                allZoms[5]["yspeed"] = 0;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0) {
                wave = wave + 1;
            }
        }
        if (wave == 19 && pts > 1010) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                zomInfo["xpos"] = PLAYGROUND_WIDTH;
                zomInfo["xspeed"] = -0.2;
                zomInfo["yspeed"] = 0;
                zomInfo["pts"] = 10;
                zomInfo["dmg"] = 5;
                zomInfo["health"] = 50;
                zomInfo["playerknockback"] = 0;
                zomInfo["bulletknockback"] = 0;
                zomInfo["healthwhenrespawn"] = 5;
                zomInfo["respawntime"] = -600;
                zomIndex = zomIndex + 1;
            }
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Skullutron King Attackiing From The East! Kill The King To Win! PS, The King Does Not Take Damage From Your Puny Player");
            allZoms[0]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[0]["ypos"] = PLAYGROUND_HEIGHT / 2;
            allZoms[0]["xspeed"] = -4;
            allZoms[0]["yspeed"] = 0;
            allZoms[0]["pts"] = 500;
            allZoms[0]["dmg"] = 6;
            allZoms[0]["health"] = 75;
            allZoms[0]["healthwhenrespawn"] = 20;
            allZoms[0]["respawntime"] = -750;
            allZoms[0]["height"] = 83;
            allZoms[0]["width"] = 83;
            allZoms[0]["playerknockback"] = 0;
            allZoms[0]["bulletknockback"] = 0;
            allZoms[0]["playerdmg"] = 0;
            spriteSetAnimation(allZoms[0]["id"], allZoms[2]["skullatronanim"]);
            spriteSetAnimation(allZoms[1]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[3]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[4]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[5]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[6]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[7]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[8]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[9]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[10]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[11]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[12]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[13]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[14]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[15]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[16]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[17]["id"], allZoms[2]["redskullanim"]);
            allZoms[1]["ypos"] = 30;
            allZoms[2]["ypos"] = 60;
            allZoms[3]["ypos"] = 90;
            allZoms[4]["ypos"] = 120;
            allZoms[5]["ypos"] = 150;
            allZoms[6]["ypos"] = 180;
            allZoms[7]["ypos"] = 210;
            allZoms[8]["ypos"] = 240;
            allZoms[9]["ypos"] = 270;
            allZoms[10]["ypos"] = 300;
            allZoms[11]["ypos"] = 330;
            allZoms[12]["ypos"] = 360;
            allZoms[13]["ypos"] = 390;
            allZoms[14]["ypos"] = 420;
            allZoms[15]["ypos"] = 436;
            allZoms[16]["ypos"] = 436;
            allZoms[17]["ypos"] = 1;
            wave = wave + 1;
        }
        if (wave == 20) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = -1;
                    zomInfo["yspeed"] = 1;
                    zomInfo["playerknockback"] = 63;
                    zomInfo["bulletknockback"] = 5;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xpos"] < PLAYGROUND_WIDTH - 84) {
                allZoms[0]["xspeed"] = 0;
            }
            if (allZoms[0]["xpos"] < -43) {
                allZoms[0]["xspeed"] = 0;
                allZoms[0]["yspeed"] = 0;
                allZoms[0]["height"] = 43;
                allZoms[0]["width"] = 43;
                allZoms[0]["playerknockback"] = 63;
                allZoms[0]["bulletknockback"] = 5;
                allZoms[0]["playerdmg"] = 1;
                wave = wave + 1;
            }
            allZoms[18]["xspeed"] = 0;
            allZoms[19]["xspeed"] = 0;
        }
        if (wave == 21) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Skullatron King Has Been Abolished!");
            wave = wave + 1;
        }
        if (wave == 22) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = 0;
                    zomInfo["yspeed"] = 0;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0 && allZoms[6]["xspeed"] == 0 && allZoms[7]["xspeed"] == 0 && allZoms[8]["xspeed"] == 0 && allZoms[9]["xspeed"] == 0 && allZoms[10]["xspeed"] == 0 && allZoms[11]["xspeed"] == 0 && allZoms[12]["xspeed"] == 0 && allZoms[13]["xspeed"] == 0 && allZoms[14]["xspeed"] == 0 && allZoms[15]["xspeed"] == 0 && allZoms[16]["xspeed"] == 0 && allZoms[17]["xspeed"] == 0) {
                wave = wave + 1;
            }
        }
        if (wave == 23) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Army Of The Dead Souls Have Arose!");
            numofzomskilled = 0;
            wave = wave + 1;
        }
        if (wave == 24) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                zomInfo["xspeed"] = Math.random() * (-5);
                zomInfo["yspeed"] = Math.random() * (5);
                zomInfo["health"] = 1;
                zomInfo["playerknockback"] = 63;
                zomInfo["bulletknockback"] = 5;
                zomInfo["pts"] = 3;
                zomInfo["dmg"] = 2;
                zomInfo["healthwhenrespawn"] = 1;
                zomIndex = zomIndex + 1;
            }
            spriteSetAnimation(allZoms[0]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[1]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[3]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[4]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[5]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[6]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[7]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[8]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[9]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[10]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[11]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[12]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[13]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[14]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[15]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[16]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[17]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[18]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[19]["id"], allZoms[2]["fallenghostanim"]);
            wave = wave + 1;
        }
        if (wave == 25 && numofzomskilled > 200) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Army Of The Dead Souls Have Been Vanquished!");
            wave = wave + 1;
        }
        if (wave == 26) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = 0;
                    zomInfo["yspeed"] = 0;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0 && allZoms[6]["xspeed"] == 0 && allZoms[7]["xspeed"] == 0 && allZoms[8]["xspeed"] == 0 && allZoms[9]["xspeed"] == 0 && allZoms[10]["xspeed"] == 0 && allZoms[11]["xspeed"] == 0 && allZoms[12]["xspeed"] == 0 && allZoms[13]["xspeed"] == 0 && allZoms[14]["xspeed"] == 0 && allZoms[15]["xspeed"] == 0 && allZoms[16]["xspeed"] == 0 && allZoms[17]["xspeed"] == 0 && allZoms[18]["xspeed"] == 0 && allZoms[19]["xspeed"] == 0) {
                numofzomskilled = 0;
                wave = wave + 1;
            }
        }
        if (wave == 27) {
            allZoms[0]["xspeed"] = -10;
            allZoms[0]["yspeed"] = -15;
            allZoms[0]["health"] = 1;
            allZoms[0]["healthwhenrespawn"] = 1;
            allZoms[0]["pts"] = 5;
            allZoms[0]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[1]["xspeed"] = -10;
            allZoms[1]["yspeed"] = -15;
            allZoms[1]["health"] = 1;
            allZoms[1]["healthwhenrespawn"] = 1;
            allZoms[1]["pts"] = 4;
            allZoms[1]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[2]["xspeed"] = -10;
            allZoms[2]["yspeed"] = -15;
            allZoms[2]["health"] = 1;
            allZoms[2]["healthwhenrespawn"] = 1;
            allZoms[2]["pts"] = 7;
            allZoms[2]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[3]["xspeed"] = -10;
            allZoms[3]["yspeed"] = 15;
            allZoms[3]["health"] = 1;
            allZoms[3]["healthwhenrespawn"] = 1;
            allZoms[3]["pts"] = 5;
            allZoms[3]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[4]["xspeed"] = -10;
            allZoms[4]["yspeed"] = 15;
            allZoms[4]["health"] = 1;
            allZoms[4]["healthwhenrespawn"] = 1;
            allZoms[4]["pts"] = 6;
            allZoms[4]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[5]["xspeed"] = -10;
            allZoms[5]["yspeed"] = 15;
            allZoms[5]["health"] = 50;
            allZoms[5]["healthwhenrespawn"] = 1;
            allZoms[5]["pts"] = 4;
            allZoms[5]["xpos"] = PLAYGROUND_WIDTH;
            allZoms[6]["xspeed"] = Math.random() * (-3);
            allZoms[6]["yspeed"] = Math.random() * (7);
            allZoms[6]["health"] = 3;
            allZoms[6]["healthwhenrespawn"] = 3;
            allZoms[6]["pts"] = 11;
            allZoms[7]["xspeed"] = Math.random() * (-3);
            allZoms[7]["yspeed"] = Math.random() * (7);
            allZoms[7]["health"] = 3;
            allZoms[7]["healthwhenrespawn"] = 3;
            allZoms[7]["pts"] = 10;
            allZoms[8]["xspeed"] = Math.random() * (-3);
            allZoms[8]["yspeed"] = Math.random() * (7);
            allZoms[8]["health"] = 3;
            allZoms[8]["healthwhenrespawn"] = 3;
            allZoms[8]["pts"] = 8;
            allZoms[9]["xspeed"] = Math.random() * (-3);
            allZoms[9]["yspeed"] = Math.random() * (7);
            allZoms[9]["health"] = 3;
            allZoms[9]["healthwhenrespawn"] = 3;
            allZoms[9]["pts"] = 9;
            allZoms[10]["xspeed"] = Math.random() * (-3);
            allZoms[10]["yspeed"] = Math.random() * (7);
            allZoms[10]["health"] = 3;
            allZoms[10]["healthwhenrespawn"] = 3;
            allZoms[10]["pts"] = 12;
            allZoms[11]["xspeed"] = Math.random() * (-3);
            allZoms[11]["yspeed"] = Math.random() * (7);
            allZoms[11]["health"] = 3;
            allZoms[11]["healthwhenrespawn"] = 3;
            allZoms[11]["pts"] = 11;
            spriteSetAnimation(allZoms[0]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[1]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[3]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[4]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[5]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[6]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[7]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[8]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[9]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[10]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[11]["id"], allZoms[2]["mutatedanim"]);
            wave = wave + 1;
        }
        if (wave > 27 && wave < 29) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length - 14) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < PLAYGROUND_WIDTH / 2 && zomInfo["xpos"] > 0) {
                    zomInfo["xspeed"] = 0;
                }
                if (zomInfo["xpos"] < 0 && zomInfo["xpos"] < PLAYGROUND_WIDTH / 2) {
                    zomInfo["xspeed"] = -10;
                }
                zomIndex = zomIndex + 1;
            }
        }
        if (wave == 28 && numofzomskilled > 200) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = 0;
                    zomInfo["yspeed"] = 0;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0 && allZoms[6]["xspeed"] == 0 && allZoms[7]["xspeed"] == 0 && allZoms[8]["xspeed"] == 0 && allZoms[9]["xspeed"] == 0 && allZoms[10]["xspeed"] == 0 && allZoms[11]["xspeed"] == 0 && allZoms[12]["xspeed"] == 0) {
                wave = wave + 1;
                numofzomskilled = 0;
            }
        }
        if (wave == 29) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length - 8) {
                var zomInfo = allZoms[zomIndex];
                zomInfo["xspeed"] = Math.random() * (-5);
                zomInfo["yspeed"] = Math.random() * (15);
                zomInfo["pts"] = 6;
                zomInfo["dmg"] = 5;
                zomInfo["health"] = Math.random() * (7);
                zomInfo["healthwhenrespawn"] = zomInfo["health"];
                zomIndex = zomIndex + 1;
            }
            wave = wave + 1;
        }
        if (wave > 29 && wave < 33) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length - 8) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["ypos"] > player[0]["ypos"]) {
                    zomInfo["yspeed"] = -7;
                }
                if (zomInfo["ypos"] < player[0]["ypos"]) {
                    zomInfo["yspeed"] = 7;
                }
                zomIndex = zomIndex + 1;
            }
        }
        if (wave == 30 && numofzomskilled > 200) {
            wave = wave + 1;
        }
        if (wave == 31) {
            numofzomskilled = 0;
            allZoms[12]["health"] = 1;
            allZoms[12]["xspeed"] = -5;
            allZoms[12]["yspeed"] = 0;
            allZoms[12]["pts"] = 7;
            allZoms[12]["dmg"] = 7;
            allZoms[13]["health"] = 1;
            allZoms[13]["xspeed"] = -5;
            allZoms[13]["yspeed"] = 0;
            allZoms[13]["pts"] = 7;
            allZoms[13]["dmg"] = 7;
            allZoms[14]["health"] = 1;
            allZoms[14]["xspeed"] = -5;
            allZoms[14]["yspeed"] = 0;
            allZoms[14]["pts"] = 7;
            allZoms[14]["dmg"] = 7;
            allZoms[15]["health"] = 1;
            allZoms[15]["xspeed"] = -5;
            allZoms[15]["yspeed"] = 0;
            allZoms[15]["pts"] = 7;
            allZoms[15]["dmg"] = 7;
            allZoms[16]["health"] = 1;
            allZoms[16]["xspeed"] = -5;
            allZoms[16]["yspeed"] = 0;
            allZoms[16]["pts"] = 7;
            allZoms[16]["dmg"] = 7;
            spriteSetAnimation(allZoms[12]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[13]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[14]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[15]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[16]["id"], allZoms[2]["skeletonanim"]);
            wave = wave + 1;
        }
        if (wave == 32 && numofzomskilled > 300) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length - 3) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = 0;
                    zomInfo["yspeed"] = 0;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0 && allZoms[6]["xspeed"] == 0 && allZoms[7]["xspeed"] == 0 && allZoms[8]["xspeed"] == 0 && allZoms[9]["xspeed"] == 0 && allZoms[10]["xspeed"] == 0 && allZoms[11]["xspeed"] == 0 && allZoms[12]["xspeed"] == 0 && allZoms[13]["xspeed"] == 0 && allZoms[14]["xspeed"] == 0 && allZoms[15]["xspeed"] == 0 && allZoms[16]["xspeed"] == 0) {
                numofzomskilled = 0;
                wave = wave + 1;
            }
        }
        if (wave == 33) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Severus Army Is Approaching!");
            wave = wave + 1;
        }
        if (wave == 34) {
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            addzom();
            spriteSetAnimation(allZoms[0]["id"], allZoms[2]["anim"]);
            spriteSetAnimation(allZoms[1]["id"], allZoms[2]["anim"]);
            spriteSetAnimation(allZoms[2]["id"], allZoms[2]["anim"]);
            spriteSetAnimation(allZoms[3]["id"], allZoms[2]["anim"]);
            spriteSetAnimation(allZoms[4]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[5]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[6]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[7]["id"], allZoms[2]["redskullanim"]);
            spriteSetAnimation(allZoms[8]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[9]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[10]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[11]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[12]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[13]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[14]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[15]["id"], allZoms[2]["fallenghostanim"]);
            spriteSetAnimation(allZoms[16]["id"], allZoms[2]["camoanim"]);
            spriteSetAnimation(allZoms[17]["id"], allZoms[2]["camoanim"]);
            spriteSetAnimation(allZoms[18]["id"], allZoms[2]["camoanim"]);
            spriteSetAnimation(allZoms[19]["id"], allZoms[2]["camoanim"]);
            spriteSetAnimation(allZoms[20]["id"], allZoms[2]["goblinanim"]);
            spriteSetAnimation(allZoms[21]["id"], allZoms[2]["goblinanim"]);
            spriteSetAnimation(allZoms[22]["id"], allZoms[2]["goblinanim"]);
            spriteSetAnimation(allZoms[23]["id"], allZoms[2]["goblinanim"]);
            spriteSetAnimation(allZoms[24]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[25]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[26]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[27]["id"], allZoms[2]["skeletonanim"]);
            spriteSetAnimation(allZoms[28]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[29]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[30]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[31]["id"], allZoms[2]["mutatedanim"]);
            spriteSetAnimation(allZoms[32]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[33]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[34]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[35]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[36]["id"], allZoms[2]["anim"]);
            spriteSetAnimation(allZoms[37]["id"], allZoms[2]["fastzomanim"]);
            spriteSetAnimation(allZoms[38]["id"], allZoms[2]["ghostanim"]);
            spriteSetAnimation(allZoms[39]["id"], allZoms[2]["camoanim"]);
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                zomInfo["xspeed"] = Math.random() * (-3);
                zomInfo["yspeed"] = Math.random() * (3);
                zomInfo["health"] = 1;
                zomInfo["playerknockback"] = 63;
                zomInfo["bulletknockback"] = 5;
                zomInfo["pts"] = 4;
                zomInfo["dmg"] = 5;
                zomInfo["healthwhenrespawn"] = 1;
                zomIndex = zomIndex + 1;
            }
            wave = wave + 1;
        }
        if (wave == 35 && numofzomskilled > 599) {
            allTexts[3]["xpos"] = PLAYGROUND_WIDTH;
            allTexts[3]["ypos"] = 64;
            sprite(allTexts[3]["id"]).text("Severus Army Has Been Obliterated! ");
            wave = wave + 1;
        }
        if (wave == 36) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                if (zomInfo["xpos"] < -43) {
                    zomInfo["xspeed"] = 0;
                    zomInfo["yspeed"] = 0;
                }
                zomIndex = zomIndex + 1;
            }
            if (allZoms[0]["xspeed"] == 0 && allZoms[1]["xspeed"] == 0 && allZoms[2]["xspeed"] == 0 && allZoms[3]["xspeed"] == 0 && allZoms[4]["xspeed"] == 0 && allZoms[5]["xspeed"] == 0 && allZoms[6]["xspeed"] == 0 && allZoms[7]["xspeed"] == 0 && allZoms[8]["xspeed"] == 0 && allZoms[9]["xspeed"] == 0 && allZoms[10]["xspeed"] == 0 && allZoms[11]["xspeed"] == 0 && allZoms[12]["xspeed"] == 0 && allZoms[13]["xspeed"] == 0 && allZoms[14]["xspeed"] == 0 && allZoms[15]["xspeed"] == 0 && allZoms[16]["xspeed"] == 0 && allZoms[17]["xspeed"] == 0 && allZoms[18]["xspeed"] == 0 && allZoms[19]["xspeed"] == 0) {
                wave = wave + 1;
                numofzomskilled = 0;
            }
        }
        if (wave == 37) {
            allZoms[0]["health"] = Math.random() * (3);
            allZoms[0]["xspeed"] = -1;
            allZoms[0]["yspeed"] = Math.random() * (2);
            allZoms[0]["pts"] = 4;
            allZoms[0]["dmg"] = 7;
            allZoms[1]["health"] = Math.random() * (3);
            allZoms[1]["xspeed"] = -1;
            allZoms[1]["yspeed"] = Math.random() * (2);
            allZoms[1]["pts"] = 4;
            allZoms[1]["dmg"] = 7;
            allZoms[2]["health"] = Math.random() * (3);
            allZoms[2]["xspeed"] = -1;
            allZoms[2]["yspeed"] = Math.random() * (2);
            allZoms[2]["pts"] = 4;
            allZoms[2]["dmg"] = 7;
            allZoms[3]["health"] = Math.random() * (3);
            allZoms[3]["xspeed"] = -1;
            allZoms[3]["yspeed"] = Math.random() * (2);
            allZoms[3]["pts"] = 4;
            allZoms[3]["dmg"] = 7;
            allZoms[4]["health"] = Math.random() * (3);
            allZoms[4]["xspeed"] = -1;
            allZoms[4]["yspeed"] = Math.random() * (2);
            allZoms[4]["pts"] = 4;
            allZoms[4]["dmg"] = 7;
            wave = "infinite";
        }
        if (wave == "infinite" && numofzomskilled > 50) {
            newzom = newzom + 1;
            allZoms[newzom]["health"] = Math.random() * (3);
            allZoms[newzom]["xspeed"] = -1;
            allZoms[newzom]["yspeed"] = Math.random() * (2);
            allZoms[newzom]["pts"] = 4;
            allZoms[newzom]["dmg"] = 7;
            numofzomskilled = 0;
            if (newzom == 39) {
                wave = "infinite2";
                newzom = 1;
            }
        }
        if (wave == "infinite2" && numofzomskilled > 100) {
            var zomIndex = 0;
            wavecounter = wavecounter + 1;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                zomInfo["health"] = zomInfo["health"] + newzom;
                zomIndex = zomIndex + 1;
            }
            numofzomskilled = 0;
            if (wavecounter == 3) {
                wave = "infinite3";
                newzom = -1;
            }
        }
        if (wave == "infinite3" && numofzomskilled > 200) {
            var zomIndex = 0;
            while (zomIndex < allZoms.length) {
                var zomInfo = allZoms[zomIndex];
                zomInfo["xspeed"] = zomInfo["xspeed"] + newzom;
                zomIndex = zomIndex + 1;
            }
            numofzomskilled = 0;
        }
    }
};
var moveplayerwithkeyboard = function (spriteInfo) {
    spriteInfo["ypos"] = spriteInfo["ypos"] + spriteInfo["yspeed"];
    if (spriteInfo["ypos"] > PLAYGROUND_HEIGHT - spriteInfo["height"]) {
        spriteInfo["ypos"] = PLAYGROUND_HEIGHT - spriteInfo["height"];
    }
    if (getKeyState(83)) {
        spriteInfo["yspeed"] = spriteInfo["yspeed"] + 0.8;
    } else {
        spriteInfo["yspeed"] = spriteInfo["yspeed"] * decayrate;
    }
    if (spriteInfo["ypos"] < 0) {
        spriteInfo["ypos"] = 0;
    }
    if (getKeyState(87)) {
        spriteInfo["yspeed"] = spriteInfo["yspeed"] - 0.8;
    } else {
        spriteInfo["yspeed"] = spriteInfo["yspeed"] * decayrate;
    }
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);
    spriteInfo["xpos"] = spriteInfo["xpos"] + spriteInfo["xspeed"];
    if (spriteInfo["xpos"] > PLAYGROUND_WIDTH - spriteInfo["width"]) {
        spriteInfo["xpos"] = PLAYGROUND_WIDTH - spriteInfo["width"];
    }
    if (getKeyState(68)) {
        spriteInfo["xspeed"] = spriteInfo["xspeed"] + 0.8;
    } else {
        spriteInfo["xspeed"] = spriteInfo["xspeed"] * decayrate;
    }
    if (spriteInfo["xpos"] < 0) {
        spriteInfo["xpos"] = 0;
    }
    if (getKeyState(65)) {
        spriteInfo["xspeed"] = spriteInfo["xspeed"] - 0.8;
    } else {
        spriteInfo["xspeed"] = spriteInfo["xspeed"] * decayrate;
    }
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
    if (!getKeyState(87) && !getKeyState(83) && !getKeyState(68) && !getKeyState(65)) {
        spriteInfo["currentanim"] = "stillanim";
        spriteSetAnimation(spriteInfo["id"], spriteInfo["stillanim"]);
    } else {
        if (spriteInfo["currentanim"] != "movinganim") {
            spriteSetAnimation(spriteInfo["id"], spriteInfo["movinganim"]);
            spriteInfo["currentanim"] = "movinganim";
        }
    }
};
var movesprite = function (spriteInfo) {
    spriteSetWidth(allZoms[0]["id"], allZoms[0]["width"]);
    spriteSetHeight(allZoms[0]["id"], allZoms[0]["height"]);
    spriteInfo["xpos"] = spriteInfo["xpos"] + spriteInfo["xspeed"];
    if (spriteInfo["xpos"] > PLAYGROUND_WIDTH) {
        spriteInfo["xpos"] = PLAYGROUND_WIDTH;
    }
    if (spriteInfo["xpos"] < -43 && spriteInfo["xpos"] > -400) {
        spriteInfo["xpos"] = -400;
        if (spriteInfo["xpos"] == -400) {
            farmhp = farmhp - spriteInfo["dmg"];
            spriteInfo["xpos"] = -500;
        }
    }
    spriteSetX(spriteInfo["id"], spriteInfo["xpos"]);
    spriteInfo["ypos"] = spriteInfo["ypos"] + spriteInfo["yspeed"];
    if (spriteInfo["ypos"] > PLAYGROUND_HEIGHT - spriteInfo["height"]) {
        spriteInfo["yspeed"] = -1 * spriteInfo["yspeed"];
    }
    if (spriteInfo["ypos"] < 0) {
        spriteInfo["yspeed"] = -1 * spriteInfo["yspeed"];
    }
    spriteSetY(spriteInfo["id"], spriteInfo["ypos"]);
};
var timer = function () {
    if (wait == 0) {
        canshootbulletnow = "true";
        wait = 6;
    } else {
        wait = wait - 1;
    }
};
var shoot = function (spriteInfo) {
    spriteInfo["xpos"] = spriteInfo["xpos"] + spriteInfo["xspeed"];
    spriteSetXY(spriteInfo["id"], spriteInfo["xpos"], spriteInfo["ypos"]);
    if (spriteInfo["xpos"] > PLAYGROUND_WIDTH + 48) {
        spriteInfo["xpos"] = 63;
        spriteInfo["ypos"] = spriteGetY("player0") + 27;
    }
};
var bullethitzomtrue = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);
    var hitSpriteIndex = hitSpriteName.substring(3);
    var hitSpriteInfo = allZoms[hitSpriteIndex];
    hitSpriteInfo["angle"] = hitSpriteInfo["angle"] + 90;
    hitSpriteInfo["xpos"] = hitSpriteInfo["xpos"] + hitSpriteInfo["bulletknockback"];
    hitSpriteInfo["health"] = hitSpriteInfo["health"] - hitSpriteInfo["bulletdmg"];
    spriteRotate(hitSpriteInfo["id"], hitSpriteInfo["angle"]);
    if (hitSpriteInfo["health"] < 1) {
        numofzomskilled = numofzomskilled + 1;
        blip.cloneNode(true).play();
        hitSpriteInfo["xpos"] = -500;
        hitSpriteInfo["health"] = hitSpriteInfo["healthwhenrespawn"];
        pts = pts + hitSpriteInfo["pts"];
    }
};
var whathappenswhenzomhitsplayer = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);
    var hitSpriteIndex = hitSpriteName.substring(3);
    var hitSpriteInfo = allZoms[hitSpriteIndex];
    var playerInfo = player[0];
    hitSpriteInfo["angle"] = hitSpriteInfo["angle"] + 90;
    hitSpriteInfo["xpos"] = hitSpriteInfo["xpos"] + hitSpriteInfo["playerknockback"];
    hitSpriteInfo["health"] = hitSpriteInfo["health"] - hitSpriteInfo["playerdmg"];
    spriteRotate(hitSpriteInfo["id"], hitSpriteInfo["angle"]);
    playerInfo["xspeed"] = -10;
    bash.cloneNode(true).play();
    if (hitSpriteInfo["health"] < 1) {
        numofzomskilled = numofzomskilled + 1;
        blip.cloneNode(true).play();
        hitSpriteInfo["xpos"] = -500;
        hitSpriteInfo["health"] = hitSpriteInfo["healthwhenrespawn"];
        pts = pts + hitSpriteInfo["pts"];
    }
};
var whathappenswhenzomhitsturret = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);
    var hitSpriteIndex = hitSpriteName.substring(3);
    var hitSpriteInfo = allZoms[hitSpriteIndex];
    var turretInfo = turret[0];
    hitSpriteInfo["health"] = 0;
    turretInfo["health"] = turretInfo["health"] - hitSpriteInfo["dmg"];
    if (hitSpriteInfo["health"] < 1) {
        numofzomskilled = numofzomskilled + 1;
        blip.cloneNode(true).play();
        hitSpriteInfo["xpos"] = -500;
        hitSpriteInfo["health"] = hitSpriteInfo["healthwhenrespawn"];
        pts = pts + hitSpriteInfo["pts"];
    }
    if (turretInfo["health"] < 1) {
        gameover = "true";
    }
};
var removebulletwhenhitenemy = function (collIndex, hitSprite) {
    var hitSpriteName = spriteId(hitSprite);
    var hitSpriteIndex = hitSpriteName.substring(6);
    var hitSpriteInfo = allBullets[hitSpriteIndex];
    laserhit.cloneNode(true).play();
    hitSpriteInfo["ypos"] = PLAYGROUND_HEIGHT + 40;
};
var bosswarning = function () {
    allTexts[3]["xpos"] = allTexts[3]["xpos"] - 5;
    spriteSetXY(allTexts[3]["id"], allTexts[3]["xpos"], allTexts[3]["ypos"]);
};
var healthbarfollowplayer0 = function () {
    var spriteInfo = player[0];
    var turretInfo = turret[0];
    allTexts[0]["xpos"] = 510;
    allTexts[0]["ypos"] = 0;
    allTexts[1]["xpos"] = 360;
    allTexts[1]["ypos"] = 0;
    allTexts[2]["xpos"] = 230;
    allTexts[2]["ypos"] = 0;
    turretInfo["ypos"] = spriteInfo["ypos"] - 6;
    sprite(allTexts[0]["id"]).css("color", "rgb(0, 0, 0)");
    sprite(allTexts[0]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
    sprite(allTexts[0]["id"]).css("font-weight", "bold");
    sprite(allTexts[0]["id"]).css("font-size", "20pt");
    sprite(allTexts[0]["id"]).text("THP:" + turretInfo["health"] + "%");
    sprite(allTexts[1]["id"]).css("color", "rgb(0, 0, 0)");
    sprite(allTexts[1]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
    sprite(allTexts[1]["id"]).css("font-weight", "bold");
    sprite(allTexts[1]["id"]).css("font-size", "20pt");
    sprite(allTexts[1]["id"]).text("FHP:" + farmhp + "%");
    sprite(allTexts[2]["id"]).css("color", "rgb(0, 0, 0)");
    sprite(allTexts[2]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
    sprite(allTexts[2]["id"]).css("font-weight", "bold");
    sprite(allTexts[2]["id"]).css("font-size", "20pt");
    sprite(allTexts[2]["id"]).text("PTS:" + pts);
    sprite(allTexts[3]["id"]).css("color", "rgb(150, 255, 255)");
    sprite(allTexts[3]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
    sprite(allTexts[3]["id"]).css("font-weight", "bold");
    sprite(allTexts[3]["id"]).css("font-size", "20pt");
    spriteSetXY(turretInfo["id"], turretInfo["xpos"], turretInfo["ypos"]);
    spriteSetXY(allTexts[0]["id"], allTexts[0]["xpos"], allTexts[0]["ypos"]);
    spriteSetXY(allTexts[1]["id"], allTexts[1]["xpos"], allTexts[1]["ypos"]);
    spriteSetXY(allTexts[2]["id"], allTexts[2]["xpos"], allTexts[2]["ypos"]);
};
var ifgameoveristrue = function () {
    if (gameover == "true") {
        var zomIndex = 0;
        while (zomIndex < allZoms.length) {
            var zomInfo = allZoms[zomIndex];
            spriteSetXY(zomInfo["id"], 1000, 1000);
            zomIndex = zomIndex + 1;
        }
        var bulletIndex = 0;
        while (bulletIndex < allBullets.length) {
            var bulletInfo = allBullets[bulletIndex];
            spriteSetXY(bulletInfo["id"], 1000, 1000);
            bulletIndex = bulletIndex + 1;
        }
        spriteSetXY(player[0]["id"], 1000, 1000);
        spriteSetXY(turret[0]["id"], 1000, 1000);
        spriteSetXY(allTexts[0]["id"], 43, PLAYGROUND_HEIGHT / 4 + 64);
        spriteSetXY(allTexts[2]["id"], 43, PLAYGROUND_HEIGHT / 4);
        spriteSetXY(allTexts[1]["id"], 43, PLAYGROUND_HEIGHT / 4 + 64 + 64 + 64);
        spriteSetXY(allTexts[3]["id"], 43, PLAYGROUND_HEIGHT / 4 + 64 + 64);
        sprite(allTexts[2]["id"]).css("color", "rgb(0, 0, 0)");
        sprite(allTexts[2]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
        sprite(allTexts[2]["id"]).css("font-weight", "bold");
        sprite(allTexts[2]["id"]).css("font-size", "30pt");
        sprite(allTexts[2]["id"]).text("Your Score: " + pts + " Points");
        if (pts > 9499) {
            spriteSetAnimation(background[0]["id"], background[0]["youwonscreen"]);
            sprite(allTexts[0]["id"]).css("color", "rgb(0, 0, 0)");
            sprite(allTexts[0]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
            sprite(allTexts[0]["id"]).css("font-weight", "bold");
            sprite(allTexts[0]["id"]).css("font-size", "30pt");
            sprite(allTexts[0]["id"]).text("Congrats! With Your Great");
            sprite(allTexts[1]["id"]).css("color", "rgb(0, 0, 0)");
            sprite(allTexts[1]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
            sprite(allTexts[1]["id"]).css("font-weight", "bold");
            sprite(allTexts[1]["id"]).css("font-size", "30pt");
            sprite(allTexts[1]["id"]).text("Refresh The Page To Play Again!");
            sprite(allTexts[3]["id"]).css("color", "rgb(0, 0, 0)");
            sprite(allTexts[3]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
            sprite(allTexts[3]["id"]).css("font-weight", "bold");
            sprite(allTexts[3]["id"]).css("font-size", "30pt");
            sprite(allTexts[3]["id"]).text(" Effort You Won The Game!");
        } else {
            spriteSetAnimation(background[0]["id"], background[0]["gameoverscreen"]);
            sprite(allTexts[0]["id"]).css("color", "rgb(0, 0, 0)");
            sprite(allTexts[0]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
            sprite(allTexts[0]["id"]).css("font-weight", "bold");
            sprite(allTexts[0]["id"]).css("font-size", "30pt");
            sprite(allTexts[0]["id"]).text("Oh No! You Lost The Game! Get");
            sprite(allTexts[1]["id"]).css("color", "rgb(0, 0, 0)");
            sprite(allTexts[1]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
            sprite(allTexts[1]["id"]).css("font-weight", "bold");
            sprite(allTexts[1]["id"]).css("font-size", "30pt");
            sprite(allTexts[1]["id"]).text("Refresh The Page To Try Again!");
            sprite(allTexts[3]["id"]).css("color", "rgb(0, 0, 0)");
            sprite(allTexts[3]["id"]).css("background-color", "rgba(0, 0, 0, 0)");
            sprite(allTexts[3]["id"]).css("font-weight", "bold");
            sprite(allTexts[3]["id"]).css("font-size", "30pt");
            sprite(allTexts[3]["id"]).text("9500 Points Or More To Win!");
        }
    }
};
var draw = function () {
    ifgameoveristrue();
    if (farmhp < 1) {
        gameover = "true";
    }
    if (gameover == "false") {
        var zomIndex = 0;
        var bulletIndex = 0;
        var playerIndex = 0;
        var backgroundIndex = 0;
        var turretIndex = 0;
        if (canshootbulletnow == "true" && allBullets.length < 6) {
            addbullet();
            canshootbulletnow = "false";
        }
        while (bulletIndex < allBullets.length) {
            var spriteInfo = allBullets[bulletIndex];
            shoot(allBullets[bulletIndex]);
            forEachSpriteGroupCollisionDo(spriteInfo["id"], zomGroupName, bullethitzomtrue);
            bulletIndex = bulletIndex + 1;
        }
        while (zomIndex < allZoms.length) {
            var zomInfo = allZoms[zomIndex];
            forEachSpriteGroupCollisionDo(zomInfo["id"], bulletGroupName, removebulletwhenhitenemy);
            movesprite(allZoms[zomIndex]);
            if (zomInfo["xpos"] < zomInfo["respawntime"]) {
                zomInfo["ypos"] = Math.random() * (PLAYGROUND_HEIGHT - 43)
                spriteRotate(zomInfo["id"], 0);
                zomInfo["xpos"] = PLAYGROUND_WIDTH;
            }
            zomIndex = zomIndex + 1;
        }
        while (playerIndex < player.length) {
            moveplayerwithkeyboard(player[playerIndex]);
            forEachSpriteGroupCollisionDo(player0["id"], zomGroupName, whathappenswhenzomhitsplayer);
            playerIndex = playerIndex + 1;
        }
        while (turretIndex < turret.length) {
            forEachSpriteGroupCollisionDo(turret0["id"], zomGroupName, whathappenswhenzomhitsturret);
            turretIndex = turretIndex + 1;
        }
        while (backgroundIndex < background.length) {
            backgroundIndex = backgroundIndex + 1;
        }
        timer();
        healthbarfollowplayer0();
        startgame(background[0]);
        wavecontroller();
        bosswarning();
    }
};