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
    isCrypto: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 考研查询
export function getCheckStudyOpenTime(data) {
  return service({
    url: "/v4/member/checkStudyOpenTime",
    method: "POST",
    isLoading: true,
    isCrypto: false,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 考研/研习预约
export function fetchStudyConfirm(data) {
  return service({
    url: "/v4/space/studyConfirm",
    method: "POST",
    isLoading: true,
    isCrypto: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 添加收藏
export function addCollect(data) {
  return service({
    url: "/api/space/addcollect",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 删除收藏
export function deleteCollect(data) {
  return service({
    url: "/api/space/deletecollect",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}


