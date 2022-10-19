

export class Player
{
    constructor(r,p,s)
    {
        this.rpsArr = [r,p,s];
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
    rm(idx) //remove one
    {   
        this.rpsArr[idx]--;
    }

    add(idx)// add one
    {
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
        //This skips a conditional for the cpu.
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
}