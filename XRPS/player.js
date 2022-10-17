export const n = 5;

class Player
{
    n=5
    constructor(r,p,s)
    {
        this.rpsArr = [r,p,s];
    }

    rm(idx) //remove
    {   
        rpsArr[idx]--;
    }

    add(idx)
    {
        rpsArr[idx]++;
    }
}