import { cardTitles } from "../../dataset/config";
import Card from "./Card";

const Cards = ({
  highestBid,
  highestBidder,
}: {
  highestBid: string | undefined;
  highestBidder: string | undefined;
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
        />
      ))}
    </div>
  );
};

export default Cards;
