import { useEffect, useState } from "react";
import AuctionState from "../Icons/AuctionState";
import CountDown from "../CountDown";
import { getAuctionEndTime } from "../../methods";
import { throwError } from "../../utils";

export interface IAuctionData {
  0: string;
  1: string;
  Brand: string;
  Rnumber: string;
}

const HeroCard = ({
  title,
  auctionData,
  auctionState,
}: {
  title: string;
  auctionData: IAuctionData;
  auctionState: string;
}) => {
  const [auctionEndTime, setAuctionEndTime] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAuctionEndTime();
        if (res) {
          setAuctionEndTime(res);
        }
      } catch (e) {
        throwError(e, "시간 정보를 가져오는데 실패했습니다.");
      }
    };

    fetch();
  }, []);

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pb-20 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl">
      <h2 className="text-4xl text-center font-semibold mb-2 font-sans my-6">{title}</h2>
      <div className="bg-white/5 border border-white/10 mt-8 mb-16"></div>
      <div className="flex flex-col">
        <ul className="text-lg text-gray-300 leading-relaxed font-sans text-center">
          <li>
            <p className="font-extrabold">
              브랜드 : <span className="font-normal">{auctionData.Brand}</span>
            </p>
          </li>
          <li>
            <p className="font-extrabold">
              차량번호 : <span className="font-normal">{auctionData.Rnumber}</span>
            </p>
          </li>
        </ul>
        <div className="flex justify-center gap-12 mt-12">
          <AuctionState auctionState={auctionState} />
          <CountDown auctionEndTime={auctionEndTime} />
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
