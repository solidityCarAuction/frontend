import Web3 from "web3";
import { abi } from "./dataset/abi";
import { Contract } from "web3-eth-contract";

// web3 소켓 통신 시작
export const web3: Web3 = new Web3("ws://localhost:7545");

// 입찰자 변수
export let bidder: string | null = null;
export const auctionOwner: string | null = null;
export const userWalletAddress: string = "0x13145647Ba4E98F05345D2aF3792EEA5c36f25C4"; // 유저의 지갑주소
export const contractAddress: string = "0xb1cd234a03aa5A0054ef9Af369A8840eeB2033c8"; // 배포된 컨트랙트의 주소값

// 바이너리 코드를 abi구조로 해석 후, 메서드 추출
export const auctionContract: Contract = new web3.eth.Contract(abi, contractAddress);

// web3 init
export const web3Init = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      web3.defaultAccount = accounts[0];
      bidder = accounts[0];

      return accounts;
    }
  } catch (e: unknown) {
    console.error(e);
  }
};
