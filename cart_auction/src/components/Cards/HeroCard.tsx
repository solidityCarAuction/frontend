import { useEffect, useState } from "react";
import AuctionState from "../Icons/AuctionState";
import CountDown from "../CountDown";
import { useAuctionStore } from "../../stores/useAuctionStore";

const HeroCard = ({ title }: { title: string }) => {
  const auctionItem = useAuctionStore((state) => state.item);
  const time = useAuctionStore((state) => state.timeLeft);
  const auctionStatus = useAuctionStore((state) => state.status);

  const [auctionEndTime, setAuctionEndTime] = useState(0);

  useEffect(() => {
    if (auctionStatus === "종료됨" || auctionStatus === "에러") {
      setAuctionEndTime(0);
    } else {
      setAuctionEndTime(time);
    }
  }, [time, auctionStatus]);

  return (
    <div className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 pb-20 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl">
      <h2 className="text-4xl text-center font-semibold mb-2 font-sans my-6">{title}</h2>
      <div className="bg-white/5 border border-white/10 mt-8 mb-16"></div>
      <div className="flex flex-col">
        <ul className="text-lg text-gray-300 leading-relaxed font-sans text-center">
          <li>
            <p className="font-extrabold">
              브랜드 : <span className="font-normal">{auctionItem.Brand}</span>
            </p>
          </li>
          <li>
            <p className="font-extrabold">
              차량번호 : <span className="font-normal">{auctionItem.Rnumber}</span>
            </p>
          </li>
        </ul>
        <div className="flex justify-center gap-12 mt-12">
          <AuctionState auctionState={auctionStatus} />
          <CountDown auctionEndTime={auctionEndTime} />
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
