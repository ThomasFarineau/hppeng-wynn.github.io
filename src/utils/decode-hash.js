import {Base64, getItemByID} from './';
import _ from 'lodash';
import {builderData} from '../data';

/*
function getItemNameFromID(id) { return idMap.get(id); }
/*
 * Load necessary data for a specific version.

async function loadVersionData(versionName) {
    const loadPromises = [
        load_atree_data(versionName),
        load_major_id_data(versionName),
        load_old_version(versionName),
        load_ings_old_version(versionName),
        load_tome_old_version(versionName)
    ];
    await Promise.all(loadPromises);
}

async function loadDefaultData(versionName) {
    const defaultLoadPromises = [
        load_atree_data(versionName),
        load_major_id_data(versionName),
        load_init(),
        load_ing_init(),
        load_tome_init()
    ];
    await Promise.all(defaultLoadPromises);
}
*/

async function parseEquipment(encodedData, versionNumber) {
  let equipmentIds = Array(9).fill(null);

  if (versionNumber < 4) {
    // For version numbers less than 4, decode equipment IDs directly from the encoded data
    equipmentIds = _.map(_.range(9), (i) =>
      Base64.toInt(encodedData.slice(i * 3, i * 3 + 3))
    );
    encodedData = encodedData.slice(27); // Remove processed part from encoded data
  } else {
    let startIdx = 0;
    // For version numbers 4 and above, handle different encoding schemes
    equipmentIds = _.map(_.range(9), () => {
      let item;
      if (encodedData.charAt(startIdx) === '-') {
        item = `CR-${encodedData.slice(startIdx + 1, startIdx + 18)}`;
        startIdx += 18;
      } else {
        const len =
          versionNumber <= 9 &&
          encodedData.slice(startIdx, startIdx + 3) === 'CI-'
            ? Base64.toInt(encodedData.slice(startIdx, startIdx + 3))
            : 3;
        item = Base64.toInt(encodedData.slice(startIdx, startIdx + len));
        startIdx += len;
      }

      return item;
    });
    encodedData = encodedData.slice(startIdx); // Remove processed part from encoded data
  }

  // Fetch equipment details asynchronously
  const equipmentsArray = await Promise.all(
    _.map(equipmentIds, async (id) => await getItemByID(id))
  );

  // Count occurrences of each equipment type
  const typeCounter = _.countBy(
    equipmentsArray,
    (equipment) => equipment.type || equipment.accessoryType
  );

  const equipments = {};

  // Initialize an index counter for each type
  const typeIndex = {};

  for (let i = 0; i < equipmentsArray.length; i++) {
    let equipment = equipmentsArray[i];

    if (equipment) {
      let type = equipment.type || equipment.accessoryType;
      if (builderData.types.weapon.includes(type)) type = 'weapon';

      if (!typeIndex[type]) {
        typeIndex[type] = 1;
      }

      if (typeCounter[type] > 1) {
        // If there are multiple items of the same type, append the index to the type
        equipments[`${type}${typeIndex[type]}`] = equipment;
        typeIndex[type]++;
      } else {
        // If there's only one item of this type, assign it directly
        equipments[type] = equipment;
      }
    }
  }

  return {equipments, encodedData};
}

function parseSkillPoints(encodedData) {
  const skillPoints = _.map(_.range(5), (i) =>
    Base64.toIntSigned(encodedData.slice(i * 2, i * 2 + 2))
  );
  encodedData = encodedData.slice(10);

  return {skillPoints, encodedData};
}

function parseLevel(encodedData) {
  let level = 106;

  level = Base64.toInt(encodedData.slice(0, 2));
  encodedData = encodedData.slice(2);

  return {level, encodedData};
}

/*
function parseTomes(dataStr, versionNumber) {
    let tomes = Array(versionNumber === 9 ? 8 : 7).fill(null);
    if (versionNumber >= 6) {
        const sliceLen = versionNumber < 8 ? 1 : 2;
        for (let i = 0; i < tomes.length; i++) {
            const tomeStr = dataStr.slice(i * sliceLen, (i + 1) * sliceLen);
            tomes[i] = getTomeNameFromID(Base64.toInt(tomeStr));
        }
        dataStr = dataStr.slice(tomes.length * sliceLen);
    }
    return { tomes, dataStr };
}
/*
function setValues(equipment, powdering, skillpoints, tomes, atreeData) {
    _.forEach(equipment, (item, i) => setValue(equipment_inputs[i], item));
    _.forEach(powdering, (powder, i) => setValue(powder_inputs[i], powder));
    _.forEach(skillpoints, (skp, i) => setValue(skp_order[i] + "-skp", skp));
    _.forEach(tomes, (tome, i) => setValue(tomeInputs[i], tome));

    if (atreeData) {
        atree_data = new BitVector(atreeData);
    } else {
        atree_data = null;
    }
}

async function handleVersionId(wynnVersionId) {
    if (isNaN(wynnVersionId) || wynnVersionId > WYNN_VERSION_LATEST || wynnVersionId < 0) {
        console.log("Explicit version not found or invalid, using latest version");
        wynnVersionId = WYNN_VERSION_LATEST;
    } else {
        console.log(`Build link for wynn version ${wynnVersionId} (${wynn_version_names[wynnVersionId]})`);
    }
    return wynnVersionId;
}

async function handleOldVersion(wynnVersionId) {
    if (wynnVersionId !== WYNN_VERSION_LATEST) {
        const msg = 'This build was created in an older version of wynncraft ' +
            `(${wynn_version_names[wynnVersionId]} < ${wynn_version_names[WYNN_VERSION_LATEST]}). ` +
            'Would you like to update to the latest version? Updating may break the build and ability tree.';
        if (!confirm(msg)) {
            await loadVersionData(wynn_version_names[wynnVersionId]);
        } else {
            wynnVersionId = WYNN_VERSION_LATEST;
        }
    }
    return wynnVersionId;
}
*/
export async function decodeHash(v, hash) {
  if (!hash) {
    return {skillPoints: Array(5).fill(0), level: 106};
  }

  let info = hash.split('_');
  let version = info[0];
  let versionNumber = parseInt(version);
  let encodedData = info[1];

  const equipmentResult = await parseEquipment(encodedData, versionNumber);
  const skillPointsResult = parseSkillPoints(equipmentResult.encodedData);
  const levelResult = parseLevel(skillPointsResult.encodedData);

  return {
    equipments: equipmentResult.equipments,
    skillPoints: skillPointsResult.skillPoints,
    level: levelResult.level
  };
}

export function processURI() {
  const urlParams = new URLSearchParams(window.location.search);
  const v = urlParams.get('v');
  const hash = window.location.hash.substring(1);

  if (v && localStorage.getItem('v') !== v) {
    localStorage.setItem('v', v);
  }

  if (hash && localStorage.getItem('hash') !== hash) {
    localStorage.setItem('hash', hash);
  }

  const storedV = localStorage.getItem('v');
  const storedHash = localStorage.getItem('hash');

  if (storedV && storedHash) {
    const newUrl = `${window.location.origin}${window.location.pathname}?v=${storedV}#${storedHash}`;
    window.history.replaceState({}, '', newUrl);
  }
}
