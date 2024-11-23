import service from "@/utils/request";

export function verify(data) {
  return service({
    url: "/api/Captcha/verify",
    method: "post",
    // isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function login(data) {
  return service({
    url: "/api/login/login",
    method: "post",
    isLoading: true,
    data,
    isCrypto: true,
    succMsg: false,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    // isCryptoPas: true,
  });
}
