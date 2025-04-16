import { useEffect, useState } from "react";
import BidInput from "../components/BidInput";
import Cards from "../components/Cards/Cards";
import HeroCard from "../components/Cards/HeroCard";
import LogBox from "../components/Cards/LogBox";
import Header from "../components/Header";
import { web3Init } from "../auction";
import { throwError } from "../utils";
import { getAuctionItemData, getAuctionState, getHighestBid, getHighestBidder } from "../methods";
import WalletBtn from "../components/WalletBtn";

const Homepage = () => {
  const [userWallets, setUserWallets] = useState<string[]>();
  const [userWallet, setUserWallet] = useState<string>();
  const [mybid, setMybid] = useState("");
  const [auctionData, setAuctionData] = useState();
  const [auctionState, setAuctionState] = useState<"진행중" | "종료">("종료");
  const [highestBid, setHighestBid] = useState<string>();
  const [highestBidder, setHighestBidder] = useState();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const wallets = await web3Init();
        if (wallets) {
          setUserWallets(wallets);
        }
        console.log(wallets);
      } catch (e) {
        throwError(e, "유저 지갑 정보를 가져오는데 실패했습니다.");
      }
    };
    fetchItem();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highestBid, highestBidder] = await Promise.all([
          getHighestBid(),
          getHighestBidder(),
        ]);
        setHighestBid(highestBid);
        setHighestBidder(highestBidder);

        console.log("최고가 정보 최신화 완료");
      } catch (e) {
        throwError(e, "최고 입찰가 또는 최고 입찰자 정보를 가져오는 도중 실패했습니다.");
      }
    };

    const timeId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(timeId);
  }, [mybid]);

  // default wallet 세팅
  useEffect(() => {
    if (userWallets && userWallets.length > 0) {
      setUserWallet(userWallets[0]);
    }
  }, [userWallets]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getAuctionItemData();
        setAuctionData(res);
      } catch (e) {
        throwError(e, "옥션 아이템을 가져오는 도중 실패했습니다.");
      }
    };
    fetchItem();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getAuctionState();
        setAuctionState(res || "종료");
      } catch (e) {
        throwError(e, "옥션 상태를 가져오는 도중 실패했습니다.");
      }
    };
    fetchItem();
  }, []);

  useEffect(() => {
    console.log("유저 지갑이 변경되었습니다: ", userWallet);
  }, [userWallet]);

  return (
    <>
      <WalletBtn userWallet={userWallet} userWallets={userWallets} setUserWallet={setUserWallet} />
      <Header />
      <main className="h-full p-16">
        <div className="mb-8 flex gap-6 h-full">
          {auctionData ? ( // auctionData가 정의되어 있을 때만 HeroCard 렌더링
            <HeroCard title="New Auction" auctionData={auctionData} auctionState={auctionState} />
          ) : (
            <div>로딩 중...</div> // 데이터가 로딩 중일 때 표시할 내용
          )}
          <LogBox />
        </div>
        <Cards highestBid={highestBid} highestBidder={highestBidder} />
        <div className="w-full mt-8">
          <BidInput userWallet={userWallet} mybid={mybid} setMybid={setMybid} />
        </div>
      </main>
    </>
  );
};

export default Homepage;
