import {Player} from "./player.js";

const ROCK = 0; const PAPER = 1; const SCISSOR = 2;
const RPSTABLE = [2,1,0,0,2,1,1,0,2];
const RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
const messageDiv = document.getElementById("outdiv");
const setupIn = document.getElementById("setup-in");
let playerUsr = new Player(5,5,5);
let playerCpu = new Player(5,5,5);
let playerMovesLog = [];
let cpuMovesLog = [];
let resultLog = [];
const playerBtnArr = [document.getElementById("ply-r"),document.getElementById("ply-p"),document.getElementById("ply-s")];
const cpuDisplayArr = [document.getElementById("cpu-r"),document.getElementById("cpu-p"),document.getElementById("cpu-s")];
const buildBtnArr = [document.getElementById("bld-r"),document.getElementById("bld-p"),document.getElementById("bld-s")];
const resetBtn = document.getElementById("rst");
const setupBtn = document.getElementById("btn-setup");
const log = document.getElementById("log");
let numWeaps = 5;

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
    resetBtn.onclick = () => reset();
    setupBtn.onclick = () => setup();
    buildBtnArr[ROCK].onclick = () => UsrBuild(ROCK)
    buildBtnArr[PAPER].onclick = () => UsrBuild(PAPER)
    buildBtnArr[SCISSOR].onclick = () => UsrBuild(SCISSOR)

    while(messageDiv.firstChild) messageDiv.removeChild(messageDiv.firstChild);
    messageDiv.appendChild(document.createTextNode("Result: "));
    while(log.firstChild)log.removeChild(log.firstChild);
    log.appendChild(document.createTextNode("Log:\n"));
    btnUpdate();


}

function setup()
{
    numWeaps = parseInt(setupIn.setWeap.value);
    setupIn.setWeap.value = "";
    console.log(numWeaps);
    reset();
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
    cpuMovesLog = [];
    resultLog = [];
    enableButtons();
    enableBuilders();
    setupPlayers(numWeaps);
    initialize();
}

function playRound(usrIn)
{
    enableBuilders();
    if(playerUsr.isOut(usrIn)) //out of weapon
    {
        messageDiv.firstChild.nodeValue = "Out of " + RPSSTRING[usrIn];
        return; 
    }

    //should never run, but just in case
    if(playerUsr.isBreak(usrIn))
    {
        messageDiv.firstChild.nodeValue = RPSSTRING[usrIn] = " is broken";
        return;
    }
    
    //keeping track of last 3 moves
    playerMovesLog.push(usrIn);
    while(playerMovesLog.length > 3)
    {
        playerMovesLog.shift();
    }
    //break clause
    if(playerMovesLog[0] == playerMovesLog[1] && playerMovesLog[0] == playerMovesLog[2])
    {
        playerUsr.break(playerMovesLog[0]);
        messageAndLog("Player's " + RPSSTRING[playerMovesLog[0]] + " has broken!");
        playerBtnArr[playerMovesLog[0]].disabled = true;        
        playerMovesLog = [];
    }
    
    //cpuBuild();
    let cpu = cpuChoice(); //CPU
    //last 3 cpu moves
    cpuMovesLog.push(usrIn);
    while(cpuMovesLog.length > 3)
    {
        cpuMovesLog.shift();
    }
    let result = RPSTABLE[(cpu * 3) + usrIn];//cpu vs usr result
  
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
        disableButtons();
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
    let idx = -1;
    if(playerCpu.isOut(ROCK)) idx = ROCK;
    else if(playerCpu.isOut(PAPER)) idx = PAPER;
    else if(playerCpu.isOut(SCISSOR)) idx = SCISSOR
    cpuBuild(idx);
    let choice = pickRndFrArr(playerCpu.arrOfArsenal()) //random move
    choice = bestMoveBasedOnLast3Moves(choice); // intelligence move
    return choice;
}

function bestMoveBasedOnLast3Moves(initial)
{
    let bestMove = initial;
    if (playerMovesLog.length == 3) 
    {
        let rnd = rndNum(1,50);
        //player 3 in a row
        if(playerMovesLog[0] == playerMovesLog[1])
        { //last 2 moves are same because of 3 move clause, cpu assumes u dont play it again
            bestMove = weakAgainst(playerMovesLog[1]); 
        }
        //if you play 2 rock, you cannot play rock, you have to play scissor/paper,safe to play scissor for cpu
        
        //random chance it wont do this
        else if(rnd >= 35)
        {
            let playerLeast = playerUsr.leastWeapon();
            bestMove = weaknessOf(playerLeast); 
        }

        //checker 
        if(cpuMovesLog[1] == cpuMovesLog[2] && bestMove == cpuMovesLog[2]) //3 in a row not allowed
        {    
            bestMove = initial;
        }
        if(playerCpu.isOut(bestMove)) 
        {
            bestMove = initial;
        }
    }
    return bestMove;
}

function weaknessOf(idx)//(ROCK+1)%3 = PAPER  ROCK IS WEAK TO PAPER
{
    return (idx+1)%3;
}

function weakAgainst(idx)//(ROCK+2)%3 = SCISSOR, (PAPER+2)%3 = ROCK, (SCISSOR+2)%3 = PAPER
{
    return (idx+2)%3;
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

function cpuBuild(idx)
{
    if(idx == -1) return;
    let build = buildWeapon(playerCpu,idx);
    if(build)
    {
           log.appendChild(document.createTextNode("CPU built " + RPSSTRING[idx] + ".\n"));
    }
    
}

function UsrBuild(weaponToBuild)
{ //wrapper for buildWeapon so log can respond to result of build weapon
    
    if(buildWeapon(playerUsr,weaponToBuild))
    {
        disableBuilders();
        messageAndLog("Successfully built " + RPSSTRING[weaponToBuild] + ".");
    }
    else
    {
        messageAndLog("Failed to build Weapon");
    }
}

function buildWeapon(player, weaponToBuild) //builds weapon retruns true if succ false otherwise
{
    if (weaponToBuild == ROCK)
    {
        if((player.isBreak(PAPER) || player.isOut(SCISSOR))) return false;
        player.rm(PAPER);
        player.rm(SCISSOR);
        player.add(ROCK);
    }
    else if (weaponToBuild == PAPER)
    {
        if(player.isBreak(PAPER) || (player.isOut(ROCK) || player.isOut(SCISSOR))) return false;
        player.rm(ROCK);
        player.rm(SCISSOR);
        player.add(PAPER);
    }
    else if (weaponToBuild == SCISSOR)
    {
        if(player.isBreak(SCISSOR) || (player.isOut(PAPER) || player.isOut(ROCK))) return false;
        player.rm(ROCK);
        player.rm(PAPER);
        player.add(SCISSOR);
    }
    btnUpdate();
    return true;
}

function enableBuilders()
{
    buildBtnArr.forEach(e => e.disabled = false);
}
function disableBuilders()
{
    buildBtnArr.forEach(e => e.disabled = true);
}

function disableButtons()
{
    playerBtnArr.forEach(e => e.disabled = true);
}

function enableButtons()
{
    playerBtnArr.forEach(e => e.disabled = false);
}
window.addEventListener('load', initialize);
