import { FaEthereum } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";

const MyWallet = () => {
  const { getBalance } = useUserStore((state) => state);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const balance = useUserStore((state) => state.balance);

  useEffect(() => {
    getBalance(currentWallet);
  }, [currentWallet, balance]);

  const copyToClipboard = () => {
    if (currentWallet) {
      navigator.clipboard
        .writeText(currentWallet)
        .then(() => {
          alert("지갑 주소가 복사되었습니다!"); // 복사 성공 시 알림
        })
        .catch((err) => {
          console.error("지갑 주소 복사 실패:", err);
        });
    }
  };

  return (
    <div className="w-[350px] h-[80px] bg-black/50 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col justify-center px-4">
      <div className="flex items-center gap-3">
        <CiWallet />
        <p
          className="w-60 overflow-hidden whitespace-nowrap truncate text-sm text-white cursor-pointer hover:underline"
          onClick={copyToClipboard} // 클릭 시 복사 함수 호출
        >
          {currentWallet}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <FaEthereum />
        <p className="w-60 overflow-hidden whitespace-nowrap truncate text-sm text-white">
          {balance} eth
        </p>
      </div>
    </div>
  );
};

export default MyWallet;
