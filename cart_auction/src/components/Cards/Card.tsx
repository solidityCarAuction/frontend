import { commonBtn } from "../../dataset/config";
import { quitAuction } from "../../methods";

const Card = ({
  idx = 0,
  title,
  highestBid,
  highestBidder,
}: {
  idx: number | null;
  title: string | undefined;
  highestBid: string | undefined;
  highestBidder: string | undefined;
}) => {
  return (
    <div
      key={idx}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl overflow-hidden"
    >
      <h2 className="text-xl font-semibold mb-2 font-sans">{title}</h2>
      <div className="bg-white/5 border border-white/10 mb-8"></div>
      {title === "Auction Details" ? (
        <>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            최고가: <span>{highestBid}</span>
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            입찰자: <span className="text-ellipsis">{highestBidder}</span>
          </p>
        </>
      ) : (
        <>
          <button className={commonBtn} onClick={() => quitAuction()}>
            경매종료하기
          </button>
        </>
      )}
    </div>
  );
};

export default Card;
