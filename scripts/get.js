const fs = require('fs');
const axios = require('axios');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { dirname } = require('node:path');
const _ = require('highland');

const CURR_WYNN_VERS = 2.0;

const fetchRecipe = (recipeId) => {
    return axios.get(`https://api.wynncraft.com/v2/recipe/get/${recipeId}`)
        .then(res => res.data.data)
        .catch(err => {
            console.error(`Error fetching recipe ${recipeId}`);
            return [];
        });
};

const main = async () => {
    let response = {}; // default to empty file output

    try {
        const res = await axios.get('https://api.wynncraft.com/v3/item/database?fullResult');
        response["items"] = res.data;

        const temp = await axios.get('https://api.wynncraft.com/v2/recipe/list');
        const recipeIds = temp.data.data;
        const recipes = [];
        for (const recipeId of recipeIds) {
            console.log(`Fetching recipe ${recipeIds.indexOf(recipeId) + 1}/${recipeIds.length}`);
            recipes.push(await fetchRecipe(recipeId));
            await new Promise(resolve => setTimeout(resolve, 1000));

        }
        response.recipes = recipes;

        /*
        const recipeStream = _(recipeIds)
            .map(recipeId => _(fetchRecipe(recipeId)))
            .parallel(10); // Adjust the parallelism level as needed

        const recipes = await recipeStream.toArray(Promise);

         */



        /* Uncomment the below sections if you need to fetch other types of data
        else if (target.toLowerCase() === 'ings') {
            response.ings = [];
            for (let i = 0; i < 4; i++) {
                const res = await axios.get(`https://api.wynncraft.com/v2/ingredient/search/tier/${i}`);
                response.ings = response.ings.concat(res.data.data);
            }
        } else if (target.toLowerCase() === 'recipes') {
            // Already handled by the parallel fetch
        } else if (target.toLowerCase() === 'terrs') {
            const res = await axios.get('https://api.wynncraft.com/public_api.php?action=territoryList');
            response = res.data.territories;

            const delkeys = ['territory', 'acquired', 'attacker'];
            for (const t in response) {
                delkeys.forEach(key => delete response[t][key]);
                response[t].neighbors = [];
            }

            const terrData = await axios.get('https://gist.githubusercontent.com/kristofbolyai/87ae828ecc740424c0f4b3749b2287ed/raw/0735f2e8bb2d2177ba0e7e96ade421621070a236/territories.json');
            const data = terrData.data;
            for (const t in data) {
                response[t].neighbors = data[t].Routes;
                response[t].resources = data[t].Resources;
                response[t].storage = data[t].Storage;
                response[t].emeralds = data[t].Emeralds;
                response[t].doubleemeralds = data[t].DoubleEmerald;
                response[t].doubleresource = data[t].DoubleResource;
            }
        } else if (target.toLowerCase() === 'maploc') {
            const res = await axios.get('https://api.wynncraft.com/public_api.php?action=mapLocations');
            response = res.data;
        } else {
            const res = await axios.get(target);
            response = res.data;
        }
        */

        response.version = CURR_WYNN_VERS;
        fs.writeFileSync(path.join(__dirname, "..", "src", "data", "output.json"), JSON.stringify(response));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

main();
