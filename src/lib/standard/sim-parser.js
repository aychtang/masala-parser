import stream from '../../lib/stream/index';
import P from '../parsec/parser';
const eol = P.char('\n');

export default class SimonParser {

    titleValue(line, level) {
        return { title: line.text.trim(), level: level };
    }

    sharps() {  // "###" -> 3
        return P.char('#').rep().map(sharps=> sharps.length);
    }

    plus() {
        return P.char('+').map(plus=> '+');
    }

    numeric() {  //  "265" -> 265
        return P.charIn('0123456789').rep().map(num=> parseInt(num.join('')));
    }

    number() {  // "3" -> 3      "###" -> 3
        return this.sharps().or(this.numeric())
    }

    addition() {

        // only then : [ [2, '+'], 1 ]
        // thenRight : will keep only only the right value
        // thenLeft : will keep only only the left value

        return this.number().then(this.plus()).then(this.number()) // change "###+2" into [3,'+',2]
        //.map(val => [val[0][1], [val[0][0], val[1]]]).debug('after map') //then [3,'+',2] into [+,[3,2]]
            .map(val => val[0][0] + val[1]).debug('after map')
    }

    rightAdd() {
        return this.plus().thenRight(this.number())
    }


    add() {
        return this.number().flatmap(number => this.rightAdd().rep().map(values => {
            return values.reduce((accu, next)=>accu + next, number);
        })).debug('end of add');
    }

    expression() {
        return P.try(
            this.number().thenLeft(this.plus()).then(P.lazy(this.expression.bind(this)))
                .map(values => values[0]+values[1])
        )
        .or(this.number());
    }

    additionSeries() {
        return (this.addition().debug('in or').then(this.addition())).or(this.addition())
    }

    // TODO: Maybe change line with textualLine
    combinator() {
        return this.expression().debug('after exp');

    }


    parse(stream, offset = 0) {
        //return this.additionSeries().parse(stream, offset);
        //return this.add().parse(stream, offset);
        return this.combinator().parse(stream, offset);
    }

    /**
     * @string line
     */
    parseLine(line) {
        let temp = this.parse(stream.ofString(line));
        return temp
    }
}
