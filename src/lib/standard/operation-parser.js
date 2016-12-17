/**
 * Created by Nicolas Zozol on 17/12/2016.
 * Inspired by Wikipedia :
 * https://en.wikipedia.org/wiki/Parsing_expression_grammar#Examples
 */
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';

function number() {
    return P.digit.rep().map(v=>parseInt(v));
}

function expression() {

}

function plusOperator() {
    return T.blank().thenRight(P.char('+')).thenLeft(T.blank());
}

function sum() {
    return number().thenLeft(plusOperator()).then(number())
        .map(values=>values[0] + values[1]);
}

function product() {

}

function value() {

}

function combinator() {
    return P.try(sum()).or(number());
}

function parseOperation(line) {
    return combinator().parse(stream.ofString(line), 0);
}


export default {
    number,
    expression,
    sum,
    product,
    value,
    combinator,
    parse(line){
        return parseOperation(line, 0);
    }
}
