import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import * as prettier from 'prettier';
import {formatDistrict, formatHMT, PcaCode} from './utils';

let pcaCode: PcaCode[] = require('china-division/dist/pca-code.json');
const HMT = require('china-division/dist/HK-MO-TW');

pcaCode = pcaCode.concat(formatHMT(HMT));

const ROOT_DIR = resolve(__dirname, '../src');

const ANT_PCA_FILE = './ant-design-pca.ts';

const antPcaData = formatDistrict(pcaCode, {
  code: 'value',
  name: 'label',
  children: 'children'
});

console.log('export:data >> start');

// export pca
exportAntPcaData();
console.log(`export:data >> export ${ANT_PCA_FILE}`);

console.log('export:data >> prettier code');
prettierCode(resolve(ROOT_DIR, ANT_PCA_FILE));


// ----------------------------------------

function exportAntPcaData() {
  writeFileSync(
    resolve(ROOT_DIR, ANT_PCA_FILE),
    `
import { CascaderOption } from './types';

const district: CascaderOption[] = ${JSON.stringify(antPcaData)}

export default district;
`
  );
}

function prettierCode(source: string) {
  prettier.resolveConfig(resolve(__dirname, '../node_modules/@walrus/plugin-prettier/lib/prettier.config.js'))
    .then((options) => {
      const text = readFileSync(source, 'utf8');
      const formatted = prettier.format(text, { ...options, parser: 'babel' });
      writeFileSync(source, formatted)
    })
}
