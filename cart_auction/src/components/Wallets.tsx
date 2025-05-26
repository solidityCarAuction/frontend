import { useUserStore } from "../stores/useUserStore";
import { FaCrown } from "react-icons/fa";

const Wallets = () => {
  const { switchWallet } = useUserStore((state) => state);
  const walletAddresses = useUserStore((state) => state.walletAddresses);
  const currentWallet = useUserStore((state) => state.currentWallet);

  return (
    <div className="w-[350px] h-[600px] bg-black/50 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 overflow-y-scroll">
      <ul className="flex flex-col gap-2">
        {walletAddresses?.map((wallet, index) => (
          <li
            key={index}
            className={`border-b-gray-400 w-[294px] h-[64px] rounded-2xl cursor-pointer hover:bg-gray-500 hover:shadow-xl ${
              currentWallet === wallet ? "bg-gray-400" : "bg-gray-600"
            }`}
          >
            <button
              className="w-full h-full flex justify-center items-center cursor-pointer relative"
              onClick={() => switchWallet(wallet)}
            >
              {index === 0 && (
                <FaCrown className="absolute left-2 text-yellow-400" />
              )}
              <p className="w-60 overflow-hidden whitespace-nowrap truncate text-xs text-white">
                {wallet}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wallets;
