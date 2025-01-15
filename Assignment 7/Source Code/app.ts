//########################################################################
//# Program Assignment: Program 7                                        #
//# Name: Pisit Pisuttipunpong 640615023                                 #
//# Date: 2025-1-5                                                       #
//# Description: Binary Search                                           #
//########################################################################

import * as readline from 'readline/promises';
const E = 0.000001;

//Part: Function
function clearScreen() {
    process.stdout.write('\x1Bc');
}

function gamma_function(x: number): number {
    if (x === 1) return 1;
    if (x === 0.5) return Math.sqrt(Math.PI);
    return (x - 1) * gamma_function(x - 1);
}

function t_distribution_function(x: number, dof: number) {
    return (gamma_function((dof + 1) / 2) / (Math.pow(dof * Math.PI, 0.5) * gamma_function(dof / 2))) * Math.pow(1 + ((x * x) / dof), -1 * (dof + 1) / 2);
}

function simpson_function(w: number, num_seg: number, x: number, dof: number) {
    let sumF = t_distribution_function(0, dof) + t_distribution_function(x, dof);
    for (let i = 1; i <= num_seg - 1; i += 2) {
        sumF += 4 * t_distribution_function(i * w, dof);
    }
    for (let i = 2; i <= num_seg - 2; i += 2) {
        sumF += 2 * t_distribution_function(i * w, dof);
    }
    return sumF * w / 3;
}

//Part find P
function find_p_function(x: number, dof: number) {
    let num_seg = 10;
    let prev_p = 0;
    let current_p = 0;
    let w = x / num_seg;

    //Part: Simpson logic
    do {
        prev_p = current_p;
        w = x / num_seg;
        current_p = simpson_function(w, num_seg, x, dof);
        num_seg *= 2;
    }
    while (current_p - prev_p > E);
    return current_p;
}

enum State {
    greater,
    lower,
    null
}

// Part Binary Search
function binary_search(p: number, dof: number) {
    let x = 1.;
    let D = x / 2;
    let p_x = find_p_function(x, dof);
    let previous_state: State = State.null; // gt = Greater, lt = Lower, null = No state
    while (Math.abs(p_x - p) > E) {
        if (p_x > p) {
            if (previous_state === State.lower) {
                D /= 2;
            }
            x -= D;
            previous_state = State.greater;
        } else {
            if (previous_state === State.greater) {
                D /= 2;
            }
            x += D;
            previous_state = State.lower;
        }
        p_x = find_p_function(x, dof);
    }
    return x;
}

const calculateMean = (numberList: number[]): number => {
    return numberList.reduce((a, c) => a + c, 0) / numberList.length;
}

const calculateB1 = (numberList1: number[], numberList2: number[]): number => {
    const mean1 = calculateMean(numberList1);
    const mean2 = calculateMean(numberList2);
    const sumXY = numberList1.map((num1, i) => num1 * numberList2[i]).reduce((a, c) => a + c, 0);
    const sumX2 = numberList1.map(num => num * num).reduce((a, c) => a + c, 0);
    return (sumXY - numberList1.length * mean1 * mean2) / (sumX2 - numberList1.length * mean1 * mean1);
}

const calculateB0 = (numberList1: number[], numberList2: number[]): number => {
    const B1 = calculateB1(numberList1, numberList2);
    return calculateMean(numberList2) - B1 * calculateMean(numberList1);
}

const calculateR = (numberList1: number[], numberList2: number[]): number => {
    const n = numberList1.length;
    const sumX = numberList1.reduce((a, c) => a + c, 0);
    const sumY = numberList2.reduce((a, c) => a + c, 0);
    const sumXY = numberList1.map((num1, i) => num1 * numberList2[i]).reduce((a, c) => a + c, 0);
    const sumX2 = numberList1.map(num => num * num).reduce((a, c) => a + c, 0);
    const sumY2 = numberList2.map(num => num * num).reduce((a, c) => a + c, 0);

    const top = n * sumXY - sumX * sumY;
    const bottom = Math.sqrt((n * sumX2 - Math.pow(sumX, 2)) * (n * sumY2 - Math.pow(sumY, 2)));

    return top / bottom;
}

