import _ from 'lodash';

export const Base64 = (function () {
  const digitsStr =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-';
  const digits = digitsStr.split('');
  const digitsMap = _.zipObject(digits, _.range(digits.length));

  function fromIntBase(int32, n) {
    return _.chain(_.range(n))
      .map(() => {
        const char = digits[int32 & 0x3f];
        int32 >>= 6;

        return char;
      })
      .reverse()
      .join('')
      .value();
  }

  return {
    fromIntV: function (int32) {
      let result = [];
      while (int32 !== 0) {
        result.unshift(digits[int32 & 0x3f]);
        int32 >>>= 6;
      }

      return result.join('');
    },
    fromIntN: function (int32, n) {
      return fromIntBase(int32, n);
    },
    toInt: function (digitsStr) {
      return _.reduce(
        digitsStr,
        (acc, char) => (acc << 6) + digitsMap[char],
        0
      );
    },
    toIntSigned: function (digitsStr) {
      let result = 0;
      if (digitsStr[0] && digitsMap[digitsStr[0]] & 0x20) {
        result = -1;
      }
      _.forEach(digitsStr, (char) => {
        result = (result << 6) + digitsMap[char];
      });

      return result;
    }
  };
})();
