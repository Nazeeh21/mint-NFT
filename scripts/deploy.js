const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('NazeehNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log('Contract deployed to: ', nftContract.address);

  let txn = await nftContract.makeAnEpicNFT()
  await txn.wait();

  console.log('NFT minted');
};

const runMain = async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
