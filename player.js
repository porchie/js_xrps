

export class Player
{
    constructor(r,p,s)
    {
        this.rpsArr = [r,p,s];
        this.breakArr = [false,false,false];
    }

    setR(num)
    {
        this.rpsArr[0] = num;
    }

    setP(num)
    {
        this.rpsArr[1] = num;
    }

    setS(num)
    {
        this.rpsArr[2] = num;
    }
    
    break(idx)
    {
        this.breakArr[idx] = true;
    }
    
    isBreak(idx)
    {
        return this.breakArr[idx];
    }
    
    rm(idx) //remove one
    {   
        if(this.breakArr[idx]) return;
        this.rpsArr[idx]--;
    }
    
    add(idx)// add one
    {
        if(this.breakArr[idx]) return;
        this.rpsArr[idx]++;
    }

    arrOfArsenal()
    {
        var arr = [];
        for(var i = 0;i<3;i++)
        {
            for(var j = 0;j<this.rpsArr[i];j++)
            {
                arr.push(i);
            }   
        }
        //at this point we have an ordered array of all of the arsenal, basicly if rock=5 paper=6 scissor=2
        //arr looks like [0,0,0,0,0,1,1,1,1,1,1,2,2]  now we need to pick a random element from this arr
        //This skips a conditional for the cpu
        return arr;
    }

    isOut(idx)
    {
        return this.rpsArr[idx] === 0;
    }

    isAllOut()
    {
        return (this.isOut(0) && this.isOut(1) && this.isOut(2))
    }

    oneLeft()
    {
        return (this.isOut(0) && this.isOut(1)) || //no r and p
        (this.isOut(1) && this.isOut(2)) ||        //no p and s
        (this.isOut(0) && this.isOut(2));          //no r and s
    }

    leastWeapon()
    {
        let least = 0;
        for(let leastIdx = 1; leastIdx<3; leastIdx++)
        {
            if(this.rpsArr[least] > this.rpsArr[leastIdx])
            {
                least = leastIdx;
            }
        }
        return least;
    }

    printVals() //for testing
    {
        console.log(this.rpsArr[0] + " " + this.rpsArr[1] + " " + this.rpsArr[2]);
    }
}