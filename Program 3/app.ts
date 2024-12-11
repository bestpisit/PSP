//########################################################################
//# Program Assignment: Program 3                                        #
//# Name: Pisit Pisuttipunpong 640615023                                 #
//# Date: 2024-11-28                                                     #
//# Description: Linear Regression for predict Y from X                  #
//########################################################################

import * as readline from 'readline/promises';

function clearScreen() {
    process.stdout.write('\x1Bc');
}

//  4 Test Cases
//  1 2       Estimated Proxy Size = 130 650 99 150 128 302 95 945 368 961
//      3 4   Plan Added and Modified Size = 163 765 141 166 137 355 136 1206 433 1130
//  1   3     Actual Added and Modified Size = 186 699 132 272 291 331 199 1890 788 1601
//    2   4   Actual Development Hours = 15.0 69.9 6.5 22.4 28.4 65.9 19.4 198.7 38.8 138.2

const calculateMean = (numberList: number[]): number => { // #added_line
    return numberList.reduce((a, c) => a + c, 0) / numberList.length; // #added_line
}   // #added_line

const calculateSD = (numberList: number[], mean: number): number => { // #added_line
    if (numberList.length <= 1) return 0; // #added_line
    return Math.sqrt(numberList.map(num => Math.pow(num - mean, 2)).reduce((a, c) => a + c, 0) / (numberList.length - 1)); // #added_line
} // #added_line

const calculateB1 = (numberList1: number[], numberList2: number[]): number => { // #added_line
    const mean1 = calculateMean(numberList1); // #added_line
    const mean2 = calculateMean(numberList2); // #added_line
    const sumXY = numberList1.map((num1, i) => num1 * numberList2[i]).reduce((a, c) => a + c, 0); // #added_line
    const sumX2 = numberList1.map(num => num * num).reduce((a, c) => a + c, 0); // #added_line
    return (sumXY - numberList1.length * mean1 * mean2) / (sumX2 - numberList1.length * mean1 * mean1); // #added_line
} // #added_line

const calculateB0 = (numberList1: number[], numberList2: number[]): number => { // #added_line
    const B1 = calculateB1(numberList1, numberList2); // #added_line
    return calculateMean(numberList2) - B1 * calculateMean(numberList1); // #added_line
} // #added_line

const calculateR = (numberList1: number[], numberList2: number[]): number => { // #added_line
    const n = numberList1.length; // #added_line
    const sumX = numberList1.reduce((a, c) => a + c, 0); // #added_line
    const sumY = numberList2.reduce((a, c) => a + c, 0); // #added_line
    const sumXY = numberList1.map((num1, i) => num1 * numberList2[i]).reduce((a, c) => a + c, 0); // #added_line
    const sumX2 = numberList1.map(num => num * num).reduce((a, c) => a + c, 0); // #added_line
    const sumY2 = numberList2.map(num => num * num).reduce((a, c) => a + c, 0); // #added_line

    const top = n * sumXY - sumX * sumY; // #added_line
    const bottom = Math.sqrt((n * sumX2 - Math.pow(sumX, 2)) * (n * sumY2 - Math.pow(sumY, 2))); // #added_line

    return top / bottom; // #added_line
} // #added_line

const getInputSingleLine = async (rl: readline.Interface, question: string): Promise<number[]> => { // #added_line
    const inputLine = await rl.question(question); // #added_line

    return inputLine // #added_line
        .trim() // #added_line
        .split(/\s+/) // #added_line
        .map((num) => parseFloat(num) || 0); // #added_line
}; // #added_line

