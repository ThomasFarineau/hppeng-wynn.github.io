export const Base64 = (function () {
    const digitsStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
    const digits = digitsStr.split('');
    const digitsMap = Object.fromEntries(digits.map((char, i) => [char, i]));

    function fromIntBase(int32, n) {
        let result = '';
        for (let i = 0; i < n; ++i) {
            result = digits[int32 & 0x3f] + result;
            int32 >>= 6;
        }
        return result;
    }

    return {
        fromIntV: function (int32) {
            let result = '';
            do {
                result = digits[int32 & 0x3f] + result;
                int32 >>>= 6;
            } while (int32 !== 0);
            return result;
        },
        fromIntN: function (int32, n) {
            return fromIntBase(int32, n);
        },
        toInt: function (digitsStr) {
            return digitsStr.split('').reduce((acc, char) => (acc << 6) + digitsMap[char], 0);
        },
        toIntSigned: function (digitsStr) {
            let result = 0;
            if (digitsStr[0] && (digitsMap[digitsStr[0]] & 0x20)) {
                result = -1;
            }
            for (let i = 0; i < digitsStr.length; i++) {
                result = (result << 6) + digitsMap[digitsStr[i]];
            }
            return result;
        }
    };
})();
