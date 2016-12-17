/**
 * Created by Nicolas Zozol on 17/12/2016.
 */

import Parser from '../../lib/standard/operation-parser';

let value = undefined;
let accepted = undefined;
let parser = null


function testLine(line){
    let parsing = parser.parse(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
    
}

export default {
    setUp: function (done) {

        parser = Parser;
        done();
    },


    'test value': function (test) {
        test.expect(2);

        testLine('2');
        test.ok(accepted, 'numbers are accepted');
        test.equal(value,2, 'Final value is 2');
        test.done();
    },


    'test simple addition': function (test) {
        test.expect(2);

        const expected = 4;
        testLine('2 + 2');
        test.ok(accepted, 'operations are accepted');
        test.equal(expected, value);
        
        test.done();
    },
}