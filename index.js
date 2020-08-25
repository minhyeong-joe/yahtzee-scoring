const prompt = require('prompt-sync')();

// constant scores
const FULL_HOUSE = 25;
const SM_STRAIGHT = 30;
const LG_STRAIGHT = 40;
const YAHTZEE = 50;

// check if input dice are valid
// valid iff (1)there are 5 dice; (2)each die is an integer between 1 and 6 (inclusive)
const isValidDice = dice => {
    if (dice.length != 5) {
        return false;
    }
    for (const die of dice) {
        if (die < 1 || die > 6 || !Number.isInteger(die)) {
            return false;
        }
    }
    return true;
};

// compute Score given valid 5 dices
const computeScore = dice => {
    // sort for straight check
    dice.sort();
    // console.log("Sorted:", dice);
    // freq for dice counter
    const freq = {};
    const sumOfEyes = dice.reduce((acc, die) => acc + die, 0);
    const scores = {
        ones: 0,
        twos: 0,
        threes: 0,
        fours: 0,
        fives: 0,
        sixs: 0,
        threeOfKind: 0,
        fourOfKind: 0,
        fullHouse: 0,
        smStraight: 0,
        lgStraight: 0,
        yahtzee: 0,
        choice: 0
    };
    // compute singles & count occurrences at the same time
    dice.forEach(die => {
        if (freq[die]) {
            freq[die]++;
        } else {
            freq[die] = 1;
        }
        switch (die) {
            case 1:
                scores.ones++;
                break;
            case 2:
                scores.twos += 2;
                break;
            case 3:
                scores.threes += 3;
                break;
            case 4:
                scores.fours += 4;
                break;
            case 5:
                scores.fives += 5;
                break;
            case 6:
                scores.sixs += 6;
                break;
        }
    });
    // compute 3 of a kind & 4 of a kind & Full House & Yahtzee
    // console.log("Count:", freq);
    for (const [_, count] of Object.entries(freq)) {
        if (count >= 3) {
            scores.threeOfKind = sumOfEyes;
            // full house is special type of 3 of a kind
            if (count == 3 && Object.keys(freq).length == 2) {
                scores.fullHouse = FULL_HOUSE;
            }
        }
        if (count >= 4) {
            scores.fourOfKind = sumOfEyes;
        }
        if (count == 5) {
            scores.yahtzee = YAHTZEE;
        }
    }
    // compute SM straight & LG straight
    let straight = 1;
    let maxStraight = 1;
    for (let i = 1; i < dice.length; i++) {
        if (dice[i] == dice[i - 1] + 1) {
            straight++;
        } else if (dice[i] > dice[i - 1] + 1) {
            straight = 1;
        }
        maxStraight = Math.max(straight, maxStraight);
    }
    if (maxStraight >= 4) {
        scores.smStraight = SM_STRAIGHT;
    }
    if (maxStraight == 5) {
        scores.lgStraight = LG_STRAIGHT;
    }

    // choice score is just sum of all dice
    scores.choice = sumOfEyes;

    console.log(scores);
};

// main program
let input;
do {
    let dice = prompt("Enter the eyes of five dice separated by space: ").split(" ").map(die => parseInt(die));
    while (!isValidDice(dice)) {
        dice = prompt("Please enter valid eyes of Five dice: ").split(" ").map(die => parseInt(die));
    }
    computeScore(dice);
    input = prompt("Continue? ('y' for more computation): ");
} while (input == "y")




