import { cardTitles } from "../../config/config";
import Card from "./Card";
import { useUserStore } from "../../stores/useUserStore";

const Cards = () => {
  const { currentWallet, walletAddresses } = useUserStore((state) => state);
  const isAdmin = walletAddresses?.[0] === currentWallet;

  return (
    <div
      className={`grid ${
        isAdmin ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      } gap-6`}
    >
      {cardTitles.map((title, idx) => (
        <Card title={title.name} key={idx} />
      ))}
    </div>
  );
};

export default Cards;
