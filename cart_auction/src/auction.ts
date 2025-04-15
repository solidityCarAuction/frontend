import Web3 from "web3";
import { abi } from "./dataset/abi";

// web3 소켓 통신 시작
const web3 = new Web3("ws://localhost:7545");

// 입찰자 변수
let bidder: string;

// 바이너리 코드를 abi구조로 해석 후, 메서드 추출
const auctionContract = new web3.eth.Contract(abi).methods;

// web3 init
export const web3Init = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    web3.defaultAccount = accounts[0]; // 첫번째 지갑주소를 default로 넣기.
    bidder = accounts[0]; // 첫번째 지갑주소를 default 입찰자로 설정

    quitAuction();
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
    const auctionEnd = await auctionContract.auction_end();
    const call = await auctionEnd.call();
    const res = call((result: string) => result);
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 최고가 입찰자 정보 가져오는 함수
const getHighestBidder = async () => {
  try {
    const highestBidder = await auctionContract.highestBidder();
    const call = await highestBidder.call();
    const res = await call((result: string) => result);

    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 최고가 입찰가를 가져오는 함수
const getHighestBid = async () => {
  try {
    const highestBid = await auctionContract.highestBid();
    const call = await highestBid.call();
    const res = await call((result: string) => result);

    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 옥션의 상태를 가져오는 함수
const getAuctionState = async () => {
  try {
    const auctionState = await auctionContract.STATE();
    const call = await auctionState.call();
    const res = await call((result: string) => result);

    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 옥션에 올라와있는 매물을 가져오는 함수 (지금은 자동차로 고정)
const getActionItemData = async () => {
  try {
    const carData = await auctionContract.Mycar();
    const call = await carData.call();
    const res = await call((result: string) => result);

    return res;
  } catch (e) {
    console.error(e);
  }
};

// 나의 입찰가 정보를 가져오는 함수
const getBids = async () => {
  try {
    const bids = await auctionContract.bids(bidder);
    const call = await bids.call();
    const res = await call((result: string) => result);

    return res;
  } catch (e) {
    console.error(e);
  }
};
