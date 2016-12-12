import SimonParser from '../../lib/standard/sim-parser';


/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */


function isDefined(object) {
    return typeof object !== 'undefined';
}

function isString(object) {
    return typeof object === 'string';
}

function isArray(object) {
    return object instanceof Array;
}
function isObject(object) {
    return !(object instanceof Array) && typeof object == 'object';
}


let lineParser = null;
let value = undefined;
let accepted = undefined;


function display(val, prefix = false) {
    if (val === undefined) {
        val = value;
    }
    if (prefix) {
        console.info(`${prefix} : ${JSON.stringify(val)}`);
    } else {
        console.info(JSON.stringify(val));
    }
}

function testLine(line) {
    // lineParser = new LineParser();
    const parsing = lineParser.parseLine(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
}

function item(n = 0) {
    return value.line[n]
}

export default {
    setUp: function (done) {
        lineParser = new SimonParser();
        done();
    },
/*
    'n sharp should be accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(lineParser.parseLine('#+##').isAccepted(),
            'should be accepted.');
        //ends
        test.done();
    },*/
    'n sharp should be resolved as n': function (test) {
        test.expect(2);

        // tests here
        testLine('##+#');
        test.ok(accepted, 'sharps are accepted');

        test.deepEqual(value, 3, 'value is 3');

        test.done();

    },
    'n sharp and numbers can be mixed': function (test) {
        test.expect(2);

        // tests here
        testLine('23+#');
        test.ok(accepted, 'sharps and numbers are accepted');

        test.deepEqual(value, 24, 'value is 24');

        test.done();
    },
    'n sharp and numbers can be mixed': function (test) {
        test.expect(2);

        // tests here
        testLine('23+#+10+##');
        test.ok(accepted, 'series of addition are accepted');

        test.deepEqual(value, 36, 'value is 36');

        test.done();
    }
}
