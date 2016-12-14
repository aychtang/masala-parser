import stream from '../../lib/stream/index';
import P from '../parsec/parser';
const eol = P.char('\n');


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
           .then(command())
           .then(blank())
           .map(a => a[0][1] )
}

function parameter() {
    return text()
}

//accept this pattern:   !command:parameters
function commandLine() {
  //  return blank()
     //     .then(P.char('!'))
    return P.char('!')
          .then(command_name())
          .then(P.char(':'))
          .then(parameter())
        .flattenDeep()
        .map(value => ({command:{
                        type:value[1],
                        value:value[3]
                        }})
        )
}

/*function markupLine() {
    return commandLine().or(text()).or(blank())
}*/

export default class CommandParser {
    getParser(){
        return commandLine();
    }
    
    parseLine(line){
        let myStream=stream.ofString(line);
        return commandLine().parse(myStream);
    }
}

