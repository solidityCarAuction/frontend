import Web3 from "web3";
import AuctionABI from "./dataset/abi.json";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = "0x8B14B5073f30202AEe3Dba0f42abA525AcD92670"; // 배포된 컨트랙트의 주소값

export const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));

export const auctionContract = new web3.eth.Contract(AuctionABI as AbiItem[], CONTRACT_ADDRESS);
