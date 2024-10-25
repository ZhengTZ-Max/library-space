import service from "@/utils/request";

export function getActivityRecordList(data) {
  return service({
    url: "/v4/activity/record",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}