import service from "@/utils/request";

export function getAreaRecordList(data) {
  return service({
    url: "/v4/seminar/books",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getRenegesRecordList(data) {
  return service({
    url: "/v4/seminar/reneges",
    method: "POST",
    isLoading: true,
    data,
  });
}
