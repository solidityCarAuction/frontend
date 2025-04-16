const Wallets = ({
  userWallet,
  userWallets,
  setUserWallet,
}: {
  userWallet: string | undefined;
  userWallets: string[] | undefined;
  setUserWallet: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  return (
    <div className="w-[350px] h-[600px] bg-black/50 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 overflow-y-scroll">
      <ul className="flex flex-col gap-2">
        {userWallets?.map((wallet, index) => (
          <li
            key={index}
            className={`border-b-gray-400 w-[294px] h-[64px] rounded-2xl cursor-pointer hover:bg-gray-500 hover:shadow-xl ${
              userWallet === wallet ? "bg-gray-400" : "bg-gray-600"
            }`}
          >
            <button
              className="w-full h-full flex justify-center items-center cursor-pointer"
              onClick={() => setUserWallet(wallet)}
            >
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
