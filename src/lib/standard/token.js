import P from '../parsec/parser';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank() {
    return P.charIn(' \t').optrep().thenReturns('');
}

//todo: escape characters
function rawTextUntilChar(charList, allowVoid = false) {
    if (allowVoid) {
        return P.charNotIn(charList).optrep()
            .map(characters => characters.join(''))
    }
    else {
        return P.charNotIn(charList).rep()
            .map(characters => characters.join(''))
    }
}

function eol() {
    return P.char('\n');
}

//A blank line in the code(that is 2 consecutive \n) is a single end of line (lineFeed) in the rendition
function lineFeed() {
    return eol().then(blank()).then(eol()).thenReturns({
        linefeed: undefined
    });
}

function fourSpacesBlock() {
    return P.char('\t').or(P.charIn(' \u00A0').occurrence(4));
}

function wordSeparator() {
    return P.charIn(' \n.,').rep();
}

function wordSequence(stop) {
    //return P.any.rep();
    return P.not(stop);

}

function wordsUntil(stop) {
    return P.try(
        wordSequence(stop).rep().then(P.eos).thenReturns(undefined)
    ).or(
        wordSequence(stop).rep().map(chars=>chars.join(''))
        )
        .filter(v=> v !== undefined);
}

/*
function wordsUntil(stop){
    return wordSequence(stop).rep().map(chars=>chars.join(''));
}*/


function stringIn(array) {

    const tryString = s => P.try(P.string(s));

    if (array.length === 0) {
        // keep the same processus with try and P.string(xyz);
        // Makes sure offest is not eaten and returns undefined
        // TODO: to be discussed
        return tryString("").thenReturns(undefined);
    }
    if (array.length === 1) {
        return P.try(P.string(array[0]));
    }

    const initial = tryString(array[0]);
    const workArray = array.slice(1);
    return workArray.reduce((accu, next)=>accu.or(tryString(next)),
        initial)
}

export default {
    stringIn,
    wordSeparator,
    wordsUntil,
    blank,
    rawTextUntilChar,
    eol,
    lineFeed,
    fourSpacesBlock
}



