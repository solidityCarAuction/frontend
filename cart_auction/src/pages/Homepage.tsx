import BidInput from "../components/BidInput";
import Cards from "../components/Cards/Cards";
import HeroCard from "../components/Cards/HeroCard";
import LogBox from "../components/Cards/LogBox";
import Header from "../components/Header";
import { carDetails } from "../dataset/dummy";

const Homepage = () => {
  return (
    <div className="">
      <Header />
      <main className="h-full p-16">
        <div className="mb-8 flex gap-6 h-full">
          <HeroCard title="New Auction" info={carDetails} />
          <LogBox />
        </div>
        <Cards />
        <div className="w-full mt-8">
          <BidInput />
        </div>
      </main>
    </div>
  );
};

export default Homepage;
