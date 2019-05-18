'use strict';

const solc = require('solc');

module.exports = (contractName, src) => {
  const out = JSON.parse(solc.compile(JSON.stringify({
    language: 'Solidity',
    sources: {
      [ contractName + '.sol' ]: {
        content: src
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': [ '*' ]
        }
      }
    }
  })));
  if (out.errors && out.errors.length) {
    const toThrow = new Error('solc error, see "errors" property');
    toThrow.errors = out.errors;
    throw toThrow;
  }
  const evm = out.contracts[contractName + '.sol'][contractName].evm;
  const {
    bytecode: {
      object: bytecode
    },
    deployedBytecode: {
      object: deployedBytecode
    }
  } = evm;
  return {
    bytecode: '0x' + bytecode,
    deployedBytecode: '0x' + deployedBytecode
  };
};
