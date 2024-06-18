const fs = require('fs');
const axios = require('axios');
const path = require('node:path');
const _ = require('lodash');

const main = async () => {
  try {
    const res = await axios.get(
      'https://api.wynncraft.com/v3/item/database?fullResult'
    );
    const names = _.keys(res.data);
    let internalNames = _.mapValues(_.pick(res.data, names), (item) =>
      _.camelCase(item.internalName)
    );

    fs.readFile(path.join(__dirname, 'item_id_mapping.json'), (err, data) => {
      if (err) throw err;
      let result = JSON.parse(data);

      _.forEach(result, (value, key) => {
        const encodedKey = key;
        if (_.isUndefined(internalNames[encodedKey])) {
          result['removed_' + _.camelCase(key)] = value;
        } else {
          result[internalNames[encodedKey]] = value;
        }
        delete result[key];
        delete internalNames[encodedKey];
      });

      fs.writeFileSync(
        path.join(__dirname, '..', 'id_item_mapping.json'),
        JSON.stringify(result, null, 2)
      );
    });
  } catch (error) {
    console.error('Error fetching item database:', error);
  }
};

main();
