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


