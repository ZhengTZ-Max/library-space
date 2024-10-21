import service from "@/utils/request";

export function getPcTopFor(data) {
  return service({
    url: "/v4/space/pcTopFor",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceDetail(data) {
  return service({
    url: "/v4/space/detail",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpacePick(data) {
  return service({
    url: "/v4/space/pick",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceIndex(data) {
  return service({
    url: "/v4/space/index",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceLabel(data) {
  return service({
    url: "/v4/Space/label",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceMap(data) {
  return service({
    url: "/v4/Space/map",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceSeat(data) {
  return service({
    url: "/v4/Space/seat",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceRule(data) {
  return service({
    url: "/v4/space/rule",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getSpaceConfirm(data) {
  return service({
    url: "/v4/space/confirm",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}











