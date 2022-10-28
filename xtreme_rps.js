import {Player} from "./player.js";

const ROCK = 0; const PAPER = 1; const SCISSOR = 2;
const RPSTABLE = [2,1,0,0,2,1,1,0,2];
const RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
const messageDiv = document.getElementById("outdiv");
const graphicsDiv = document.getElementById("graphical");
let playerUsr = new Player(5,5,5);
let playerCpu = new Player(5,5,5);
let playerMovesLog = [];
let resultLog = [];
const playerBtnArr = [document.getElementById("ply-r"),document.getElementById("ply-p"),document.getElementById("ply-s")];
const cpuDisplayArr = [document.getElementById("cpu-r"),document.getElementById("cpu-p"),document.getElementById("cpu-s")];
const buildBtnArr = [document.getElementById("bld-r"),document.getElementById("bld-r"),document.getElementById("bld-r")];
const resetBtn = document.getElementById("rst");
const log = document.getElementById("log");

/*     u s r
       r p s

c  r   t w l
p  p   l t w
u  s   w l t,

(cpu*3)+usr
2-tie
1-win
0-lose
*/
function initialize()
{
    playerBtnArr[ROCK].onclick = () => playRound(ROCK);
    playerBtnArr[PAPER].onclick = () => playRound(PAPER);
    playerBtnArr[SCISSOR].onclick = () => playRound(SCISSOR);
    resetBtn.onclick = function(){reset()};
    buildBtnArr[ROCK].onclick = () => UsrbuildWeapon(ROCK)
    buildBtnArr[PAPER].onclick = () => UsrbuildWeapon(PAPER)
    buildBtnArr[SCISSOR].onclick = () => UsrbuildWeapon(SCISSOR)

    while(messageDiv.firstChild) messageDiv.removeChild(messageDiv.firstChild);
    messageDiv.appendChild(document.createTextNode("Result: "));
    while(log.firstChild)log.removeChild(log.firstChild);
    log.appendChild(document.createTextNode("Log:\n"));
    for(let i = 0;i<3;i++)
    {
        let p = playerBtnArr[i];
        let c = cpuDisplayArr[i];
        p.innerHTML = playerUsr.rpsArr[i]; // change
        c.innerHTML = playerCpu.rpsArr[i];
    }


}

function setupPlayers(numWeaps)
{
    playerUsr.setR(numWeaps);
    playerUsr.setP(numWeaps);
    playerUsr.setS(numWeaps);
    playerCpu.setR(numWeaps);
    playerCpu.setP(numWeaps);
    playerCpu.setS(numWeaps);
}

function reset()
{
    playerMovesLog = [];
    resultLog = [];
    playerBtnArr.forEach(e => e.disabled = false)
    setupPlayers(5);
    initialize();
}

function playRound(usrIn)
{
    if(playerUsr.isOut(usrIn)) //out of weapon
    {
        messageDiv.firstChild.nodeValue = "Out of " + RPSSTRING[usrIn];
        return; 
    }
    
    //keeping track of last 3 moves
    playerMovesLog.push(usrIn)
    while(playerMovesLog.length > 3)
    {
        playerMovesLog.shift()
    }
    
    //cpuBuild();
    let cpu = cpuChoice(); //CPU
    let result = RPSTABLE[(cpu * 3) + usrIn];//cpu vs usr result
    console.log(RPSSTRING[usrIn] + " " + RPSSTRING[cpu]);    
    
    //keeping track of last 3 results
    resultLog.push(result);
    while(resultLog.length > 3)
    {
        resultLog.shift();
    }
    //tie clause
    if(resultLog[0] == 2 && (resultLog[0] == resultLog[1] && resultLog[0] == resultLog[2])) //3 
    {
        playerUsr.rm(pickRndFrArr(playerUsr.arrOfArsenal()));
        playerCpu.rm(pickRndFrArr(playerCpu.arrOfArsenal()));
        btnUpdate();
        let message = "Both players have lost a weapon due to 3 ties in a row";
        messageDiv.firstChild.nodeValue = message;
        log.appendChild(document.createTextNode(message + "\n"));
        resultLog = [];
        return;
    }

    let message = "";
    if(result == 0) //L
    {
        playerUsr.rm(usrIn);
        playerCpu.add(usrIn);
        message = RPSSTRING[cpu] + " beats " + RPSSTRING[usrIn] + "--> CPU Wins";
    }
    else if(result == 1) //W
    {
        playerCpu.rm(cpu);
        playerUsr.add(cpu);
        message = RPSSTRING[usrIn] + " beats " + RPSSTRING[cpu] + "--> usr Wins";
    }
    else if(result == 2) //T
    {
        message = "Both players chose " + RPSSTRING[usrIn];
    }
    btnUpdate();
    if(playerUsr.oneLeft() || playerCpu.oneLeft()) // GAME ENDS
    {
        playerBtnArr.forEach(e => e.disabled = true);
        messageDiv.firstChild.nodeValue = "Result: " + playerCpu.isAllOut() ? "You WIN!!!!" : "ggez";
    }
    else //LOG
    {
        messageAndLog(message);
    }

}

