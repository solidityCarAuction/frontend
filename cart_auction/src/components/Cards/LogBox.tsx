import { useEffect, useRef } from "react";
import { useLogStore } from "../../stores/useLogStore";

const LogBox = () => {
  const logs = useLogStore((state) => state.logs);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col w-full h-[400px] overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-102 hover:shadow-xl">
      <h2 className="text-md text-center font-semibold mb-2 font-sans">History</h2>
      <div className="flex-1 overflow-y-scroll w-full h-full">
        <div className="flex flex-col gap-1">
          {logs.length > 0 ? (
            logs.map((item, idx) => (
              <p
                key={idx}
                className={`text-xs text-green-400 leading-relaxed font-sans text-left ${
                  idx === logs.length - 1 ? "fade-in-up" : ""
                }`}
              >
                {item}
              </p>
            ))
          ) : (
            <p className="text-xs text-gray-500 text-center">로그가 없습니다.</p>
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default LogBox;
