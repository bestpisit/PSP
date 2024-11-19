import * as readline from 'readline/promises';

function clearScreen() {
    process.stdout.write('\x1Bc');
}

async function main() {
    // Create readline input interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    clearScreen();

    // Main file
    const numberCount = parseInt(await rl.question('How many numbers ? : ')) || 0;
    console.log(`Please input ${numberCount} numbers.`);

    const numberList = [];

    let mean = 0.0;

    for(let i=0;i<numberCount;i++){
        const inputNumber = parseFloat(await rl.question(`Number ${i+1} : `)) || 0;
        numberList.push(inputNumber);
        mean += inputNumber;
    }

    //calculate mean of numbers
    
    mean /= numberCount;

    const sumSD = numberList.map(num=>Math.pow(num-mean,2)).reduce((a,c)=>a+c,0) as number;

    const SD = Math.sqrt((sumSD/(numberCount-1)));

    console.log("======== Summary ========")

    console.log("Mean : "+mean.toFixed(2));

    console.log("Standard Deviation : "+SD.toFixed(2));

    rl.close();
}

main();