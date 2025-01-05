//########################################################################
//# Program Assignment: Program 6                                        #
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
async function main() {
    clearScreen();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    //Part: Setup Simpson
    for (let i = 0; i < 3; i++) {
        const p = parseFloat(await rl.question('Enter expected p: ')) || 0;
        const dof = parseFloat(await rl.question('Enter degree of freedom: ')) || 0;
        console.log("Expected X: ", binary_search(p, dof).toFixed(5));
    }

    rl.close();
}
main();