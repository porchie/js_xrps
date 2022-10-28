import {Player} from "./player.js";

const ROCK = 0; const PAPER = 1; const SCISSOR = 2;
const RPSTABLE = [2,1,0,0,2,1,1,0,2];
const RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
const messageDiv = document.getElementById("outdiv");
const graphicsDiv = document.getElementById("graphical");
let playerUsr = new Player(5,5,5);
let playerCpu = new Player(0,1,0);
const playerMovesLog = [];
const resultLog = [];
const playerBtnArr = [document.getElementById("ply-r"),document.getElementById("ply-p"),document.getElementById("ply-s")];
const cpuDisplayArr = [document.getElementById("cpu-r"),document.getElementById("cpu-p"),document.getElementById("cpu-s")];
const resetBtn = document.getElementById("rst");
const log = document.getElementById("log");

/*     u s r
       r p s

c  r   t w l
p  p   l t w
u  s   w l t

(cpu*3)+usr
2-tie
1-win
0-lose
*/
function initialize()
{
    playerBtnArr[ROCK].onclick = function(){playRound(ROCK)};
    playerBtnArr[PAPER].onclick = function(){playRound(PAPER)};
    playerBtnArr[SCISSOR].onclick = function(){playRound(SCISSOR)};
    resetBtn.onclick = function(){reset()};
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
    playerBtnArr.forEach(e => e.disabled = false)
    playerUsr.setR(5);
    playerUsr.setP(5);
    playerUsr.setS(5);
    playerCpu.setR(0);
    playerCpu.setP(1);
    playerCpu.setS(0);
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
    while(playerMovesLog.length >= 3)
    {
        playerMovesLog.shift()
    }
    playerMovesLog.push(usrIn)

    //cpuBuild();
    var cpu = cpuChoice(); //CPU

    var result = RPSTABLE[(cpu * 3) + usrIn];//cpu vs usr result
    console.log(RPSSTRING[usrIn] + " " + RPSSTRING[cpu]);    

    //keeping track of last 3 results
    resultLog.push(result);
    while(resultLog.length >= 3)
    {
        resultLog.shift();
    }
    if(resultLog[0] == 2 && (resultLog[0] == resultLog[1] && resultLog[0] == resultLog[2])) //3 
    {
        playerUsr.rm(pickRndFrArr(playerUsr.arrOfArsenal));
        playerCpu.rm(pickRndFrArr(playerCpu.arrOfArsenal));
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
    
    //BUTTON UPDATING
    playerBtnArr[usrIn].innerHTML =  playerUsr.rpsArr[usrIn];
    playerBtnArr[cpu].innerHTML =  playerUsr.rpsArr[cpu];
    cpuDisplayArr[usrIn].innerHTML = playerCpu.rpsArr[usrIn];
    cpuDisplayArr[cpu].innerHTML = playerCpu.rpsArr[cpu];
    

    console.log(playerCpu.oneLeft());
    if(playerUsr.oneLeft() || playerCpu.oneLeft()) // GAME ENDS
    {
        playerBtnArr.forEach(e => e.disabled = true);
        messageDiv.firstChild.nodeValue = "Result: " + playerCpu.isAllOut() ? "You WIN!!!!" : "ggez";
    }
    else //LOG
    {
        messageDiv.firstChild.nodeValue = "Result: " + message;
        log.appendChild(document.createTextNode(message + "\n"));
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
    
}

function buildWeapon(playerArg, weaponToBuild) //playerArg = 0 is usr
{                                              //otherwise always cpu
    player = (playerArg==0) ? playerUsr:playerCpu;
    if(playerBuildWeapon(player,weaponToBuild))
    {
        //build successful display appropriate msg and display change
    }
    else
    {
        //build unsuccessful, say so kk
    }
}

function playerBuildWeapon(player, weaponToBuild)
{
    if (weaponToBuild == ROCK)
    {
        if(player.isOut(0)) return false;
        if(player.isOut(1) || player.isOut(2)) return false;
    }
    else if (weaponToBuild == PAPER)
    {
        if(player.isOut(1)) return false;
        if(player.isOut(0) || player.isOut(2)) return false;
    }
    else if (weaponToBuild == SCISSOR)
    {
        if(player.isOut(2)) return false;
        if(player.isOut(0) || player.isOut(1)) return false;
    }
}


window.addEventListener('load', initialize);

