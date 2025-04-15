import Web3 from "web3";
import { auctionInit } from "./methods";
import { abi } from "./dataset/abi";
import { Contract } from "web3-eth-contract";

// web3 소켓 통신 시작
export const web3: Web3 = new Web3("ws://localhost:7545");

// 입찰자 변수
export let bidder: string | null = null;
export const auctionOwner: string | null = null;
export const userWalletAddress: string = "0xc5912c5b377cD50743c4649c112F24f7E4364a6f";

// 바이너리 코드를 abi구조로 해석 후, 메서드 추출
export const auctionContract: Contract = new web3.eth.Contract(abi);

// 배포된 컨트랙트의 주소값
auctionContract.options.address = "0xf7a51106F216540187f9ed3DACec67C5DcfD1B99";

// web3 init
export const web3Init = async (): Promise<void> => {
  try {
    const accounts: string[] = await web3.eth.getAccounts();
    web3.defaultAccount = accounts[0];
    bidder = accounts[0];

    auctionInit();
  } catch (e: unknown) {
    console.error(e);
  }
};
