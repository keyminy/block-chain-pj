import { Contract, fromNano, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";

let bank: Contract<FactorySource["Bank3"]>;
let user: Contract<FactorySource["User3"]>;

let signer1: Signer;

describe("BankUserTest", async function () {
  before(async () => {
    signer1 = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy Bank and User", async function () {
      bank = await locklift.factory
        .deployContract({
          contract: "Bank3",
          initParams: {},
          constructorParams: {
            _interestRate: 5,
            // _owner: bank.address,
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);

      user = await locklift.factory
        .deployContract({
          contract: "User3",
          initParams: {},
          constructorParams: {
            _bank: bank.address,
            _initialBalance: 222,
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);
    });

    it("Interact with contract", async function () {
      const { traceTree } = await locklift.tracing.trace();
      await traceTree?.beautyPrint();
    });
  });
});
