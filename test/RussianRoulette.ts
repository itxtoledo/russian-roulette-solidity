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
    const RussianRoulette = await RussianRouletteFactory.connect(
      accounts[10]
    ).deploy();

    return { RussianRoulette, accounts };
  }

  describe("Play", function () {
    it("Should work perfectly", async function () {
      const { RussianRoulette, accounts } = await loadFixture(
        deployOneYearLockFixture
      );

      const balanceBefore: {
        [key: string]: string;
      } = {};

      const balanceAfter: {
        [key: string]: string;
      } = {};

      for (let player = 1; player <= 6; player++) {
        const acc = accounts[player - 1];

        balanceBefore[acc.address] = ethers.utils.formatUnits(
          await acc.getBalance(),
          "ether"
        );

        if (player == 6) {
          await expect(
            RussianRoulette.connect(acc).enter({ value: ZERO_DOT_ONE_ETHER })
          )
            .to.emit(RussianRoulette, "PlayerJoined")
            .to.emit(RussianRoulette, "Victim");
        } else {
          await expect(
            RussianRoulette.connect(acc).enter({ value: ZERO_DOT_ONE_ETHER })
          ).to.emit(RussianRoulette, "PlayerJoined");
        }
      }

      console.log("balanceBefore");
      console.table(balanceBefore);

      for (let player = 1; player <= 6; player++) {
        const acc = accounts[player - 1];

        balanceAfter[acc.address] = ethers.utils.formatUnits(
          await acc.getBalance(),
          "ether"
        );
      }

      console.log("balanceAfter");
      console.table(balanceAfter);
    });
  });
});
