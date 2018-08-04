import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';
import KeyHolder from '../build/KeyHolder';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import {utils, Contract} from 'ethers';

chai.use(chaiAsPromised);

const {expect} = chai;

describe('Identity', async () => {
  let provider;
  let wallet;
  let otherWallet;
  let identity;
  let acctSha3;
  
  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    identity = await deployContract(wallet, KeyHolder);  
    acctSha3 = utils.keccak256(wallet.address);
  });

  describe('Keys', async () => {
    it('should set a default MANAGEMENT_KEY', async () => {
      const key = await identity.getKey(acctSha3);
      expect(key.purpose.eq('1')).to.be.true;
      expect(key.keyType.eq('1')).to.be.true;
      expect(key.key).to.eq(acctSha3);
    });

    it('should respond to getKeyPurpose', async () => {
      const purpose = await identity.getKeyPurpose(acctSha3);
      expect(purpose.eq('1')).to.be.true;
    });

    it('should respond to getKeysByPurpose', async () => {
      const keys = await identity.getKeysByPurpose(1);
      expect(keys).to.deep.eq([acctSha3]);
    });

    it('should add key', async () => {
      const newKey = utils.hexlify(utils.randomBytes(32));      
      await identity.addKey(newKey, 1, 1);
      const getKey = await identity.getKey(newKey);
      assert.equal(getKey.key, newKey);
    });

    it('should not allow an existing key to be added', async () => {
      await expect(identity.addKey(acctSha3, 1, 1)).to.be.eventually.rejected;
    });

    it('should not allow sender without MANAGEMENT_KEY to addKey', async () => {
      const identityWithOtherWallet = new Contract(identity.address, KeyHolder.interface, otherWallet);
      const newKey = utils.hexlify(utils.randomBytes(32));      
      await expect(identityWithOtherWallet.addKey(newKey, 1, 1)).to.be.eventually.rejected;
    });
  });
});
