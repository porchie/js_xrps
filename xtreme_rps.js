import {Player} from "./player.js";

const ROCK = 0; const PAPER = 1; const SCISSOR = 2;
const RPSTABLE = [2,1,0,0,2,1,1,0,2];
const RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
const messageDiv = document.getElementById("outdiv");
const graphicsDiv = document.getElementById("graphical");
let playerUsr = new Player(5,5,5);
let playerCpu = new Player(0,1,0);
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
    playerBtnArr[ROCK].addEventListener('click',function(){playRound(ROCK)});
    playerBtnArr[PAPER].addEventListener('click',function(){playRound(PAPER)});
    playerBtnArr[SCISSOR].addEventListener('click', function(){playRound(SCISSOR)});
    resetBtn.addEventListener('click',function(){reset()});
    while(messageDiv.firstChild) messageDiv.removeChild(messageDiv.firstChild);
    messageDiv.appendChild(document.createTextNode(""));
    while(log.firstChild)log.removeChild(log.firstChild);
    for(var i = 0;i<3;i++)
    {
        var p = playerBtnArr[i];
        var c = cpuDisplayArr[i];
        p.innerHTML = playerUsr.rpsArr[i]; // change
        c.innerHTML = playerCpu.rpsArr[i];
    }


}

function reset()
{
    playerUsr = new Player(5,5,5);
    playerCpu = new Player(5,5,5);
    initialize();
}

function playRound(usrIn)
{
    messageDiv.firstChild.nodeValue = "";
    if(playerUsr.isOut(usrIn))
    {
        messageDiv.firstChild.nodeValue = "Out of " + RPSSTRING[usrIn];
        return; 
    }
    var cpu = cpuChoice();
    if(cpu === -1)
    {
        playerBtnArr.forEach(e => removeAllListeners(e));
    }
    else
    {
        var result = RPSTABLE[(cpu * 3) + usrIn];
        console.log(RPSSTRING[usrIn] + " " + RPSSTRING[cpu]);
        var message = "";
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
        playerBtnArr[usrIn].innerHTML =  playerUsr.rpsArr[usrIn];
        playerBtnArr[cpu].innerHTML =  playerUsr.rpsArr[cpu];
        cpuDisplayArr[usrIn].innerHTML = playerCpu.rpsArr[usrIn];
        cpuDisplayArr[cpu].innerHTML = playerCpu.rpsArr[cpu];
    }
    if(playerUsr.isAllOut() || playerCpu.isAllOut())
    {
        messageDiv.firstChild.nodeValue = playerCpu.isAllOut() ? "You WIN!!!!" : "ggez";
    }
    else
    {
        messageDiv.firstChild.nodeValue = message;
        log.appendChild(document.createTextNode(message + "\n"));
    }

}

function removeAllListeners(element)
{
    var cloned = element.cloneNode(true);
    element.parentNode.replaceChild(cloned,element);
}

function cpuChoice()
{
    var choice = pickRndFrArr(playerCpu.arrOfArsenal()) //add intelligence l8r
    return choice;
}

function pickRndFrArr(arr) //picks a rand idx from an array
{
    if (arr.length == 0) return -1;
    var rnd = rndNum(0,arr.length-1);
    var idx = rndNum(0,arr.length-1);
    return arr[idx];
}

function rndNum(min,max)
{
    var mult = max-(min-1);
	var rnd = parseInt(Math.random()*mult) + min;		
	return rnd;
}


window.addEventListener('load', initialize);

