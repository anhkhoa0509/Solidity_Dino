import { useState, useEffect } from "react";
// import Login from "./components/Login/Login";
import { ethers } from "ethers";
import Web3 from "web3";
import Coin from "./contracts/ZombieFactory.json";
const bg = [
  "/image/background/Black.png",
  "/image/background/Blue.png",
  "/image/background/Green.png",
  "/image/background/Red.png",
];
const body = [
  "/image/Body/1.png",
  "/image/Body/2.png",
  "/image/Body/3.png",
  "/image/Body/4.png",
  "/image/Body/5.png",
];
const clothes = [
  "/image/Clothes/1.png",
  "/image/Clothes/2.png",
  "/image/Clothes/3.png",
  "/image/Clothes/4.png",
  "/image/Clothes/5.png",
  "/image/Clothes/6.png",
  "/image/Clothes/7.png",
  "/image/Clothes/8.png",
  "/image/Clothes/9.png",
  "/image/Clothes/10.png",
  "/image/Clothes/11.png",
];

const eye = [
  "/image/Eye/Cyan.png",
  "/image/Eye/Green.png",
  "/image/Eye/Pink.png",
  "/image/Eye/Purple.png",
  "/image/Eye/Red.png",
  "/image/Eye/Yellow.png",
];
const head = [
  "/image/Headdress/1.png",
  "/image/Headdress/2.png",
  "/image/Headdress/3.png",
  "/image/Headdress/4.png",
  "/image/Headdress/5.png",
  "/image/Headdress/6.png",
  "/image/Headdress/7.png",
  "/image/Headdress/8.png",
  "/image/Headdress/9.png",
  "/image/Headdress/10.png",
  "/image/Headdress/11.png",
  "/image/Headdress/12.png",
];
const mouth = [
  "/image/Mouth/1.png",
  "/image/Mouth/2.png",
  "/image/Mouth/3.png",
  "/image/Mouth/4.png",
  "/image/Mouth/5.png",
  "/image/Mouth/6.png",
  "/image/Mouth/7.png",
  "/image/Mouth/8.png",
];
const stuff = [
  "/image/Stuff/1.png",
  "/image/Stuff/2.png",
  "/image/Stuff/3.png",
  "/image/Stuff/4.png",
  "/image/Stuff/5.png",
  "/image/Stuff/6.png",
];
function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [nameDino, setNameDino] = useState("");
  const [listDino, setListDino] = useState([]);
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  useEffect(() => {
    async function fetchData() {
      const web3 = new Web3("http://127.0.0.1:7545/");
      const contract = await new web3.eth.Contract(
        Coin.abi,
        "0x7042372226162261D62F238F0C6e195B9954D7Fc"
      );
      setWeb3(web3);
      setContract(contract);
      reRenderList();
    }
    fetchData();
  }, []);

  useEffect(() => {
    reRenderList();
    console.log('account change')
  }, [defaultAccount]);
  
  const reRenderList = async () => {
    console.log('reRenderList',defaultAccount)
    if (typeof defaultAccount != "string") {
      setDefaultAccount(defaultAccount[0])
      let list = await contract.methods
        .getZombiesByOwner(defaultAccount[0])
        .call();
      renderListDino(list);
    } else {
      let list = await contract.methods
        .getZombiesByOwner(defaultAccount)
        .call();
      renderListDino(list);
      console.log("reRender", list);
    }
  };

  const connectWalletHandler = () => {
    console.log("goi connect");
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          getAccountBalance(result[0]);
          console.log(defaultAccount);
          reRenderList();
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    connectWalletHandler();
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const renderListDino = (list) => {
    setListDino([]);
    for (let i = 0; i < list.length; i++) {
      console.log("name", list[i][0], "dna", list[i][1], "index", list[i][2]);
      const itemBg = +list[i][1].slice(0, 2) % bg.length;
      const itemBody = +list[i][1].slice(2, 4) % body.length;
      const itemClothes = +list[i][1].slice(4, 6) % clothes.length;
      const itemEye = +list[i][1].slice(6, 8) % eye.length;
      const itemMouth = +list[i][1].slice(8, 10) % mouth.length;
      const itemStuff = +list[i][1].slice(10, 12) % stuff.length;
      const itemHead = +list[i][1].slice(12, 14) % head.length;
      console.log(list);
      setListDino((oldArray) => [
        ...oldArray,
        {
          itemBg: bg[itemBg],
          itemBody: body[itemBody],
          itemClothes: clothes[itemClothes],
          itemEye: eye[itemEye],
          itemMouth: mouth[itemMouth],
          itemStuff: stuff[itemStuff],
          itemHead: head[itemHead],
          name: list[i][0],
          dna: list[i][1],
          index: list[i][2],
          attack: (+list[i][1].slice(0, 2) % bg.length) *1000,
          defense: (+list[i][1].slice(2, 4) % body.length + 1) * 200,
          rare: +list[i][1].slice(6, 8) % eye.length,
        },
      ]);
    }
  };

  const addDino = async () => {
    if (!nameDino) {
      alert("Tên rỗng");
    } else {
      await contract.methods.createRandomZombie(nameDino).send({
        from: defaultAccount,
        gas: 3000000,
      });
      console.log("da qua adddino");
      let list = await contract.methods
        .getZombiesByOwner(defaultAccount)
        .call();
      renderListDino(list);
      setNameDino("");
    }
  };

  const TransferDino = async (index) => {
    console.log(defaultAccount, address, +index);
    await contract.methods
      .transferFrom(defaultAccount, address, +index)
      .send({
        from: defaultAccount,
      })
      .then((value) => {
        alert("Chuyển khủng long thành công!!!");
        connectWalletHandler()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    renderList();
  }, [listDino]);
  const renderList = () => {
    if (listDino.length > 0) {
      return listDino.map((item) => {
        return (
          <div className="card col-xl-3 mr-4 mb-4 ">
            <div
              className="listDino "
              style={{ position: "relative", height: "400px" }}
            >
              <img
                src={item.itemBody}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "2",
                }}
              />

              <img
                src={item.itemBg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "1",
                }}
              />
              <img
                src={item.itemClothes}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "3",
                }}
              />
              <img
                src={item.itemEye}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "3",
                }}
              />
              <img
                src={item.itemHead}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "3",
                }}
              />
              <img
                src={item.itemMouth}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "3",
                }}
              />
              <img
                src={item.itemStuff}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  zIndex: "3",
                }}
              />
            </div>
            <div className="card-body">
              <p>
                <b>{item.name}</b>
              </p>
              <p className="card-text">
                <b>Sức tấn công</b>: {item.attack}
              </p>
              <p className="card-text">
                <b>Phòng thủ</b>: {item.defense}
              </p>
              <p className="card-text">
                <b>Độ hiếm</b>: {item.rare} / {clothes.length}
              </p>
              <p className="card-text">
                <b>DNA</b>: {item.dna}
              </p>
              <div className="text-center">
                <input
                  type="text"
                  name="address"
                  className="mt-2 mb-2"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  placeholder="Nhập địa chỉ người nhận"
                />
                <button
                  className="btn-success"
                  onClick={() => TransferDino(item.index)}
                >
                  Chuyển
                </button>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className="mt-4 pl-4 ">
          <input
            type="text"
            name="name"
            onChange={(e) => {
              setNameDino(e.target.value);
            }}
            placeholder="Nhập tên khủng long"
          />
          <button className="ml-4 mr-4 btn-success" onClick={addDino}>
            Thêm khủng long
          </button>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
          <div className="walletCard">
           
            <div className="accountDisplay mt-4">
              <h6>Address: {defaultAccount}</h6>
            </div>
            <div className="balanceDisplay">
              <h6>Balance: {userBalance}</h6>
            </div>
            {errorMessage}
          </div>
        </div>
        <h1>Danh sách khủng long bạn sở hữu:</h1>
        <div
          className="d-flex flex-wrap col-xl-12 justify-content-around"
          // style={{ height: "3000px" }}
        >
          {renderList()}
        </div>
      </div>
    </>
  );
}

export default App;
