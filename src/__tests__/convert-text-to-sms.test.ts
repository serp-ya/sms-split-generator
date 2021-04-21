import * as txtgen  from 'txtgen';
import { DELIMETER, MESSAGE_LENGTH } from '../constants';
import { convertTextToSMS } from '../convert-text-to-sms';
import { convertTextToSMSViaFP } from '../convert-text-to-sms-fp';
import { TConvertTextToSms } from '../types';

const SHORT_TEXT = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
const LONG_TEXT = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sitamet posuere risus';

const testFunctions = (data: string, expectedresult: string[]) => [
    convertTextToSMS,
    convertTextToSMSViaFP,
].forEach((testedFunction: TConvertTextToSms) => (
    expect(testedFunction(data, DELIMETER, MESSAGE_LENGTH)).toStrictEqual(expectedresult)
));

describe('Manual testing of the convert-text-to-sms.ts & convert-text-to-sms-fp.ts functions', () => {
    it(`Return text in array if text.len < ${MESSAGE_LENGTH}`, () => {
        testFunctions(SHORT_TEXT, [SHORT_TEXT]);
    });

    it(`Return prepared SMS with suffixes if text.len > ${MESSAGE_LENGTH}`, () => {
        const expectedResult = [
            `Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut 1/2`,
            `suscipit velit efficitur eget Sed sitamet posuere risus 2/2`
        ];

        testFunctions(LONG_TEXT, expectedResult);
    });
});

describe('Testing with tests generator of the convert-text-to-sms.ts & convert-text-to-sms-fp.ts functions', () => {
    it(`Has no sms > ${MESSAGE_LENGTH} length`, () => {
        const COUNT_OF_TESTS = 1000;
        const COUNT_OF_SENTENCE = 1000;
    
        for(let i = 0; i < COUNT_OF_TESTS; i++) {
            const randomText = txtgen.paragraph(COUNT_OF_SENTENCE);

            const sms = convertTextToSMS(randomText, DELIMETER, MESSAGE_LENGTH);
            const smsHasIncorrectLength = sms.some(sms => sms.length > MESSAGE_LENGTH);
            expect(smsHasIncorrectLength).toBeFalsy();
            
            const smsViaFP = convertTextToSMSViaFP(randomText, DELIMETER, MESSAGE_LENGTH);
            const smsViaFPHasIncorrectLength = smsViaFP.some(sms => sms.length > MESSAGE_LENGTH);
            expect(smsViaFPHasIncorrectLength).toBeFalsy();
        }
    });
});