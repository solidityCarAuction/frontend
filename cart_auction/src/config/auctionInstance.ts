import Web3 from "web3";
import AuctionABI from "./abi.json";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = "0x5cd1D51349A92D7caceCe61a3E71D92b0aFc9670"; // 배포된 컨트랙트의 주소값

export const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://localhost:7545")
);

export const auctionContract = new web3.eth.Contract(
  AuctionABI as AbiItem[],
  CONTRACT_ADDRESS
);
