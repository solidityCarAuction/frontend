import { ICarDetails } from "../../dataset/dummy";

const HeroCard = ({ title, info }: { title: string; info: ICarDetails[] }) => {
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pb-20 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl">
      <h2 className="text-4xl text-center font-semibold mb-2 font-sans my-6">{title}</h2>
      <div className="bg-white/5 border border-white/10 mt-8 mb-16"></div>
      <div className="flex flex-col">
        <ul className="text-lg text-gray-300 leading-relaxed font-sans text-center">
          <li>
            <p className="font-extrabold">
              Brand: <span className="font-normal">"{info[0].brand}"</span>
            </p>
          </li>
          <li>
            <p className="font-extrabold">
              Registration Number:
              <span className="font-normal">"{info[0].registration_number}"</span>
            </p>
          </li>
        </ul>
        <div className="flex justify-center gap-12 mt-12">
          <p>
            상태 : <span>진행중</span>
          </p>
          <p>
            종료시간 : <span>12:20:00</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
