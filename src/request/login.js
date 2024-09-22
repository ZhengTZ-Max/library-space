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
