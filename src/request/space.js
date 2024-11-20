import service from "@/utils/request";

export function getSeminarIndex(data) {
  return service({
    url: "/v4/seminar/index",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
