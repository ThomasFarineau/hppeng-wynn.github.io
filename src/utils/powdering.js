import _ from 'lodash';
import {builderData} from '../data';

export function powderingData() {
  let powderIDs = new Map();
  let powderNames = new Map();
  let _powderID = 0;
  const elements = _.keys(builderData.powders);

  _.forEach(elements, (x) => {
    _.range(1, 7).forEach((i) => {
      powderIDs.set(x.toUpperCase() + i, _powderID);
      powderIDs.set(x + i, _powderID);
      powderNames.set(_powderID, {type: x, level: i});
      _powderID++;
    });
  });

  return powderNames;
}
