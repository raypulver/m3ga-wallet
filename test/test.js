'use strict';

const { expect } = require('chai');
const koolRpcCall = require('kool-makerpccall');
const rpcCall = (method, params) => koolRpcCall('http://localhost:8545', method, params);
const bytecodeRunnerBytecode = require('../build/BytecodeRunner');
const easySolc = require('../easy-solc');
const { toHex } = require('web3-utils');
describe('arb bytecode runner', () => {
  it('runs bytecode', async () => {
    const [ address ] = await rpcCall('eth_accounts');
    const creationTxHash = await rpcCall('eth_sendTransaction', [{
      from: address,
      gas: toHex(5e6),
      gasPrice: toHex(1),
      data: bytecodeRunnerBytecode
    }]);
    const { contractAddress } = await rpcCall('eth_getTransactionReceipt', [ creationTxHash ]);
    const compileOutput = easySolc('Payload', `
      pragma solidity >= 0.5.0;
      contract Payload {
        function() external payable {
          msg.sender.transfer(msg.value / 2);
        }
        function kill() external {
          selfdestruct(msg.sender);
        }
      }
    `).bytecode;
    const sendPayloadTxHash = await rpcCall('eth_sendTransaction', [{
      from: address,
      gas: toHex(5e6),
      gasPrice: toHex(1),
      value: toHex('200000000000000000'),
      to: contractAddress,
      data: compileOutput
    }]);
    expect(await rpcCall('eth_getBalance', [ contractAddress, 'latest' ])).to.eql(toHex('100000000000000000'));
  });
});
