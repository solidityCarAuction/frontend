import BidInput from "../components/BidInput";
import Cards from "../components/Cards/Cards";
import HeroCard from "../components/Cards/HeroCard";
import LogBox from "../components/Cards/LogBox";
import Header from "../components/Header";
import WalletBtn from "../components/WalletBtn";
import useAuctionInit from "../hooks/useAuctionInit";

const Homepage = () => {
  const isFetched = useAuctionInit();

  return (
    <>
      {isFetched ? (
        <>
          <WalletBtn />
          <Header />
          <main className="h-full p-16">
            <div className="mb-8 flex flex-col md:flex-row gap-6 h-full">
              <div className="flex-1">
                <HeroCard title="New Auction" />
              </div>
              <div className="flex-1">
                <LogBox />
              </div>
            </div>
            <Cards />
            <div className="w-full mt-8">
              <BidInput />
            </div>
          </main>
        </>
      ) : (
        <div>로딩중...</div>
      )}
    </>
  );
};

export default Homepage;
