"use strict";
//########################################################################
//# Program Assignment: Program 5                                        #
//# Name: Pisit Pisuttipunpong 640615023                                 #
//# Date: 2024-12-19                                                     #
//# Description: Numerical Integral of T Distribution                    #
//########################################################################
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline/promises"));
const E = 0.00001;
//Part: Function
function clearScreen() {
    process.stdout.write('\x1Bc');
}
function gamma_function(x) {
    if (x === 1)
        return 1;
    if (x === 0.5)
        return Math.sqrt(Math.PI);
    return (x - 1) * gamma_function(x - 1);
}
function t_distribution_function(x, dof) {
    return (gamma_function((dof + 1) / 2) / (Math.pow(dof * Math.PI, 0.5) * gamma_function(dof / 2))) * Math.pow(1 + ((x * x) / dof), -1 * (dof + 1) / 2);
}
function simpson_function(w, num_seg, x, dof) {
    let sumF = t_distribution_function(0, dof) + t_distribution_function(x, dof);
    for (let i = 1; i <= num_seg - 1; i += 2) {
        sumF += 4 * t_distribution_function(i * w, dof);
    }
    for (let i = 2; i <= num_seg - 2; i += 2) {
        sumF += 2 * t_distribution_function(i * w, dof);
    }
    return sumF * w / 3;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        clearScreen();
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        //Part: Setup Simpson
        const x = parseFloat(yield rl.question('Enter x: ')) || 0;
        const dof = parseFloat(yield rl.question('Enter degree of freedom: ')) || 0;
        let num_seg = 10;
        let prev_p = 0;
        let current_p = 0;
        let w = x / num_seg;
        rl.close();
        //Part: Simpson logic
        do {
            prev_p = current_p;
            w = x / num_seg;
            current_p = simpson_function(w, num_seg, x, dof);
            num_seg *= 2;
        } while (current_p - prev_p > E);
        // console.log(`Number of Segments: ${num_seg}`);
        console.log(`Simpson's Value: ${current_p.toFixed(5)}`);
    });
}
main();
