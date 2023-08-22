import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Account } from "everscale-standalone-client";

let sample: Contract<FactorySource["numSequence"]>;
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
        contract: "numSequence",
        publicKey: signer.publicKey,
        initParams: {
        },
        constructorParams: {
          len: 3
        },
        value: locklift.utils.toNano(20),//balance of contract
      });
      sample = contract;
      user = await locklift.factory.accounts
        .addNewAccount({
          type: WalletTypes.EverWallet,
          value: toNano(10),
          publicKey: signer.publicKey,
        })
        .then(res => res.account);
      expect(await locklift.provider.getBalance(sample.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Interact with contract", async function () {
      // destructing으로 표현가능
      let { arr } = await sample.methods.arr().call();
      console.log(arr); //[ '10', '233', '5' ]
      const sumArray = arr.map(Number)
        .reduce((a, b) => a + b, 0);
      console.log(sumArray); //248
      const { traceTree } = await locklift.tracing.trace(
        sample.methods.check({ inputNum: 275 }).sendExternal({ publicKey: signer.publicKey })
        );//transaction을 일으키기위해선 sendExternal에 publicKey를 같이 보내야한다
      await traceTree?.beautyPrint();//가독성 출력
      const { sum } = await sample.methods.sum().call();
      const { arr: newArr } = await sample.methods.arr().call();
      console.log('newArr: ', newArr); //[ '10', '233', '5' ]
      console.log('sum : ', sum);
      expect(Number(sum)).to.be.equal(sumArray);
    });
  });
});
