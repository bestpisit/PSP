//########################################################################
//# Program Assignment: Program 4                                        #
//# Name: Pisit Pisuttipunpong 640615023                                 #
//# Date: 2024-12-11                                                     #
//# Description: Calculate Relative Size Range                           #
//########################################################################

const dataset1 = [{ "Class Name": "each_char", "Class LOC": 18, "Number of Methods": 3 }, { "Class Name": "string_read", "Class LOC": 18, "Number of Methods": 3 }, { "Class Name": "single_character", "Class LOC": 25, "Number of Methods": 3 }, { "Class Name": "each_line", "Class LOC": 31, "Number of Methods": 3 }, { "Class Name": "single_char", "Class LOC": 37, "Number of Methods": 3 }, { "Class Name": "string_builder", "Class LOC": 82, "Number of Methods": 5 }, { "Class Name": "string_manager", "Class LOC": 82, "Number of Methods": 4 }, { "Class Name": "list_clump", "Class LOC": 87, "Number of Methods": 4 }, { "Class Name": "list_clip", "Class LOC": 89, "Number of Methods": 4 }, { "Class Name": "string_decrementer", "Class LOC": 230, "Number of Methods": 10 }, { "Class Name": "Char", "Class LOC": 85, "Number of Methods": 3 }, { "Class Name": "Character", "Class LOC": 87, "Number of Methods": 3 }, { "Class Name": "Converter", "Class LOC": 558, "Number of Methods": 10 }];
const dataset2 = [{ "Chapter": "Preface", "Pages": 7 }, { "Chapter": "Chapter 1", "Pages": 12 }, { "Chapter": "Chapter 2", "Pages": 10 }, { "Chapter": "Chapter 3", "Pages": 12 }, { "Chapter": "Chapter 4", "Pages": 10 }, { "Chapter": "Chapter 5", "Pages": 12 }, { "Chapter": "Chapter 6", "Pages": 12 }, { "Chapter": "Chapter 7", "Pages": 12 }, { "Chapter": "Chapter 8", "Pages": 12 }, { "Chapter": "Chapter 9", "Pages": 12 }, { "Chapter": "Appendix A", "Pages": 8 }, { "Chapter": "Appendix B", "Pages": 8 }, { "Chapter": "Appendix C", "Pages": 8 }, { "Chapter": "Appendix D", "Pages": 20 }, { "Chapter": "Appendix E", "Pages": 14 }, { "Chapter": "Appendix F", "Pages": 18 }];

function clearScreen() {
    process.stdout.write('\x1Bc');
}

const calculateMean = (numberList: number[]): number => { // #added_line
    return numberList.reduce((a, c) => a + c, 0) / numberList.length; // #added_line
}   // #added_line

const calculateSD = (numberList: number[], mean: number): number => { // #added_line
    if (numberList.length <= 1) return 0; // #added_line
    return Math.sqrt(numberList.map(num => Math.pow(num - mean, 2)).reduce((a, c) => a + c, 0) / (numberList.length - 1)); // #added_line
} // #added_line

const calculateLogRange = (avg: number, sd: number): number[] => {
    return [
        avg - 2 * sd,
        avg - sd,
        avg,
        avg + sd,
        avg + 2 * sd
    ]
}

const antiLogarithm = (number: number): number => {
    return Math.exp(number);
}

async function main() {
    clearScreen();

    const data = [
        dataset1.map(d => d["Class LOC"] / d["Number of Methods"]),
        dataset2.map(d => d["Pages"])
    ];

    for (let currentData of data) {
        const currentDataLn = currentData.map(d => Math.log(d));
        const currentDataAvg = calculateMean(currentDataLn);
        const currentDataSD = calculateSD(currentDataLn, currentDataAvg);
        const currentDataVariance = Math.pow(currentDataSD, 2);
        const logRange = calculateLogRange(currentDataAvg, currentDataSD);
        const relativeSize = logRange.map(rsr=>antiLogarithm(rsr));

        console.log("VS: ", relativeSize[0].toFixed(4));
        console.log("S: ", relativeSize[1].toFixed(4));
        console.log("M: ", relativeSize[2].toFixed(4));
        console.log("L: ", relativeSize[3].toFixed(4));
        console.log("VL: ", relativeSize[4].toFixed(4));
        console.log("");
        console.log("######################################")
    }
}

main();