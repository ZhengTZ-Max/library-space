import service from "@/utils/request";

export function getSeatRecordList(data) {
  return service({
    url: "/v4/member/seat",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSeatRenegeList(data) {
  return service({
    url: "/v4/member/seatRenege",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
