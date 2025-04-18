import { useState } from "react";
import { commonBtn } from "../dataset/config";
import { useUserStore } from "../stores/useUserStore";
import { useLogStore } from "../stores/useLogStore";
import { debounce } from "lodash";

const BidInput = () => {
  const { placeBid, withdraw, balance } = useUserStore((state) => state);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const addLog = useLogStore((state) => state.addLog);
  const [amount, setAmount] = useState(0);

  const handlePlaceBid = debounce(async () => {
    if (amount > balance) {
      addLog(`[에러]: 지갑의 잔금이 부족합니다!`);
    } else {
      try {
        await placeBid(amount, currentWallet);
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        const delimeter = errorMsg.split("revert")[1];
        addLog(`[에러]: ${delimeter}`);
      }
    }
  }, 200); // 비동기 함수와 싱크를 맞추기 위해 0.2초 디바운스 추가

  const handleWithdraw = async () => {
    try {
      await withdraw(currentWallet);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      const delimeter = errorMsg.split("revert")[1];
      addLog(`[에러]: ${delimeter}`);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl">
      <h2 className="text-lg font-semibold text-white mb-4">💰 입찰가 입력</h2>
      <input
        type="number"
        placeholder="입찰가를 입력하세요"
        className="w-full p-3 bg-[#111827] text-white border border-gray-600 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <div className="flex gap-3 justify-center">
        <button type="submit" className={commonBtn} onClick={handlePlaceBid}>
          입찰하기
        </button>
        <button type="submit" className={commonBtn} onClick={handleWithdraw}>
          출금하기
        </button>
      </div>
    </div>
  );
};

export default BidInput;
