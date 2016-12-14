/**
 * Created by Simon on 13/12/2016.
 */

import CommandParser from '../../lib/standard/command-parser';
import TextParser from '../../lib/standard/text-parser';
import stream from '../../lib/stream/index';


let value = undefined;
let accepted = undefined;
let parser = null;



function getCombinedParser(){
    //TODO comment on fait des fonction statique?
        let parser1 = new CommandParser().getParser();
        let parser2 = new TextParser().getParser();
        return parser1.debug('command parser').or(parser2)
}


function testLine(line) {
    let myStream=stream.ofString(line);
    let parsing = parser.parse(myStream);

    console.info('parsing', parsing, '\n');
    value = parsing.value;
    accepted = parsing.isAccepted();
}

export default {
    setUp: function (done) {
        parser = getCombinedParser();
        done();
    },

    'test simple': function (test) {
        test.expect(1);

        // tests here
        testLine(' It is hot summer');
        test.ok(accepted, 'simple text');

        test.done();
    },



    'formatted text': function (test) {
        test.expect(1);
        let line=" je m'appelle *Zangra*, commandant du fort de *Belancio* qui domine la plaine d'où l'ennemi viendra et me fera **heros**\n"

        // tests here
        testLine(line);
        test.ok(accepted, 'formatted text');

        test.done();
    },

    'image command': function (test) {
        test.expect(2);

        const expected = {
            command : {
                type : 'image',
                value : 'john.jpg'
            }
        };

        testLine('!image: john.jpg\n');
        test.ok(accepted, 'accept image command');
        test.deepEqual(expected,value,  'image command object not equal expected object' )

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