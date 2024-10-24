import service from "@/utils/request";

export function getGlobalConfig(data) {
  return service({
    url: "/v4/index/peizhi",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
    isCryptoPas: true,
  });
}

export function getGlobalLang(data) {
  return service({
    url: "/v4/index/lang",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
  });
}

export function getBanner(data) {
  return service({
    url: "/api/index/banner",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
  });
}
