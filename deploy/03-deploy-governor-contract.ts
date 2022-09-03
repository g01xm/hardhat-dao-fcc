import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE} from '../helper-hardhat-config';

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // code here
  const {getNamedAccounts, deployments, network} = hre;
  const {deploy, log, get} = deployments;
  const {deployer} = await getNamedAccounts();

  const governanceToken = await get("GovernanceToken")
  const timeLock = await get("TimeLock")

  log("Deploying GovernorContract.....");
  const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE],
        log: true,
        // waitConfirmations: 
  })
  log(`Deployed governorContract to address ${governorContract.address}`);


};

export default deployGovernorContract;