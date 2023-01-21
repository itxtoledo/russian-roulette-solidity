import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const ZERO_DOT_ONE_ETHER = ethers.constants.WeiPerEther.div(10);

describe("RussianRoulette", function () {
  async function deployOneYearLockFixture() {
    const accounts = await ethers.getSigners();

    const RussianRouletteFactory = await ethers.getContractFactory(
      "RussianRoulette"
    );
    const RussianRoulette = await RussianRouletteFactory.connect(accounts[10]).deploy();

    return { RussianRoulette, accounts };
  }

  describe("Play", function () {
    it("Should work perfectly", async function () {
      const { RussianRoulette, accounts } = await loadFixture(
        deployOneYearLockFixture
      );

      const balanceBefore: {
        [address: string]: string;
      } = {};

      const balanceAfter: {
        [address: string]: string;
      } = {};

      for (let player = 1; player <= 6; player++) {
        const acc = accounts[player - 1];

        balanceBefore[acc.address] = ethers.utils.formatUnits(
          await acc.getBalance(),
          "ether"
        );

        if (player != 6) {
          await expect(
            RussianRoulette.connect(acc).enter({
              value: ZERO_DOT_ONE_ETHER,
            })
          ).to.emit(RussianRoulette, "PlayerJoined");
        } else {
          await expect(
            RussianRoulette.connect(acc).enter({
              value: ZERO_DOT_ONE_ETHER,
            })
          )
            .to.emit(RussianRoulette, "PlayerJoined")
            .to.emit(RussianRoulette, "Victim");
        }

        balanceAfter[acc.address] = ethers.utils.formatUnits(
          await acc.getBalance(),
          "ether"
        );
      }

      console.log("Balance Before");
      console.table(balanceBefore);

      console.log("Balance After");
      console.table(balanceAfter);
    });
  });
});