async function main() {
    // Create readline input interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    clearScreen();

    //delete_line const numberCount = parseInt(await rl.question('How many numbers ? : ')) || 0;
    //delete_line console.log(`Please input ${numberCount} numbers.`);

    const EstimatedProxySize = [130, 650, 99, 150, 128, 302, 95, 945, 368, 961]; // #added_line
    const PlanAddedandModifiedSize = [163, 765, 141, 166, 137, 355, 136, 1206, 433, 1130]; // #added_line
    const ActualAddedandModifiedSize = [186, 699, 132, 272, 291, 331, 199, 1890, 788, 1601]; // #added_line
    const ActualDevelopmentHours = [15.0, 69.9, 6.5, 22.4, 28.4, 65.9, 19.4, 198.7, 38.8, 138.2]; // #added_line

    console.log("Test Case 1"); // #added_line
    const x_test_1 = 386; // #added_line
    const b1_1 = calculateB1(EstimatedProxySize, ActualAddedandModifiedSize); // #added_line
    const b0_1 = calculateB0(EstimatedProxySize, ActualAddedandModifiedSize); // #added_line
    const r_1 = calculateR(EstimatedProxySize, ActualAddedandModifiedSize); // #added_line
    const r2_1 = Math.pow(r_1,2); // #added_line
    const y_1 = b0_1 + b1_1 * x_test_1; // #added_line
    console.log(`B0 value = ${b0_1.toFixed(4)}`); // #added_line
    console.log(`B1 value = ${b1_1.toFixed(4)}`); // #added_line
    console.log(`R value = ${r_1.toFixed(4)}`); // #added_line
    console.log(`R^2 value = ${r2_1.toFixed(4)}`); // #added_line
    console.log(`Predicted Y value = ${y_1.toFixed(4)}`); // #added_line

    console.log(""); // #added_line
    console.log("=================================================") // #added_line
    console.log(""); // #added_line

    console.log("Test Case 2"); // #added_line
    const x_test_2 = 386; // #added_line
    const b1_2 = calculateB1(EstimatedProxySize, ActualDevelopmentHours); // #added_line
    const b0_2 = calculateB0(EstimatedProxySize, ActualDevelopmentHours); // #added_line
    const r_2 = calculateR(EstimatedProxySize, ActualDevelopmentHours); // #added_line
    const r2_2 = Math.pow(r_2,2); // #added_line
    const y_2 = b0_2 + b1_2 * x_test_2; // #added_line
    console.log(`B0 value = ${b0_2.toFixed(4)}`); // #added_line
    console.log(`B1 value = ${b1_2.toFixed(4)}`); // #added_line
    console.log(`R value = ${r_2.toFixed(4)}`); // #added_line
    console.log(`R^2 value = ${r2_2.toFixed(4)}`); // #added_line
    console.log(`Predicted Y value = ${y_2.toFixed(4)}`); // #added_line

    console.log(""); // #added_line
    console.log("=================================================") // #added_line
    console.log(""); // #added_line

    console.log("Test Case 3"); // #added_line
    const x_test_3 = 386; // #added_line
    const b1_3 = calculateB1(PlanAddedandModifiedSize, ActualAddedandModifiedSize); // #added_line
    const b0_3 = calculateB0(PlanAddedandModifiedSize, ActualAddedandModifiedSize); // #added_line
    const r_3 = calculateR(PlanAddedandModifiedSize, ActualAddedandModifiedSize); // #added_line
    const r2_3 = Math.pow(r_3,2); // #added_line
    const y_3 = b0_3 + b1_3 * x_test_3; // #added_line
    console.log(`B0 value = ${b0_3.toFixed(4)}`); // #added_line
    console.log(`B1 value = ${b1_3.toFixed(4)}`); // #added_line
    console.log(`R value = ${r_3.toFixed(4)}`); // #added_line
    console.log(`R^2 value = ${r2_3.toFixed(4)}`); // #added_line
    console.log(`Predicted Y value = ${y_3.toFixed(4)}`); // #added_line

    console.log(""); // #added_line
    console.log("=================================================") // #added_line
    console.log(""); // #added_line

    console.log("Test Case 4"); // #added_line
    const x_test_4 = 386; // #added_line
    const b1_4 = calculateB1(PlanAddedandModifiedSize, ActualDevelopmentHours); // #added_line
    const b0_4 = calculateB0(PlanAddedandModifiedSize, ActualDevelopmentHours); // #added_line
    const r_4 = calculateR(PlanAddedandModifiedSize, ActualDevelopmentHours); // #added_line
    const r2_4 = Math.pow(r_4,2); // #added_line
    const y_4 = b0_4 + b1_4 * x_test_4; // #added_line
    console.log(`B0 value = ${b0_4.toFixed(4)}`); // #added_line
    console.log(`B1 value = ${b1_4.toFixed(4)}`); // #added_line
    console.log(`R value = ${r_4.toFixed(4)}`); // #added_line
    console.log(`R^2 value = ${r2_4.toFixed(4)}`); // #added_line
    console.log(`Predicted Y value = ${y_4.toFixed(4)}`); // #added_line

    //delete_line let mean = 0.0;

    //delete_line for(let i=0;i<numberCount;i++){
    //delete_line const inputNumber = parseFloat(await rl.question(`Number ${i+1} : `)) || 0;
    //delete_line numberList.push(inputNumber);
    //delete_line mean += inputNumber;
    //delete_line }

    //calculate mean of numbers

    //delete_line mean /= numberCount;

    //delete_line const sumSD = numberList.map(num=>Math.pow(num-mean,2)).reduce((a,c)=>a+c,0) as number;

    //delete_line const SD = Math.sqrt((sumSD/(numberCount-1)));

    //delete_line console.log("======== Summary ========")

    //delete_line console.log("Mean : "+mean.toFixed(2));

    //delete_line console.log("Standard Deviation : "+SD.toFixed(2));

    rl.close();
}

main();