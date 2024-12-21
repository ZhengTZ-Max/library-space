import service from "@/utils/request";

export function getBookLockerList(data) {
  return service({
    url: "/reserve/locker/myList",
    method: "POST",
    isLoading: true,
    data,
  });
}