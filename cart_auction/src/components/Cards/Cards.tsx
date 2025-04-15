import { cardTitles } from "../../dataset/config";
import Card from "./Card";

const Cards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cardTitles.map((title, idx) => (
        <Card idx={idx} key={idx} title={title.name} />
      ))}
    </div>
  );
};

export default Cards;
