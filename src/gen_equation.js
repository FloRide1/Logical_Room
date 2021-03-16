// Format 
/*
    challenges = [
        {
            name: chall1,
            diff:1
        },{
            name: chall2,
            diff:2
        }

    ]
*/



function test(d,p){
    generateEquation(challenges,d,p)
}

function generateEquation(challenges,difficulty,paths_number) {
    let list_bin = []
    for (let i = 0; i < pow(2,challenges.length); i++) {
        let binary = int_to_bin(i);
        let sum = calc_sum(binary,challenges);
        if (sum == difficulty) {
            list_bin.push(binary);
        }
    }
    console.log("Number of Case :",list_bin.length)
    console.log(list_bin)
    let equation;
    let end = end;
    while (!end) {

    }
}

function calc_sum(binary,challenges){
    let total = 0
    for (let i = binary.length - 1; i >= 0; i--) {
        total+= binary[i] * challenges[i].diff
    }
    return total
}

function int_to_bin(value){
    return (value >>> 0).toString(2);
}