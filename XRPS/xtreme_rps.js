import {Player} from "./player.js";

const ROCK = 0; const PAPER = 1; const SCISSOR = 2;
const RPSTABLE = [2,1,0,0,2,1,1,0,2];
const RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
const outputDiv = document.getElementById("outdiv");
const playerUsr = new Player(5,5,5);
const playerCpu = new Player(5,5,5);
const btnR = document.getElementById("btn-r");
const btnP = document.getElementById("btn-p");
const btnS = document.getElementById("btn-s");
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
}

function playRound(usrIn)
{
    
    var cpu = cpuChoice();
    var result = RPSTABLE[(cpu * 3) + usrIn];
    console.log(RPSSTRING[usrIn] + " " + RPSSTRING[cpu]);
    if(result == 0) //L
    {
        outputDiv.innerHTML = RPSSTRING[cpu] + " beats " + RPSSTRING[usrIn] + "<br/>CPU Wins";
    }
    else if(result == 1) //W
    {
        outputDiv.innerHTML = RPSSTRING[usrIn] + " beats " + RPSSTRING[cpu] + "<br/>usr Wins";
    }
    else if(result == 2) //T
    {
        outputDiv.innerHTML = "Both players chose " + RPSSTRING[usrIn];
    }
}

function cpuChoice()
{
    return rndNum(0,2);
}

function rndNum(min,max)
{
    var mult = max-(min-1);
	var rnd = parseInt(Math.random()*mult) + min;		
	return rnd;
}


//window.addEventListener('load', initialize);
btnR.onclick = function(){playRound(0)};
btnP.onclick = function(){playRound(1)};
btnS.onclick = function(){playRound(2)};