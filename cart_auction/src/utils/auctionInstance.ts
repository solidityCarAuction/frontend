import Web3 from "web3";
import AuctionABI from "../dataset/abi.json";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = "0x7ee49f23Bb449e026cEFa18D103178038E7C870C"; // 배포된 컨트랙트의 주소값

export const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));

export const auctionContract = new web3.eth.Contract(AuctionABI as AbiItem[], CONTRACT_ADDRESS);
