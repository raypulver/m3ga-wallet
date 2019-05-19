'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

spawnSync(path.join(__dirname, 'node_modules', '.bin', 'mocha'), ['--timeout', '0'], { stdio: 'inherit' });
