import {Base64} from "./";

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

function parseEquipment(infoStr, versionNumber) {
    let equipment = Array(9).fill(null);
    let dataStr;
    if (versionNumber < 4) {
        for (let i = 0; i < 9; i++) {
            equipment[i] = getItemNameFromID(Base64.toInt(infoStr.slice(i * 3, i * 3 + 3)));
        }
        dataStr = infoStr.slice(27);
    } else {
        let startIdx = 0;
        for (let i = 0; i < 9; i++) {
            if (infoStr.charAt(startIdx) === '-') {
                equipment[i] = `CR-${infoStr.slice(startIdx + 1, startIdx + 18)}`;
                startIdx += 18;
            } else {
                const len = versionNumber <= 9 && infoStr.slice(startIdx, startIdx + 3) === 'CI-'
                    ? Base64.toInt(infoStr.slice(startIdx, startIdx + 3))
                    : 3;
                equipment[i] = getItemNameFromID(Base64.toInt(infoStr.slice(startIdx, startIdx + len)));
                startIdx += len;
            }
        }
        dataStr = infoStr.slice(startIdx);
    }
    return { equipment, dataStr };
}
*/
function parseSkillPoints(encodedData, versionNumber) {
    const skillPoints = Array(5).fill(0);

    if (versionNumber >= 2) {
        for (let i = 0; i < 5; i++) {
            skillPoints[i] = Base64.toIntSigned(encodedData.slice(i * 2, i * 2 + 2));
        }
        encodedData = encodedData.slice(10); // Modifier dataStr après avoir extrait les skill points
    }

    return {skillPoints, encodedData};
}

function parseLevel(encodedData, versionNumber) {
    let level = 106;

    if (versionNumber > 2) {
        level = Base64.toInt(encodedData.slice(0, 2));
        encodedData = encodedData.slice(2);
    }

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
export function decodeHash(v, hash) {
    if (!hash) {
        return {skillPoints: Array(5).fill(0), level: 106};
    }

    let info = hash.split("_");
    let version = info[0];
    let versionNumber = parseInt(version);
    let encodedData = info[1];

    let equipment = [null, null, null, null, null, null, null, null, null];

    let info_str = encodedData;
    let start_idx = 0;
    for (let i = 0; i < 9; ++i) {
        if (info_str.slice(start_idx, start_idx + 3) === "CR-") {
            equipment[i] = info_str.slice(start_idx, start_idx + 20);
            start_idx += 20;
        } else if (info_str.slice(start_idx + 3, start_idx + 6) === "CI-") {
            let len = Base64.toInt(info_str.slice(start_idx, start_idx + 3));
            equipment[i] = info_str.slice(start_idx + 3, start_idx + 3 + len);
            start_idx += (3 + len);
        } else {
            let equipment_str = info_str.slice(start_idx, start_idx + 3);
            equipment[i] = Base64.toInt(equipment_str);
            start_idx += 3;
        }
    }
    console.log(equipment)

    encodedData = encodedData.substring(27);

    const skillPointsResult = parseSkillPoints(encodedData, versionNumber);
    const levelResult = parseLevel(skillPointsResult.encodedData, versionNumber);
    console.log(levelResult.encodedData)

    return {skillPoints: skillPointsResult.skillPoints, level: levelResult.level};
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
