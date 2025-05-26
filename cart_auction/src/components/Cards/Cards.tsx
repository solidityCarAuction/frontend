import { cardTitles } from "../../config/config";
import Card from "./Card";
import { useUserStore } from "../../stores/useUserStore";

const Cards = () => {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <div className="grid gap-6">
      {cardTitles.map((title, idx) => (
        <Card title={title.name} key={idx} />
      ))}
    </div>
  );
};

export default Cards;
