import { commonBtn } from "../../dataset/config";

const Card = ({ idx = 0, title }: { idx: number | null; title: string }) => {
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
            최고가: <span>25eth</span>
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            입찰자: <span className="text-ellipsis">0x5148d45eaa27982DE951629D27...</span>
          </p>
        </>
      ) : (
        <>
          <button className={commonBtn}>경매종료하기</button>
        </>
      )}
    </div>
  );
};

export default Card;
