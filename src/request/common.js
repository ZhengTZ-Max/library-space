import service from "@/utils/request";

export function getSeatAreaDate(data) {
  return service({
    url: "/api/space/areadays",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSeatOftenDate(data) {
  return service({
    url: "/api/space/getoftendate",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSeatCollectList(data) {
  return service({
    url: "/api/space/getcollect",
    method: "POST",
    isLoading: true,
    data,
  });
}

export function getSeatOftenList(data) {
  return service({
    url: "/api/space/getoften",
    method: "POST",
    isLoading: true,
    data,
  });
}

export function cancelSeatCollect(data) {
  return service({
    url: "/api/space/deletecollect",
    method: "POST",
    isLoading: true,
    data,
  });
}

