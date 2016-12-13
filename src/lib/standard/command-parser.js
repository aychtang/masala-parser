import stream from '../../lib/stream/index';
import P from '../parsec/parser';
const eol = P.char('\n');


// This is done in a linear time O(n) without recursion
// memory complexity is O(1) or O(n) if mutable param is set to false
function flatten(array, mutable) {
    var toString = Object.prototype.toString;
    var arrayTypeStr = '[object Array]';

    var result = [];
    var nodes = (mutable && array) || array.slice();
    var node;

    if (!array.length) {
        return result;
    }

    node = nodes.pop();

    do {
        if (toString.call(node) === arrayTypeStr) {
            nodes.push.apply(nodes, node);
        } else {
            result.push(node);
        }
    } while (nodes.length && (node = nodes.pop()) !== undefined);

    result.reverse(); // we reverse result to restore the original order
    return result;
}

// accept a string of control characters
function blank(){ return P.charIn(" \n\t").optrep().map(blank=>'') }

//accept anything but a blank string
//TODO: trim
function text() {
    return blank()
           .then(P.charNotIn('\n').rep())
        .map(a =>a[1].join('') )
}

function command(){
    return P.string("image").or(P.string('warning')).or(P.string('info')).or(P.string('equation'))
}

function command_name() {
    return blank()
           //.then(word())
           .then(command())
           .then(blank())
           .map(a => a[0][1] )
}

function parameter() {
    return text()
}

//accept this pattern:   !command:parameters
function commandLine() {
    return  blank()
          .then(P.char('!'))
          .then(command_name(
              
          ))
          .then(P.char(':'))
          .then(parameter())
        .flattenDeep()
        .map(value => ({command:{
                        type:value[2],
                        value:value[4]
                        }})
        )
}

function markupLine() {
    return commandLine().or(text()).or(blank())
}

export default class CommandParser {
    parseLine(line){
        let myStream=stream.ofString(line)
        return markupLine().parse(myStream);
    }
}
