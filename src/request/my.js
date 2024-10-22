import service from "@/utils/request";

export function getMyInfo(data) {
  return service({
    url: "/v4/member/my",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}