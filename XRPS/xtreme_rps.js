
ROCK = 0, PAPER = 1, SCISSOR = 2;
RPSTABLE = [2,1,0,0,2,1,1,0,2];
RPSSTRING = ["ROCK", "PAPER","SCISSOR"];
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
    outputDiv = document.getElementById("outdiv");
}

function playRound(usrIn)
{
    var cpu = cpuChoice();
    var result = RPSTABLE[(cpu * 3) + usrIn];
    console.log(cpu + " " + usrIn + " " + result);
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