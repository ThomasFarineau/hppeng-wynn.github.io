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
    let internalNames = _.map(names, (key) =>
      _.camelCase(res.data[key]['internalName'])
    );

    fs.readFile(path.join(__dirname, 'id_item_mapping.json'), (err, data) => {
      if (err) throw err;
      fs.writeFileSync(path.join(__dirname, 'id_item_mapping_old.json'), data);
      let result = JSON.parse(data);
      let lastValue = _.max(_.values(result)) || 0;

      const diff = _.difference(internalNames, _.keys(result));

      for (let i = 0; i < diff.length; i++) {
        result[diff[i]] = ++lastValue;
      }

      fs.writeFileSync(
        path.join(__dirname, 'id_item_mapping.json'),
        JSON.stringify(result, null, 2)
      );
    });
  } catch (error) {
    console.error('Error fetching item database:', error);
  }
};

main();