function messageAndLog(message)
{
    messageDiv.firstChild.nodeValue = "Result: " + message;
     log.appendChild(document.createTextNode(message + "\n"));
}

function btnUpdate()
{
    for(let i = 0;i<3;i++)
    {
        playerBtnArr[i].innerHTML = playerUsr.rpsArr[i];
        cpuDisplayArr[i].innerHTML = playerCpu.rpsArr[i];
    }
}

function cpuChoice()
{
    let choice = pickRndFrArr(playerCpu.arrOfArsenal()) 
    //intelligence
    return choice;
}

function pickRndFrArr(arr) //picks a random idx from an array
{
    if (arr.length == 0) return -1;
    let idx = rndNum(0,arr.length-1);
    return arr[idx];
}

function rndNum(min,max)
{
    let mult = max-(min-1);
	let rnd = parseInt(Math.random()*mult) + min;		
	return rnd;
}

function cpuBuild()
{
    let idx = -1;
    for (let i = 0;i<3;i++)
    {
        if(playerCpu.isOut(i))
        {
            idx = i;
        }
    }
    if (idx == -1)
    {
        return;
    }
    else
    {
        buildWeapon(playerCpu, idx);
    }
}

function UsrbuildWeapon(weaponToBuild)
{ //wrapper for buildWeapon so log can respond to result of build weapon
    
    if(buildWeapon(playerUsr,weaponToBuild))
    {
        //build successful display appropriate msg and display change
    }
    else
    {
        messageAndLog("Failed to build Weapon")
    }
}

function buildWeapon(player, weaponToBuild) //builds weapon retruns true if succ false otherwise
{
    if (weaponToBuild == ROCK)
    {
        if(player.isOut(ROCK)) return false;
        if(player.isOut(PAPER) || player.isOut(SCISSOR)) return false;
        player.rm(PAPER);
        player.rm(SCISSOR);
        player.add(ROCK);
    }
    else if (weaponToBuild == PAPER)
    {
        if(player.isOut(PAPER)) return false;
        if(player.isOut(ROCK) || player.isOut(SCISSOR)) return false;
        player.rm(ROCK);
        player.rm(SCISSOR);
        player.add(PAPER);
    }
    else if (weaponToBuild == SCISSOR)
    {
        if(player.isOut(SCISSOR)) return false;
        if(player.isOut(ROCK) || player.isOut(PAPER)) return false;
        player.rm(ROCK);
        player.rm(PAPER);
        player.add(SCISSOR);
    }
}


window.addEventListener('load', initialize);

/*
///// TODO /////
-this is bad solution and code but whatever
-AI          | X
-BUilders    | X
-TIE CLAWS   | O
-BIGER GAEMS | X
-Loss claWs  | X
-log fit     | X
-log scroll  | X
*/