

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


}