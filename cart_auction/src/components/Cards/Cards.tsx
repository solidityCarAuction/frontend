import { cardTitles } from "../../dataset/config";
import Card from "./Card";

const Cards = ({
  highestBid,
  highestBidder,
  ownerWallet,
}: {
  highestBid: string | undefined;
  highestBidder: string | undefined;
  ownerWallet: string | undefined;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cardTitles.map((title, idx) => (
        <Card
          idx={idx}
          key={idx}
          title={title.name}
          highestBid={highestBid}
          highestBidder={highestBidder}
          ownerWallet={ownerWallet}
        />
      ))}
    </div>
  );
};

export default Cards;
