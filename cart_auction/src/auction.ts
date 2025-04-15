import Web3 from "web3";
import { abi } from "./dataset/abi";

// web3 소켓 통신 시작
const web3 = new Web3("ws://localhost:7545");

let bidder: string; // 입찰자 변수
const userWalletAddress = "0xc5912c5b377cD50743c4649c112F24f7E4364a6f"; // 입찰자의 지갑주소

// 바이너리 코드를 abi구조로 해석 후, 메서드 추출
const auctionContract = new web3.eth.Contract(abi);
// 배포된 컨트랙트의 주소값
auctionContract.options.address = "0xf7a51106F216540187f9ed3DACec67C5DcfD1B99";

// web3 init
export const web3Init = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    web3.defaultAccount = accounts[0]; // 첫번째 지갑주소를 default로 넣기.
    bidder = accounts[0]; // 첫번째 지갑주소를 default 입찰자로 설정

    // quitAuction();
    bid(userWalletAddress);
    getHighestBidder();
    getHighestBid();
    getAuctionState();
    getActionItemData();
    getBids();
  } catch (e) {
    console.error(e);
  }
};

// 경매 끝내는 함수
const quitAuction = async () => {
  try {
    const res = await auctionContract.methods.auction_end().call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 최고가 입찰자 정보 가져오는 함수
const getHighestBidder = async () => {
  try {
    const res = await auctionContract.methods.highestBidder().call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 최고가 입찰가를 가져오는 함수
const getHighestBid = async () => {
  try {
    const res = await auctionContract.methods.highestBid().call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 옥션의 상태를 가져오는 함수
const getAuctionState = async () => {
  try {
    const res = await auctionContract.methods.STATE().call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 옥션에 올라와있는 매물을 가져오는 함수 (지금은 자동차로 고정)
const getActionItemData = async () => {
  try {
    const res = await auctionContract.methods.Mycar().call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 나의 입찰가 정보를 가져오는 함수
const getBids = async () => {
  try {
    const res = await auctionContract.methods.bids(bidder).call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

interface IMsg {
  msg: string;
  hash: string;
}

// 이벤트리스너용 함수
const bid = async (userWalletAddress: string) => {
  const mybid = "10";

  try {
    const res = await auctionContract.methods.bid().send({
      from: userWalletAddress,
      value: web3.utils.toWei(mybid, "ether"),
      gas: 2000000,
    });

    const successMsg: IMsg = {
      msg: "성공적으로 입찰되었습니다!",
      hash: res.transactionHash,
    };

    return successMsg;
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      return e.message;
    }
    return "입찰 실패";
  }
};
