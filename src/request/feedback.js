import service from "@/utils/request";

export function getMyFeedback(data) {
  return service({
    url: "/v4/help/myFeedback",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getFeedbackCategory(data) {
  return service({
    url: "/v4/help/category",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getFeedbackIlk(data) {
  return service({
    url: "/v4/help/ilk",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function postFeedback(data) {
  return service({
    url: "/v4/help/feedback",
    method: "POST",
    isLoading: true,
    data,
  });
}
export function getIlkAddress(data) {
  return service({
    url: "/v4/help/site",
    method: "POST",
    isLoading: true,
    data,
  });
}
export function getFeedbackDetail(data) {
  return service({
    url: "/v4/help/detail",
    method: "POST",
    isLoading: true,
    data,
  });
}

export function postFeedbackForRepair(data) {
  return service({
    url: "/v4/help/repair",
    method: "POST",
    isLoading: true,
    data,
  });
}
