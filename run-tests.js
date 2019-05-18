'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

spawnSync(path.join(__dirname, 'node_modules', '.bin', 'mocha'), [], { stdio: 'inherit' });
