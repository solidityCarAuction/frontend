import Web3 from "web3";
import AuctionABI from "./dataset/abi.json";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = "0xe6dC6BFca86d2125a07E5A60A9Fa4411Cd4D528A"; // 배포된 컨트랙트의 주소값

export const web3 = new Web3("ws://localhost:7545");

export const auctionContract = new web3.eth.Contract(AuctionABI as AbiItem[], CONTRACT_ADDRESS);
