import CommandParser from '../../lib/standard/command-parser';


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


let commandParser = null;
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
    const parsing = commandParser.parseLine(line);
    console.info('----parsing', parsing, '\n');
    value = parsing.value;
    accepted = parsing.isAccepted();
}


export default {
    setUp: function (done) {
        commandParser = new CommandParser();
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
    /*
    'text': function (test) {
        test.expect(1);

        // tests here
        testLine('It is hot summer\n');
        test.ok(accepted, 'simple text');

        test.done();

    },
*/
    'image command': function (test) {
        test.expect(1);

        const expected = {
            command : {
                type : 'image',
                source : 'john.jpg'
            }
        };

        testLine('!image: john.jpg\n');
        test.ok(accepted, 'accept image command');

        test.done();
    },

    'image command without file': function (test) {
        test.expect(1);

        testLine('!image: \n');
        test.ok(!accepted, 'reject image with no parameter');

        test.done();
    } ,


    'image command with space': function (test) {
        test.expect(1);

        // tests here
        testLine('!image : john.gif\n');
        test.ok(accepted, 'accept gif image command with space');

        test.done();
    },
    'warning command': function (test) {
        test.expect(1);

        // tests here
        testLine('!warning: Be careful !!!\n');
        test.ok(accepted, 'series of addition are accepted');


        test.done();
    },
    'unknown command': function (test) {
        test.expect(1);

        // tests here
        testLine('!fail : Unknown command\n');
        test.ok(!accepted, 'this command is unknown');


        test.done();
    }
}
