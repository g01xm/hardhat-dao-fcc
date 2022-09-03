import { ethers, network} from "hardhat";
import { developmentChains, proposalsFile, VOTING_PERIOD} from '../helper-hardhat-config';
import {moveBlocks} from "../utils/move-blocks"
import * as fs from "fs"



const index = 0;
export async function main(proposalIndex: number) {
    const proposals =  JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    //0 = against, 1 = for, 2 = abstain
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const reason = "I like a do da cha cha"
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)
    if(developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Voted, ready to go")
}


main(index)
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1)
})