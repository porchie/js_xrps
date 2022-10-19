import {Player} from "./player.js";

const ROCK = 0; const PAPER = 1; const SCISSOR = 2;
const RPSTABLE = [2,1,0,0,2,1,1,0,2];
const RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
const outputDiv = document.getElementById("outdiv");
const graphicsDiv = document.getElementById("graphical");
const playerUsr = new Player(5,5,5);
const playerCpu = new Player(5,5,5);
const RPSBTNARR = [document.getElementById("btn-r"),document.getElementById("btn-p"),document.getElementById("btn-s")];
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
    console.log("init");
    for(var i = 0;i<3;i++)
    {
        var btn = RPSBTNARR[i];
        btn.innerHTML = RPSSTRING[i] + " " + playerUsr.rpsArr[i];
    }
}

function playRound(usrIn)
{
    outputDiv.innerHTML = "";
    if(playerUsr.rpsArr[usrIn] == 0)
    {
        outputDiv.innerHTML = "Out of " + RPSSTRING[usrIn];
        return; 
    }
    var cpu = cpuChoice();
    var result = RPSTABLE[(cpu * 3) + usrIn];
    console.log(RPSSTRING[usrIn] + " " + RPSSTRING[cpu]);
    var message = "";
    if(result == 0) //L
    {
        playerUsr.rm(usrIn);
        playerCpu.add(usrIn);
        message = RPSSTRING[cpu] + " beats " + RPSSTRING[usrIn] + "<br/>CPU Wins";
    }
    else if(result == 1) //W
    {
        playerCpu.rm(cpu);
        playerUsr.add(cpu);
        message = RPSSTRING[usrIn] + " beats " + RPSSTRING[cpu] + "<br/>usr Wins";
    }
    else if(result == 2) //T
    {
        message = "Both players chose " + RPSSTRING[usrIn];
    }
    RPSBTNARR[usrIn].innerHTML = RPSSTRING[usrIn] + " "  + playerUsr.rpsArr[usrIn];
    RPSBTNARR[cpu].innerHTML = RPSSTRING[cpu] + " "  + playerUsr.rpsArr[cpu];
    
    outputDiv.innerHTML += message;

}

function cpuChoice()
{
    var choice = rndNum(0,2); //add intelligence l8r
    return choice;

}

function rndNum(min,max)
{
    var mult = max-(min-1);
	var rnd = parseInt(Math.random()*mult) + min;		
	return rnd;
}


window.addEventListener('load', initialize);
RPSBTNARR[ROCK].onclick = function(){playRound(ROCK)};
RPSBTNARR[PAPER].onclick = function(){playRound(PAPER)};
RPSBTNARR[SCISSOR].onclick = function(){playRound(SCISSOR)};