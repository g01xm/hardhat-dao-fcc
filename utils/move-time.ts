import { network } from "hardhat";

export async function moveTime(amount: number) {
    console.log("moving Time.....")
    await network.provider.send("evm_increaseTime", [amount])
    console.log(`moved forward ${amount} seconds.....`)
}