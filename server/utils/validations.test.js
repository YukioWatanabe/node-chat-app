const expect = require('expect');

const { isRealString } = require('./validations');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var nonString = 12345;

        expect(isRealString(nonString)).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var emptyString = '      ';

        expect(isRealString(emptyString)).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        var realString = 'L O R D';

        expect(isRealString(realString)).toBe(true);
    });
});