const calculate_tail_area = (n: number, r: number): number => {
    const x = Math.abs(r) * Math.sqrt((n - 2) / (1 - Math.pow(r, 2)));
    const p = find_p_function(x, n - 2);
    return 1 - 2 * p;
}

const calculateSD_from_B = (b0: number, b1: number, dataX: number[], dataY: number[]): number => {
    if (dataX.length < 1 || dataY.length < 1) throw new Error("Data length must be greater than 0");
    if (dataX.length !== dataY.length) throw new Error("Data length must be equal");
    const n = dataX.length;
    const sum = dataX.map((x, i) => Math.pow(dataY[i] - b0 - b1 * x, 2)).reduce((a, c) => a + c, 0);
    return Math.sqrt(sum / (n - 2));
}

const calculate_range = (n: number, dataX: number[], b0: number, b1: number, dataY: number[], xk: number): number => {
    const t = binary_search(0.35, n - 2);
    const sd = calculateSD_from_B(b0, b1, dataX, dataY);
    const xavg = calculateMean(dataX);
    const sqrt = Math.sqrt(1 + 1 / n + (Math.pow((xk - xavg), 2)/dataX.map(x => Math.pow(x-xavg, 2)).reduce((a, c) => a + c, 0)));
    return t * sd * sqrt;
}

