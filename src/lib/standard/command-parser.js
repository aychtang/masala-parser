import stream from '../../lib/stream/index';
import P from '../parsec/parser';
const eol = P.char('\n');


// accept a string of control characters
function blank(){return P.charIn(" \n\t").optrep()}

// accept a non-void string of character without control or special character
function word() {return P.charNotIn(': \n\t').rep()}

//accept anything but a blank string
function text() {
    return blank().then(P.any()).rep()
}

function command_name() {
    return blank().then(word()).then(blank())
}

function parameter() {
    return text()
}

//accept this pattern:   !command:parameters
function commandLine() {
    return blank()
        .then(P.char('!'))
        .then(command_name())
        .then(P.char(':'))
        .then(parameter())
}

export default class CommandParser {
    parseLine(line){
        let myStream=stream.ofString(line)
        return commandLine().parse(myStream);
    }
}
