const NFTMarketPlace = artifacts.require("NFTMarketPlace");
const NFT = artifacts.require("NFT");


module.exports =  async function (deployer) {
  
  await deployer.deploy(NFTMarketPlace);
  const market = await NFTMarketPlace.deployed()
  await deployer.deploy(NFT,market.address);
}
