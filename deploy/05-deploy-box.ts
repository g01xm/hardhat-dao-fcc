import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { ethers } from 'hardhat';


const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // code here
  const {getNamedAccounts, deployments, network} = hre;
  const {deploy, log, get} = deployments;
  const {deployer} = await getNamedAccounts();



  log("Deploying Box.....");
  const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations: 
  })
  log(`Deployed box to address ${box.address}`);

  const timeLock = await ethers.getContract("TimeLock")
  const boxContract = await ethers.getContractAt("Box", box.address)
  const transferOwnerTx =  await boxContract.transferOwnership(timeLock.address)
  await transferOwnerTx.wait(1)

  log(`You done it`);


};

export default deployBox;