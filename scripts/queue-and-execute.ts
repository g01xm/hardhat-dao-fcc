
import { ethers, network} from "hardhat";
import { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, developmentChains, MIN_DELAY} from '../helper-hardhat-config';
import {moveBlocks} from "../utils/move-blocks"
import {moveTime} from "../utils/move-time"

export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = await box.interface.encodeFunctionData(FUNC,args)
    const descriptionHash = await ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
   
    const governor = await ethers.getContract("GovernorContract")
    console.log("queueing....")
    const queueTx = await governor.queue([box.address],[0],[encodedFunctionCall],descriptionHash)
    await queueTx.wait(1)

    if(developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log("Executing....")

    const executeTx = await governor.execute([box.address],[0],[encodedFunctionCall],descriptionHash)

    await executeTx.wait(1)
    const boxNewvalue = await box.retrieve()

    console.log(`New Box Value: ${boxNewvalue.toString()}`)
}
queueAndExecute()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1)
})