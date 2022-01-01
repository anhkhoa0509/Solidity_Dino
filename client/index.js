const Web3 = require("web3");
const Coin = require("./contracts/ZombieFactory.json");

const bg = [
  "./Image/Background/Black#1.png",
  "./Image/Background/Blue#1.png",
  "./Image/Background/Green#1.png",
  "./Image/Background/Red#1.png",
];
const body = [
  "./Image/Body/1#1.png",
  "./Image/Body/2#1.png",
  "./Image/Body/3#1.png",
  "./Image/Body/4#1.png",
  "./Image/Body/5#1.png",
];
const clothes = [
  "./Image/Clothes/1#5.png",
  "./Image/Clothes/2#5.png",
  "./Image/Clothes/3#5.png",
  "./Image/Clothes/4#5.png",
  "./Image/Clothes/5#5.png",
  "./Image/Clothes/6#5.png",
  "./Image/Clothes/7#5.png",
  "./Image/Clothes/8#5.png",
  "./Image/Clothes/9#5.png",
  "./Image/Clothes/10#5.png",
  "./Image/Clothes/11#5.png",
];

const eye = [
  "./Image/Eye/Cyan#1.png",
  "./Image/Eye/Green#1.png",
  "./Image/Eye/Pink#1.png",
  "./Image/Eye/Purple#1.png",
  "./Image/Eye/Red#1.png",
  "./Image/Eye/Yellow#10.png",
];
const head = [
  "./Image/Headdress/1#1.png",
  "./Image/Headdress/2#1.png",
  "./Image/Headdress/3#1.png",
  "./Image/Headdress/4#1.png",
  "./Image/Headdress/5#1.png",
  "./Image/Headdress/6#1.png",
  "./Image/Headdress/7#1.png",
  "./Image/Headdress/8#1.png",
  "./Image/Headdress/9#1.png",
  "./Image/Headdress/10#1.png",
  "./Image/Headdress/11#1.png",
  "./Image/Headdress/12#1.png",
];
const mouth = [
  "./Image/Mouth/1#20.png",
  "./Image/Mouth/2#20.png",
  "./Image/Mouth/3#20.png",
  "./Image/Mouth/4#20.png",
  "./Image/Mouth/5#20.png",
  "./Image/Mouth/6#20.png",
  "./Image/Mouth/7#20.png",
  "./Image/Mouth/8#20.png",
  "./Image/Mouth/9#20.png",
];
const stuff = [
  "./Image/Stuff/1#50.png",
  "./Image/Stuff/2#50.png",
  "./Image/Stuff/3#50.png",
  "./Image/Stuff/4#50.png",
  "./Image/Stuff/5#50.png",
  "./Image/Stuff/6#50.png",
];
init = async () => {
  const web3 = new Web3("http://127.0.0.1:9545/");
  const contract = await new web3.eth.Contract(
    Coin.abi,
    "0x5eDD1fe3710910448F1b0721D6dF347951f9BD33"
  );

  const symbol = await contract.methods.dnaDigits().call();
  //    Tạo zombie
    await contract.methods
      .createRandomZombie("ble6")
      .send({ from: "0x0b66e4a227eb875566ef61859fa67faa3378dfe2", gas: 3000000 });
  // Lấy tất cả zombie mà tài khoản này sở hữu

  async function renderListZombie() {
    let list = await contract.methods
      .getZombiesByOwner("0x0b66e4a227eb875566ef61859fa67faa3378dfe2")
      .call();
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].length; j++) {
        if (j == 1) {
          const itemBg = (+list[i][j].slice(0, 2) % bg.length) + 1;
          const itemBody = (+list[i][j].slice(0, 2) % body.length) + 1;
          const itemClothes = (+list[i][j].slice(0, 2) % clothes.length) + 1;
          const itemEye = (+list[i][j].slice(0, 2) % eye.length) + 1;
          const itemMouth = (+list[i][j].slice(0, 2) % mouth.length) + 1;
          const itemStuff = (+list[i][j].slice(0, 2) % stuff.length) + 1;
          console.log(
            itemBg,
            itemBody,
            itemClothes,
            itemEye,
            itemMouth,
            itemStuff
          );
        }
      }
    }
  }
  renderListZombie();
};
init();
