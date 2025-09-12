import * as readline from 'readline/promises';

export async function getUserInput(acceptedRegex: RegExp) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let answer = null
    do{
        if (answer !== null){
            console.log("Invalid response")
        }
        answer = await rl.question("Enter response: ");
    }
    while(!new RegExp(acceptedRegex).test(answer))

    rl.close();

    return answer;
}