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

export const formatUnixTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Unix timestamp는 초 단위이므로 1000을 곱해 밀리초로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
