import web3 from "web3";

// 가져올때 wei > ether로 단위 변환
export const weiToEther = (res: string) => {
  return web3.utils.fromWei(web3.utils.toBN(res), "ether");
};

export const createSysMsg = (msg: string, hash: string) => {
  return { msg, hash };
};

export const throwError = (e: unknown, option: string) => {
  console.error(e);
  if (e instanceof Error) {
    return e.message;
  } else {
    return option;
  }
};

export const formatTime = (sec: number) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};
