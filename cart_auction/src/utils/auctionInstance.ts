import Web3 from "web3";
import AuctionABI from "../dataset/abi.json";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = "0xC922E8d1aEE339AC5E02390A59b94EA8abE3BEd3"; // 배포된 컨트랙트의 주소값

export const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));

export const auctionContract = new web3.eth.Contract(AuctionABI as AbiItem[], CONTRACT_ADDRESS);
