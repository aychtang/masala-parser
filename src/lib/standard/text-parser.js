/**
 * Created by Simon on 13/12/2016.
 */

export default class TextParser {
    getParser(){
        return textLine();
    }
    
    parseLine(line){
        let myStream=stream.ofString(line)
        return textLine().parse(myStream);
    }
}

import stream from '../../lib/stream/index';
import P from '../parsec/parser';

const eol = P.char('\n');


// accept a string of control characters. return ''
function blank(){ return P.charIn(" \n\t").optrep().map(blank=>'') }

//accept anything but a blank string
//TODO: trim
function text() {
    return blank()
        .then(P.charNotIn('*\n').rep())
        .map(a =>a[1].join('') )
        .debug("text parsed")
}

function italic(){
    return  blank()
        .then(P.char('*'))
        .then(text())
        .then(P.char('*'))
        .flattenDeep()
        .map(value=>({Italic:value[2]}))
        .debug('italic parsed')
}

function bold(){
    return  blank()
        .then(P.string('**'))
        .then(text())
        .then(P.string('**'))
        .flattenDeep()
        .map(value=>({Bold:value[2]}))
        .debug('bold parsed')
}


function textLine(){
    return  text().or(bold()) .or(italic()).rep()
}


/*let line=" je m'appelle *Zangra*, commandant du fort de *Belancio* qui domine la plaine "
    +"d'où l'ennemi viendra et me fera **heros**\n"
let textParser = new TextParser();
const parsing = textParser.parseLine(line);
console.info(parsing, '\n');*/