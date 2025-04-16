const AuctionState = ({ auctionState }: { auctionState: string }) => {
  return (
    <>
      {auctionState === "진행중" ? (
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded bg-green-400"></div>
          <span>{auctionState}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded bg-gray-400"></div>
          <span>{auctionState}</span>
        </div>
      )}
    </>
  );
};

export default AuctionState;
