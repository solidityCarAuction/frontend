import Web3 from "web3";
import AuctionABI from "./abi.json";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = "0x9a223b1C19a90637843f4f3a27A599f087d9B37a"; // 배포된 컨트랙트의 주소값

export const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://localhost:7545")
);

export const auctionContract = new web3.eth.Contract(
  AuctionABI as AbiItem[],
  CONTRACT_ADDRESS
);
