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

// 设置电灯开关
export function setLightStatus(data) {
  return service({
    url: "/reserve/smartDevice/setLightStatus",
    method: "POST",
    isLoading: true,
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 设置电灯亮度
export function setLightBrightness(data) {
  return service({
    url: "/reserve/smartDevice/setLightBrightness",
    method: "POST",
    isLoading: true,
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 设置插座亮度
export function setRelayStatus(data) {
  return service({
    url: "/reserve/smartDevice/setRelayStatus",
    method: "POST",
    isLoading: true,
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 扫码预约（座位检测）
export function checkSeatAsk(data) {
  return service({
    url: "/v4/space/qr_scan",
    method: "post",
    isLoading: true,
    // loadingMsg:"正在预约",
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 扫码换座
export function SeatQrChange(data) {
  return service({
    url: "/v4/space/qr_change",
    method: "post",
    isLoading: true,
    // loadingMsg:"正在预约",
    // customLoading:true, //是否自定义loading
    data,
  });
}

// touch扫码 delete/checkin/checkout/leave[取消/签到/签离/临时离开]
export function touch_qr_books(data) {
  return service({
    url: "/v4/space/qr_touch",
    method: "post",
    isLoading: true,
    // loadingMsg:"正在预约",
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 个人中心  座位预约记录  权限查询 - 获取查询树
export function getQueryTree(data) {
  return service({
    url: "/v4/member/studyTree",
    method: "post",
    isLoading: true,
    // loadingMsg:"正在预约",
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 个人中心  座位预约记录  权限查询 - 获取查询结果
export function getQuerySeat(data) {
  return service({
    url: "/v4/member/checkStudyOpenTime",
    method: "post",
    isLoading: true,
    data,
  });
}