async function main() {
    clearScreen();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const EstimatedProxySize = [130, 650, 99, 150, 128, 302, 95, 945, 368, 961];
    const PlanAddedandModifiedSize = [163, 765, 141, 166, 137, 355, 136, 1206, 433, 1130];
    const ActualAddedandModifiedSize = [186, 699, 132, 272, 291, 331, 199, 1890, 788, 1601];
    const ActualDevelopmentHours = [15.0, 69.9, 6.5, 22.4, 28.4, 65.9, 19.4, 198.7, 38.8, 138.2];

    const EstimatedProxySizeProgram3_to_6 = [101.04,43.4,64.,19.98];
    const ActualAddedandModifiedSizeProgram3_to_6 = [110,40,47,13];
    const ActualDevelopmentHoursProgram3_to_6 = [54.,61.,76.,73.];

    //Part: Setup Testcase
    console.log("Test Case 1");
    const x_test_1 = 386;
    const b1_1 = calculateB1(EstimatedProxySize, ActualAddedandModifiedSize);
    const b0_1 = calculateB0(EstimatedProxySize, ActualAddedandModifiedSize);
    const r_1 = calculateR(EstimatedProxySize, ActualAddedandModifiedSize);
    const r2_1 = Math.pow(r_1, 2);
    const y_1 = b0_1 + b1_1 * x_test_1;
    console.log(`R value = ${r_1.toFixed(8)}`);
    console.log(`R^2 value = ${r2_1.toFixed(8)}`);
    console.log(`Tail Area = ${calculate_tail_area(EstimatedProxySize.length, r_1).toExponential()}`);
    console.log(`B0 value = ${b0_1.toFixed(8)}`);
    console.log(`B1 value = ${b1_1.toFixed(8)}`);
    console.log(`Yk value = ${y_1.toFixed(8)}`);
    const range_1 = calculate_range(EstimatedProxySize.length, EstimatedProxySize, b0_1, b1_1, ActualAddedandModifiedSize, x_test_1);
    console.log(`Range = ${range_1.toFixed(8)}`);
    console.log(`UPI = ${(y_1 + range_1).toFixed(8)}`);
    console.log(`LPI = ${(y_1 - range_1).toFixed(8)}`);

    console.log("\nTest Case 2");
    const x_test_2 = 386;
    const b1_2 = calculateB1(EstimatedProxySize, ActualDevelopmentHours);
    const b0_2 = calculateB0(EstimatedProxySize, ActualDevelopmentHours);
    const r_2 = calculateR(EstimatedProxySize, ActualDevelopmentHours);
    const r2_2 = Math.pow(r_2, 2);
    const y_2 = b0_2 + b1_2 * x_test_2;
    console.log(`R value = ${r_2.toFixed(8)}`);
    console.log(`R^2 value = ${r2_2.toFixed(8)}`);
    console.log(`Tail Area = ${calculate_tail_area(EstimatedProxySize.length, r_2).toExponential()}`);
    console.log(`B0 value = ${b0_2.toFixed(8)}`);
    console.log(`B1 value = ${b1_2.toFixed(8)}`);
    console.log(`Yk value = ${y_2.toFixed(8)}`);
    const range_2 = calculate_range(EstimatedProxySize.length, EstimatedProxySize, b0_2, b1_2, ActualDevelopmentHours, x_test_2);
    console.log(`Range = ${range_2.toFixed(8)}`);
    console.log(`UPI = ${(y_2 + range_2).toFixed(8)}`);
    console.log(`LPI = ${(y_2 - range_2).toFixed(8)}`);

    console.log("\nTest Case 3");
    const x_test_3 = 66.14; // from my Program7 estimate proxy size
    const b1_3 = calculateB1(EstimatedProxySizeProgram3_to_6, ActualAddedandModifiedSizeProgram3_to_6);
    const b0_3 = calculateB0(EstimatedProxySizeProgram3_to_6, ActualAddedandModifiedSizeProgram3_to_6);
    const r_3 = calculateR(EstimatedProxySizeProgram3_to_6, ActualAddedandModifiedSizeProgram3_to_6);
    const r2_3 = Math.pow(r_3, 2);
    const y_3 = b0_3 + b1_3 * x_test_3;
    console.log(`R value = ${r_3.toFixed(8)}`);
    console.log(`R^2 value = ${r2_3.toFixed(8)}`);
    console.log(`Tail Area = ${calculate_tail_area(EstimatedProxySizeProgram3_to_6.length, r_3).toExponential()}`);
    console.log(`B0 value = ${b0_3.toFixed(8)}`);
    console.log(`B1 value = ${b1_3.toFixed(8)}`);
    console.log(`Yk value = ${y_3.toFixed(8)}`);
    const range_3 = calculate_range(EstimatedProxySizeProgram3_to_6.length, EstimatedProxySizeProgram3_to_6, b0_3, b1_3, ActualAddedandModifiedSizeProgram3_to_6, x_test_3);
    console.log(`Range = ${range_3.toFixed(8)}`);
    console.log(`UPI = ${(y_3 + range_3).toFixed(8)}`);
    console.log(`LPI = ${(y_3 - range_3).toFixed(8)}`);

    console.log("\nTest Case 4");
    const x_test_4 = 66.14; // from my Program7 estimate proxy size
    const b1_4 = calculateB1(EstimatedProxySizeProgram3_to_6, ActualDevelopmentHoursProgram3_to_6);
    const b0_4 = calculateB0(EstimatedProxySizeProgram3_to_6, ActualDevelopmentHoursProgram3_to_6);
    const r_4 = calculateR(EstimatedProxySizeProgram3_to_6, ActualDevelopmentHoursProgram3_to_6);
    const r2_4 = Math.pow(r_4, 2);
    const y_4 = b0_4 + b1_4 * x_test_4;
    console.log(`R value = ${r_4.toFixed(8)}`);
    console.log(`R^2 value = ${r2_4.toFixed(8)}`);
    console.log(`Tail Area = ${calculate_tail_area(EstimatedProxySizeProgram3_to_6.length, r_4).toExponential()}`);
    console.log(`B0 value = ${b0_4.toFixed(8)}`);
    console.log(`B1 value = ${b1_4.toFixed(8)}`);
    console.log(`Yk value = ${y_4.toFixed(8)}`);
    const range_4 = calculate_range(EstimatedProxySizeProgram3_to_6.length, EstimatedProxySizeProgram3_to_6, b0_4, b1_4, ActualDevelopmentHoursProgram3_to_6, x_test_4);
    console.log(`Range = ${range_4.toFixed(8)}`);
    console.log(`UPI = ${(y_4 + range_4).toFixed(8)}`);
    console.log(`LPI = ${(y_4 - range_4).toFixed(8)}`);

    rl.close();
}
main();