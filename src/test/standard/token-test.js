import Token from '../../lib/standard/token';
import stream from '../../lib/stream/index';
import P from '../../lib/parsec/parser';

let value = undefined;
let accepted = undefined;
let parsing = null;

function testAParser(parser, string) {
    let myStream = stream.ofString(string);
    parsing = parser.parse(myStream);

    value = parsing.value;
    accepted = parsing.isAccepted();

    console.info('parsing', parsing, '\n');
}

export default {
    setUp: function (done) {
        done();
    },

    'test blank': function (test) {
        test.expect(1);

        testAParser(Token.blank(), '  \t   ');
        test.equals('', value, '`blank` must resolve control characters as a void string')

        test.done();
    },

    'rawTextUntilChar': function (test) {
        test.expect(4);

        // read the text until the stop character
        testAParser(Token.rawTextUntilChar('*'), '123456*789');
        test.equals('123456', value
            , '`rawTextUntilChar` should return "123456"');

        // read the text until ANY of the stop characters (here, "-")
        testAParser(Token.rawTextUntilChar('*-'), '987654-321');
        test.equals('987654', value
            , '`rawTextUntilChar` should return "987654"');

        //
        testAParser(Token.rawTextUntilChar('*-'), '*');
        test.ok(!accepted, "`rawTextUntilChar('*-')') should reject '*' as an empty string");


        testAParser(Token.rawTextUntilChar('*-', true), '*');
        test.equals('', value
            , "`rawTextUntilChar('*-', true)') should accept '*' as an empty string");

        test.done();
    },

    'test eol': function (test) {
        test.expect(2);

        // tests here
        testAParser(Token.eol(), '\n');
        test.equals('\n', value, '`eol` must accept \\n and return \\n')

        testAParser(Token.eol(), ' \n');
        test.ok(!accepted, '`eol` must reject any chain that does not start with \\n')

        test.done();
    },


    'test combination of token': function (test) {
        test.expect(1);

        // tests here
        let parser = Token.rawTextUntilChar('*')
            .thenLeft(P.char('*'))
            .thenLeft(Token.blank())
            .then(Token.rawTextUntilChar('-'))
            .thenLeft(P.char('-'))
            .then(Token.eol())
            .flattenDeep()
        testAParser(parser, 'toto* tata-\n');

        const expected = ['toto', 'tata', '\n']


        test.deepEqual(expected, value, 'combination failed')


        test.done();
    },


    'test fourSpacesBlock1': function (test) {
        testAParser(Token.fourSpacesBlock(), 'foo     bar');
        test.ok(!accepted, 'fourSpacesBlock must reject anything not starting with a 4 spaces block or equivalent ')
        test.done();
    },

    'test fourSpacesBlock2': function (test) {
        testAParser(Token.fourSpacesBlock(), '    ');
        test.ok(accepted, 'fourSpacesBlock must accept 4 spaces')
        test.done();
    },

    'test fourSpacesBlock3': function (test) {
        testAParser(Token.fourSpacesBlock(), '\t');
        test.ok(accepted, 'fourSpacesBlock must accept tab character')
        test.done();
    },

    'test fourSpacesBlock': function (test) {
        testAParser(Token.fourSpacesBlock(), '  \u00A0  ');
        test.ok(accepted, 'fourSpacesBlock must accept a mix of breakable and non-breakable spaces')
        test.done();
    },

/*    'test words': function (test) {
        testAParser(Token.words(), 'Some things are\n ok.');
        const expected = ['Some', 'things', 'are', 'ok'];
        test.deepEqual(expected, value, 'words are not separated');
        test.done();
    },

    'test wordsUntil': function (test) {
        const stop = P.try(P.string('-stop-')).or(P.string('-STOP-'));
        testAParser(Token.wordsUntil(stop), 'Some things are\n ok but -STOP- is needed.');
        const expected = ['Some', 'things', 'are', 'ok', 'but'];
        test.deepEqual(expected.toString(), value.toString(), 'words are not stopped');
        test.done();
    },
*/

    'expect (try and wordsUntil) to not be consumed': function (test) {
        const stop = P.try(P.string('-stop-')).or(P.string('-STOP-'));
        const doc = 'Some things are\n ok but -STOP- this is out of offset.';
        testAParser(Token.wordsUntil(stop), doc);
        const expected = parsing.offset < doc.length;
        console.log(parsing.offset, doc.length);

        test.equal(true, expected, 'offset is not stopped at -STOP-');
        test.done();
    },
    'expect  wordsUntil to  be rejected if no end': function (test) {
        const stop = P.try(P.string('-stop-')).or(P.string('-STOP-'));
        const doc = 'Some things are ok but there is no clear stop here.';
        testAParser(Token.wordsUntil(stop), doc);
        const expectedOffset = doc.length;

        test.ok( !parsing.isAccepted(), "Parsing is not rejected with no stop found");
        test.equal(expectedOffset, parsing.offset, 'offset is not set at the end');
        test.done();
    },
    'expect (stringIn) to not be accepted with many strings': function (test) {


        const doc = 'James Bond series, by writer Ian Fleming';

        testAParser(Token.stringIn(['James', 'Jack', 'John']), doc);
        const expectedOffset = 5;

        test.equal(expectedOffset, parsing.offset, 'offset is not stopped at expectedString');
        test.equal('James', parsing.value, 'value is not set to the found string');
        test.done();
    },
    'expect (stringIn) to not be accepted with one strings': function (test) {


        const doc = 'Jack is there';

        testAParser(Token.stringIn(['Jack']), doc);
        const expectedOffset = 4;

        test.equal(expectedOffset, parsing.offset, 'offset is not stopped at expectedString');
        test.equal('Jack', parsing.value, 'value is not set to the found string');
        test.done();
    },
    'expect (stringIn) to not be accepted with empty array': function (test) {


        const doc = 'Jack is there';

        testAParser(Token.stringIn([]), doc);
        const expectedOffset = 0;

        test.equal(expectedOffset, parsing.offset, 'offset is not stopped at expectedString');
        test.equal(undefined, parsing.value, 'value is not undefined for empty search');
        test.done();
    },
    'expect (stringIn) to not be rejected with many strings': function (test) {


        const doc = 'The James Bond series, by writer Ian Fleming';

        testAParser(Token.stringIn(['James', 'Jack', 'John']), doc);
        const expectedOffset = 0;

        test.equal(expectedOffset, parsing.offset, 'stream has moved offset');
        test.equal(undefined, parsing.value, 'value is not undefined');
        // TODO : test is parsing.isAccepted()
        test.done();
    }



}