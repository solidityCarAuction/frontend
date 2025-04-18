import { FaEthereum } from "react-icons/fa6";
import { commonBtn } from "../../dataset/config";
// import { useUserStore } from "../../stores/useUserStore";
import { useAuctionStore } from "../../stores/useAuctionStore";
import { weiToEther } from "../../utils";
import { useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { useLogStore } from "../../stores/useLogStore";

const Card = ({ title }: { title: string }) => {
  // const { ownerWallet } = useUserStore((state) => state);
  const { getHighestBid, getHighestBidder, deactivate, withdrawFunds } = useAuctionStore(
    (state) => state
  );
  const highestBid = useAuctionStore((state) => state.highestBid);
  const highestBidder = useAuctionStore((state) => state.highestBidder);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const addLog = useLogStore((state) => state.addLog);

  useEffect(() => {
    getHighestBid();
    getHighestBidder();
    console.log(highestBid, highestBidder);
  }, [highestBid]);

  const handleDeactivate = async () => {
    try {
      await deactivate(currentWallet);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      const delimeter = errorMsg.split("revert")[1];
      console.log(delimeter);
      addLog(`[에러]: ${delimeter}`);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      await withdrawFunds(currentWallet);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      const delimeter = errorMsg.split("revert")[1];
      addLog(`[에러]: ${delimeter}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("입찰자 주소가 복사되었습니다!"); // 복사 성공 시 알림
      })
      .catch((err) => {
        console.error("입찰자 주소 복사 실패:", err);
      });
  };

  return (
    <>
      {highestBid && highestBidder && (
        <div
          key={highestBidder}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl overflow-hidden"
        >
          <h2 className="text-xl font-semibold mb-2 font-sans text-center">{title}</h2>
          {title === "Auction Details" ? (
            <div className="w-full flex items-center justify-center gap-4">
              <div className="flex flex-col items-center justify-center gap-2 flex-1">
                <p className="text-md text-white text-start">Highest</p>
                <div className="flex items-center gap-1">
                  <FaEthereum />
                  <p className="text-3xl font-bold text-white">{weiToEther(String(highestBid))}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 h-16 mx-4"></div>
              <div className="flex flex-col items-center justify-center gap-2 flex-1">
                <p className="text-md text-white">Wallet Address</p>
                <p
                  className="w-45 overflow-hidden whitespace-nowrap truncate text-3xl font-bold text-white cursor-pointer hover:underline"
                  onClick={() => copyToClipboard(highestBidder)} // 클릭 시 복사 함수 호출
                >
                  {highestBidder}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <button className={commonBtn} onClick={handleDeactivate}>
                경매 종료
              </button>
              <button className={commonBtn} onClick={handleWithdrawFunds}>
                낙찰금 회수
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Card;
