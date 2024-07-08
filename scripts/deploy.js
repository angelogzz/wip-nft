const { ethers } = require("hardhat");
const ipfsdata = require("../metadata/ipfs.json");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  [buyer, seller, inspector, lender] = await ethers.getSigners();

  const Mint = await ethers.getContractFactory("Mint");
  const mint = await Mint.deploy();
  await mint.deployed();
  console.log(`Deploy Mint Contract at: ${mint.address}`);
  console.log(`Minting 3 properties... \n`);

  // Supongamos que tienes un array de nombres de equipos
  const teams = ["TeamA", "TeamB", "TeamC", "TeamD"];

  for (let i = 0; i < 4; i++) {
    console.log(ipfsdata.data);
    // Agrega el precio de mint
    const transaction = await mint
      .connect(seller)
      .mint(ipfsdata.data[i], teams[i], {
        value: ethers.utils.parseEther("0.05"),
      });

    await transaction.wait();
  }

  const Main = await ethers.getContractFactory("Main");
  const main = await Main.deploy(
    mint.address,
    seller.address,
    inspector.address
  );
  await main.deployed();
  console.log(`Deploy Main at: ${main.address}`);

  // Ahora aprobamos el contrato Main para manejar los tokens
  for (let i = 0; i < 4; i++) {
    const transaction = await mint.connect(seller).approve(main.address, i + 1);
    await transaction.wait();
  }

  let transaction;
  transaction = await main
    .connect(seller)
    .list(1, buyer.address, tokens(0.01), tokens(0.01));
  await transaction.wait();
  transaction = await main
    .connect(seller)
    .list(2, buyer.address, tokens(0.01), tokens(0.01));
  await transaction.wait();
  transaction = await main
    .connect(seller)
    .list(3, buyer.address, tokens(0.01), tokens(0.01));
  await transaction.wait();
  transaction = await main
    .connect(seller)
    .list(4, buyer.address, tokens(0.005), tokens(0.005));
  await transaction.wait();

  console.log("Finished.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
