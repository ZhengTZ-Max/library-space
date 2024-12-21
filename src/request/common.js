import service from "@/utils/request";

export function cancelSeatCollect(data) {
  return service({
    url: "/v4/member/uncollectseat",
    method: "POST",
    isLoading: true,
    data,
  });
}


export function getOftenTime(data) {
  return service({
    url: "/v4/member/oftentime",
    method: "POST",
    isLoading: true,
    data,
  });
}

export function getOftenTableList(data) {
  return service({
    url: "/v4/member/often",
    method: "POST",
    isLoading: true,
    data,
  });
}

export function getCollectTime(data) {
  return service({
    url: "/v4/member/collecttime",
    method: "POST",
    isLoading: true,
    data,
  });
}

export function getCollectTableList(data) {
  return service({
    url: "/v4/member/collect",
    method: "POST",
    isLoading: true,
    data,
  });
}
