import { useEffect, useState } from "react";
import { formatTime } from "../utils";

const CountDown = ({ auctionEndTime }: { auctionEndTime: number }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = Number(auctionEndTime) - now;
      setRemainingTime(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  return (
    <p>
      ⏳ 남은시간 : <span>{formatTime(remainingTime)}</span>
    </p>
  );
};

export default CountDown;
