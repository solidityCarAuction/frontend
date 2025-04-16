import { FaWallet } from "react-icons/fa6";
import Wallets from "./Wallets";
import { useState } from "react";

const WalletBtn = ({
  userWallet,
  userWallets,
  setUserWallet,
}: {
  userWallet: string | undefined;
  userWallets: string[] | undefined;
  setUserWallet: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [showWallet, setShowWallet] = useState(true);
  const style =
    "cursor-pointer fixed bottom-10 right-10 z-50 w-[80px] h-[80px] bg-purple-600 rounded-full flex justify-center items-center";
  return (
    <>
      <button className={style} onClick={() => setShowWallet((prev) => !prev)}>
        <FaWallet size={30} />
      </button>
      {showWallet ? (
        <Wallets userWallet={userWallet} userWallets={userWallets} setUserWallet={setUserWallet} />
      ) : (
        false
      )}
    </>
  );
};

export default WalletBtn;
