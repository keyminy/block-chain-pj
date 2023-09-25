import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Account } from "everscale-standalone-client";

let sample: Contract<FactorySource["Fibonacci"]>;
let signer: Signer;
let user: Account;
describe("Test Sample contract", async function () {
  before(async () => {
    //signer : 계약을 실행하는 사람
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy contract", async function () {
      const INIT_STATE = 0;
      const { contract } = await locklift.factory.deployContract({
        contract: "Fibonacci",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: locklift.utils.getRandomNonce(),
        },
        constructorParams: {},
        value: locklift.utils.toNano(20), //balance of contract
      });
      sample = contract;
      /*I don't know exactly how to use this*/
      //   user = await locklift.factory.accounts
      //     .addNewAccount({
      //       type: WalletTypes.EverWallet,
      //       value: toNano(10),
      //       publicKey: signer.publicKey,
      //     })
      //     .then(res => res.account);
      //   expect(
      //     await locklift.provider
      //       .getBalance(sample.address)
      //       .then(balance => Number(balance)),
      //   ).to.be.above(0);
    });

    it("Interact with contract", async function () {
      const nextNumber = await sample.methods.calculateNextNumber().call();
      console.log(nextNumber);
      await sample.methods.setNumber({ _newNumber: nextNumber }).call();
    });
  });
});
