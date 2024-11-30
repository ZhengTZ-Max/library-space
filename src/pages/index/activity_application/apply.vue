<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import _ from "lodash";
import moment from "moment";

import {
  getActivityApply,
  getActivityDetail,
  activityApply,
  fetchActivityShould,
} from "@/request/activity_application";
import {
  exchangeDateTime,
  checkOverlap,
  convertMinutesToHHMM,
  convertHHMMToMinutes,
} from "@/utils";
import ActivitySpaceSwipe from "@/components/ActivityApplication/ActivitySpaceSwipe.vue";
import LibraryInfo from "@/components/LibraryInfo.vue";
import Calendar from "@/components/ActivityApplication/Calendar.vue";
import Uploader from "@/components/Uploader.vue";
import SliderCom from "@/components/SliderCom.vue";
import SpaceRuleConfirm from "@/components/SpaceSeat/SpaceRuleConfirm.vue";
import ShowInfoToast from "@/components/ShowInfoToast.vue";

import { showToast, Toast } from "vant";

const router = useRouter();
const route = useRoute();
const lang = computed(() => store.state.lang);

const containerRef = ref();

const state = reactive({
  sliderVal: [],
  sliderConfig: {
    previousValue: [],
    minRange: 60,
    maxRange: 240,
    startTime: 15,
    endTime: 1425,
    step: 15,
    marksList: {},
    disabledArr: [],
    disabledHtml: "",
  },

  initQuerySpaceId: route?.query?.id || "",

  argumentArray: [],

  activityApplyInfo: {},
  activityDetailInfo: {},
  activityDetailInfoShow: false,

  calendarInfo: {
    list: [],
    startDate: "",
    endDate: "",
  },
  selectDateInfo: [],
  selectSlideShow: false,
  selectChooseTime: false,
  filterRows: {
    date: "",
    time: "",
    times: {},
  },

  topImg: "",
  leftBadge: "",
  filterActivityTypeId: "",
  filterActivityTheme: "",
  filterActivityContent: "",
  filterActivityMaxPeople: "",
  filterActivityMobile: "",

  initApprove: [
    // {
    //   file_ext: "pdf",
    //   file_name: "NKY2Pj2ipqIUQmFu1732951373143983.pdf",
    //   file_origin_name: "Transactions Explanation.pdf",
    //   file_path:
    //     "/upload/activity/2024-11-30/NKY2Pj2ipqIUQmFu1732951373143983.pdf",
    //   file_size: "524.64 KB",
    // },
  ],

  poster: [],
  approve: [],
  publicize: [],
  plan: [],
  materials: [],

  chooseTimeList: [{ begin_time: "", end_time: "" }],

  ruleShow: false,
  ruleInfo: { content: "" },

  submitData: {},

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },

  rangeTimeCantSelectTime: [],
});

onMounted(() => {
  fetchGetActivityApply();

  // 回显测试
  setTimeout(() => {
    state.initApprove = [
      {
        file_ext: "pdf",
        file_name: "NKY2Pj2ipqIUQmFu1732951373143983.pdf",
        file_origin_name: "Transactions Explanation.pdf",
        file_path:
          "/upload/activity/2024-11-30/NKY2Pj2ipqIUQmFu1732951373143983.pdf",
        file_size: "524.64 KB",
      },
    ];
  }, 3000);
});

const bottomBtnDisabled = () => {
  let submitErr = false;
  if (checkOverlap(state.sliderVal, state.sliderConfig?.disabledArr)?.length) {
    submitErr = true;
  }

  return submitErr;
};

const onSubmit = (type) => {
  try {
    // let placeholder = lang == "en" ? `placeholder_en` : `placeholder`;

    let [startDate, endDate] = state.selectDateInfo;
    let {
      initQuerySpaceId,
      filterActivityTypeId,
      filterActivityTheme,
      filterActivityContent,
      filterActivityMaxPeople,
      filterActivityMobile,

      poster,
      approve,
      publicize,
      plan,
      materials,
    } = state;
    let params = {
      id: initQuerySpaceId,
      cate_id: filterActivityTypeId,
      start_date: (startDate && exchangeDateTime(startDate, 2)) || "",
      end_date: (endDate && exchangeDateTime(endDate, 2)) || "",
      title: filterActivityTheme || "",
      content: filterActivityContent || "",
      max: filterActivityMaxPeople || "",
      mobile: filterActivityMobile || "",
      time: [],
      poster,
      approve,
      publicize,
      plan,
      materials,
    };

    if (!state.selectDateInfo?.length) {
      showToast({ message: "请选择申请日期" });
      return false;
    }

    if (state.selectDateInfo?.length == 1) {
      params.end_date = exchangeDateTime(startDate, 2);

      let [s, e] = state.sliderVal;
      params.time = [
        {
          start_time: convertMinutesToHHMM(s),
          end_time: convertMinutesToHHMM(e),
        },
      ];
    } else {
      params.end_date = exchangeDateTime(endDate, 2);
      state.chooseTimeList.forEach((e) => {
        params.time.push({
          start_time: e.begin_time,
          end_time: e.end_time,
        });
      });
    }

    if (!params?.title) {
      let info = getArgInfo("title");
      if (info?.is_must == 1) {
        showToast({ message: "请填写申请主题" });
        return false;
      }
    } else if (!params?.content) {
      let info = getArgInfo("content");
      if (info?.is_must == 1) {
        showToast({ message: "请填写申请内容" });
        return false;
      }
    } else if (!params?.max) {
      let info = getArgInfo("max");
      if (info?.is_must == 1) {
        showToast({ message: "请输入最大人数" });
        return false;
      }
    } else if (!params?.mobile) {
      let info = getArgInfo("mobile");
      if (info?.is_must == 1) {
        showToast({ message: "请输入联系电话" });
        return false;
      }
    } else if (!params?.approve?.length) {
      let info = getArgInfo("approve");
      if (info?.is_must == 1) {
        showToast({ message: "请上传审批附件" });
        return false;
      }
    } else if (!params?.poster?.length) {
      let info = getArgInfo("poster");
      if (info?.is_must == 1) {
        showToast({ message: "请上传活动海报" });
        return false;
      }
    } else if (!params?.plan?.length) {
      let info = getArgInfo("plan");
      if (info?.is_must == 1) {
        showToast({ message: "请上传活动策划案" });
        return false;
      }
    } else if (!params?.publicize?.length) {
      let info = getArgInfo("publicize");
      if (info?.is_must == 1) {
        showToast({ message: "请上传宣传片" });
        return false;
      }
    } else if (!params?.materials?.length) {
      let info = getArgInfo("materials");
      if (info?.is_must == 1) {
        showToast({ message: "请上传其他申请材料" });
        return false;
      }
    }

    state.submitData = params;
    if (type == "rule") {
      applyActivity(params);
    } else {
      state.ruleInfo = { content: state.activityApplyInfo?.should };
      state.ruleShow = true;
      // getRuleInfo(params);
    }
  } catch (e) {}
};

// const getRuleInfo = async (data) => {
//   try {
//     const res = await fetchActivityShould(data);
//     if (res?.code != 0) {
//       showToast({
//         message: res?.message || "网络请求错误",
//       });
//       return false;
//     }

//     state.ruleInfo = res?.data;
//     state.ruleShow = true;
//     console.log(res);
//   } catch (e) {
//     console.log(e);
//   }
// };

const applyActivity = async (data) => {
  try {
    state.ruleShow = false;

    const res = await activityApply(data);

    state.apptResult = {
      show: true,
      title: res.message,
      type: res?.code == 0 ? "success" : "error",
      msg: (res?.code != 0 && res?.message) || "",

      ...res.data,
    };
  } catch (e) {
    console.log(e);
  }
};

const getCurrentTime = () => {
  let findDate = state.calendarInfo?.list?.find(
    (e) => e?.day == exchangeDateTime(state?.selectDateInfo[0], 2)
  );

  if (findDate) {
    let { day, start_time, end_time, min_time, max_time, list } = findDate;
    state.sliderConfig.startTime = start_time;
    state.sliderConfig.endTime = end_time;
    state.sliderConfig.minRange = Number(min_time);
    state.sliderConfig.maxRange = Number(max_time);

    state.sliderConfig.disabledArr = list?.map((e) => {
      return [e?.begin_time, e?.end_time];
    });
  }

  // console.log(
  //   "state.sliderConfig.disabledArr",
  //   JSON.stringify(state.sliderConfig.disabledArr)
  // );
  if (
    exchangeDateTime(state.selectDateInfo[0], 2) ==
    exchangeDateTime(new Date(), 2)
  ) {
    let h = moment(new Date()).get("hour") * 60;
    let m = h + moment(new Date()).get("minute");
    m = m + (15 - (m % 15));

    state.sliderConfig.disabledArr = [
      ...state.sliderConfig.disabledArr,
      [state.sliderConfig.startTime, m],
    ];
  } else {
    state.sliderConfig.disabledArr = [...state.sliderConfig.disabledArr];
  }

  state.selectSlideShow = true;
};

const goToLink = (link) => {
  router.replace(link);
};

// 添加时间段
const addTimeSlot = () => {
  state.chooseTimeList.push({ begin_time: "", end_time: "" });
  console.log(state.chooseTimeList);
};

// 移除最后一个时间段
const removeTimeSlot = () => {
  if (state.chooseTimeList.length > 1) {
    // 确保至少有一条数据
    state.chooseTimeList.pop();
  }
};

const fetchGetActivityApply = async () => {
  try {
    let params = {
      id: state.initQuerySpaceId,
    };
    let res = await getActivityApply(params);
    if (res.code != 0) return;
    state.activityApplyInfo = res?.data?.detail || {};
    state.calendarInfo.list = res?.data?.axis || [];

    if (state.calendarInfo.list.length) {
      state.calendarInfo.startDate = state.calendarInfo.list[0].day;
      state.calendarInfo.endDate =
        state.calendarInfo.list[state.calendarInfo.list.length - 1].day;
    }

    // 模拟数据
    // state.calendarInfo.list[0].status = -1;
    // state.calendarInfo.list[1].status = 0;
    // state.calendarInfo.list[1].list.push({
    //   date: "2024-11-23",
    //   begin_timestamp: "2024-11-23 08:00:00",
    //   end_timestamp: "2024-11-23 19:00:00",
    //   begin_time: 480,
    //   end_time: 540,
    // });

    console.log(state.calendarInfo);

    state.argumentArray = res?.data?.argument || [];
    state.topImg = res?.data?.detail?.firstImg || "";
    state.leftBadge = res?.data?.detail?.top_name || "";

    state.filterActivityTypeId = state.activityApplyInfo?.categorys[0]?.id;
    // initMarks();
  } catch (e) {
    console.log(e);
  }
};
const fetchGetActivityDetailInfo = async () => {
  try {
    let params = {
      id: state.initQuerySpaceId,
    };
    let res = await getActivityDetail(params);
    if (res.code != 0) return;
    state.activityDetailInfo = { ...res?.data, type: "activity" } || {};
    state.activityDetailInfoShow = true;
    console.log(state.activityDetailInfo);
  } catch (e) {
    console.log(e);
  }
};

const onChangeSlide = (row) => {
  state.initQuerySpaceId = row?.id;
  fetchGetActivityApply();
  console.log(row);
};

const onViewFloor = (row) => {
  console.log(row);
};

const filterArguments = (key) => {
  return state.argumentArray?.some((e) => e.key == key) || false;
};

const getArgInfo = (key) => {
  return state.argumentArray?.find((e) => e.key == key) || false;
};

const onSelected = (date) => {
  state.selectDateInfo = date;
  state.selectSlideShow = false;
  if (state.selectDateInfo.length > 0) {
    if (state.selectDateInfo.length == 1) {
      state.selectChooseTime = false;
      getCurrentTime();
    } else {
      getCurrentChooseTimeHaveSelectTime(); // 获取当前选择时间范围中 后端返回的已经占用的时间段
      state.selectSlideShow = false;
      state.selectChooseTime = true;
    }
  } else {
    state.selectSlideShow = false;
    state.selectChooseTime = false;
  }
};

const getCurrentChooseTimeHaveSelectTime = () => {
  let [startDate, endDate] = state.selectDateInfo;

  const startIndex = state.calendarInfo.list.findIndex(
    (item) => item.day === exchangeDateTime(startDate, 2)
  );
  const endIndex = state.calendarInfo.list.findIndex(
    (item) => item.day === exchangeDateTime(endDate, 2)
  );

  if (startIndex === -1 || endIndex === -1) {
    return []; // 如果没有找到日期，返回空数组
  }

  // 确保 startIndex 小于 endIndex
  const [minIndex, maxIndex] =
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

  const list = state.calendarInfo.list.slice(minIndex, maxIndex + 1); // 包含 endDate
  list.forEach((e) => {
    e.list.forEach((item) => {
      state.rangeTimeCantSelectTime.push({
        begin_time: item.begin_time,
        end_time: item.end_time,
      });
    });
  });
};

const chooseTimeIsInRange = (value, item, type, index) => {
  // 先判断是否在已占用的时间段内
  const isInRange = state.rangeTimeCantSelectTime.some((range) => {
    const { begin_time, end_time } = range;
    return value > begin_time && value < end_time;
  });
  if (isInRange) {
    message.warning("该时间段已被占用");

    if (type == "start") {
      item.begin_time = null;
    } else {
      item.end_time = null;
    }
    return;
  }

  // 再和当前已经选择的时间段进行比较
  const isInCurrentChooseTimeRange = state.chooseTimeList.some(
    (range, mIndex) => {
      if (mIndex == index) return false;
      const { begin_time, end_time } = range;
      if (
        begin_time == "" ||
        begin_time == null ||
        end_time == "" ||
        end_time == null
      )
        return false;

      let begin = convertHHMMToMinutes(begin_time);
      let end = convertHHMMToMinutes(end_time);
      return value > begin && value < end;
    }
  );
  if (isInCurrentChooseTimeRange) {
    message.warning("该时间段已被占用");
    if (type == "start") {
      item.begin_time = null;
    } else {
      item.end_time = null;
    }
    return;
  }

  if (
    item.end_time == "" ||
    item.end_time == null ||
    item.begin_time == "" ||
    item.begin_time == null
  )
    return;

  // 开始时间大于结束时间
  const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  const dateS = new Date(0, 0, 0, hoursS, minutesS);
  const dateE = new Date(0, 0, 0, hoursE, minutesE);

  if (dateS >= dateE) {
    message.warning("开始时间不能大于结束时间");
    if (type == "start") {
      item.begin_time = null; // 必须为null才能置空
    } else {
      item.end_time = null;
    }
  }
};

const onChangeTime = (v, item, type, index) => {
  // let rowData = { ...item };
  if (v == "" || v == null) return;
  const value = convertHHMMToMinutes(v); // 转换为第几分钟的数值
  chooseTimeIsInRange(value, item, type, index);
  // if (index == 0) {
  //   if (type == "start") {
  //     // 结束时间没有选择
  //     if (
  //       item.end_time == "" ||
  //       item.end_time == null ||
  //       item.begin_time == "" ||
  //       item.begin_time == null
  //     )
  //       return;

  //     // 开始时间大于结束时间
  //     const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  //     const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  //     const dateS = new Date(0, 0, 0, hoursS, minutesS);
  //     const dateE = new Date(0, 0, 0, hoursE, minutesE);

  //     if (dateS >= dateE) {
  //       message.warning("开始时间不能大于结束时间");
  //       item.begin_time = null; // 必须为null才能置空
  //     }
  //   } else {
  //     const isInRange = state.rangeTimeCantSelectTime.some((range) => {
  //       const { begin_time, end_time } = range;
  //       return value > begin_time && value < end_time;
  //     });
  //     if (isInRange) {
  //       message.warning("该时间段已被占用");
  //       item.end_time = null;
  //       return;
  //     }
  //     if (
  //       item.end_time == "" ||
  //       item.end_time == null ||
  //       item.begin_time == "" ||
  //       item.begin_time == null
  //     )
  //       return;
  //     // 开始时间大于结束时间
  //     const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  //     const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  //     const dateS = new Date(0, 0, 0, hoursS, minutesS);
  //     const dateE = new Date(0, 0, 0, hoursE, minutesE);

  //     if (dateS >= dateE) {
  //       message.warning("结束时间不能小于开始时间");
  //       item.end_time = null; // 必须为null才能置空
  //     }
  //   }
  // } else {
  //   if (type == "start") {
  //     // 先判断是否在已占用的时间段内
  //     const isInRange = state.rangeTimeCantSelectTime.some((range) => {
  //       const { begin_time, end_time } = range;
  //       return value > begin_time && value < end_time;
  //     });
  //     if (isInRange) {
  //       message.warning("该时间段已被占用");
  //       item.end_time = null;
  //       return;
  //     }

  //     // 再和当前已经选择的时间段进行比较
  //     const isInCurrentChooseTimeRange = state.chooseTimeList.some(
  //       (range, mIndex) => {
  //         if (mIndex == index) return false;
  //         const { begin_time, end_time } = range;
  //         if (
  //           begin_time == "" ||
  //           begin_time == null ||
  //           end_time == "" ||
  //           end_time == null
  //         )
  //           return false;

  //         let begin = convertHHMMToMinutes(begin_time);
  //         let end = convertHHMMToMinutes(end_time);
  //         return value > begin && value < end;
  //       }
  //     );
  //     if (isInCurrentChooseTimeRange) {
  //       message.warning("该时间段已被占用");
  //       item.begin_time = null;
  //       return;
  //     }

  //     // 结束时间没有选择
  //     if (
  //       item.end_time == "" ||
  //       item.end_time == null ||
  //       item.begin_time == "" ||
  //       item.begin_time == null
  //     )
  //       return;

  //     // 开始时间大于结束时间
  //     const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  //     const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  //     const dateS = new Date(0, 0, 0, hoursS, minutesS);
  //     const dateE = new Date(0, 0, 0, hoursE, minutesE);

  //     if (dateS >= dateE) {
  //       message.warning("开始时间不能大于结束时间");
  //       item.begin_time = null; // 必须为null才能置空
  //     }
  //   } else {
  //     const isInRange = state.rangeTimeCantSelectTime.some((range) => {
  //       const { begin_time, end_time } = range;
  //       return value > begin_time && value < end_time;
  //     });
  //     if (isInRange) {
  //       message.warning("该时间段已被占用");
  //       item.end_time = null;
  //       return;
  //     }
  //     // 再和当前已经选择的时间段进行比较
  //     const isInCurrentChooseTimeRange = state.chooseTimeList.some(
  //       (range, mIndex) => {
  //         if (mIndex == index) return false;
  //         const { begin_time, end_time } = range;
  //         if (
  //           begin_time == "" ||
  //           begin_time == null ||
  //           end_time == "" ||
  //           end_time == null
  //         )
  //           return false;
  //         let begin = convertHHMMToMinutes(begin_time);
  //         let end = convertHHMMToMinutes(end_time);
  //         return value > begin && value < end;
  //       }
  //     );

  //     if (isInCurrentChooseTimeRange) {
  //       message.warning("该时间段已被占用");
  //       item.begin_time = null;
  //       return;
  //     }
  //     if (
  //       item.end_time == "" ||
  //       item.end_time == null ||
  //       item.begin_time == "" ||
  //       item.begin_time == null
  //     )
  //       return;
  //     // 开始时间大于结束时间
  //     const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  //     const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  //     const dateS = new Date(0, 0, 0, hoursS, minutesS);
  //     const dateE = new Date(0, 0, 0, hoursE, minutesE);

  //     if (dateS >= dateE) {
  //       message.warning("结束时间不能小于开始时间");
  //       item.end_time = null; // 必须为null才能置空
  //     }
  //   }
  // }

  // if (type == "start") {
  //   // 结束时间没有选择
  //   if (
  //     item.end_time == "" ||
  //     item.end_time == null ||
  //     item.begin_time == "" ||
  //     item.begin_time == null
  //   )
  //     return;
  //   // 开始时间大于结束时间
  //   const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  //   const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  //   const dateS = new Date(0, 0, 0, hoursS, minutesS);
  //   const dateE = new Date(0, 0, 0, hoursE, minutesE);

  //   if (dateS >= dateE) {
  //     message.warning("开始时间不能大于结束时间");
  //     item.begin_time = null; // 必须为null才能置空
  //   }
  // } else {
  //   // rowData.end_time = rowData.end_time * 60;
  //   if (
  //     item.end_time == "" ||
  //     item.end_time == null ||
  //     item.begin_time == "" ||
  //     item.begin_time == null
  //   )
  //     return;
  //   // 开始时间大于结束时间
  //   const [hoursS, minutesS] = item?.begin_time?.split(":").map(Number);
  //   const [hoursE, minutesE] = item?.end_time?.split(":").map(Number);

  //   const dateS = new Date(0, 0, 0, hoursS, minutesS);
  //   const dateE = new Date(0, 0, 0, hoursE, minutesE);

  //   if (dateS >= dateE) {
  //     message.warning("结束时间不能小于开始时间");
  //     item.end_time = null; // 必须为null才能置空
  //   }
  // }
};

const filterFileUpload = (files) => {
  let list = files || [];

  list = list.map((e) => {
    let fileRow = {};
    if (e?.status == "done" && e?.response?.code == 0) {
      fileRow = e?.response?.data;
    }
    return fileRow;
  });

  return list;
};

const fileUpload = (data, type) => {
  console.log(data, type);
  if (type == "poster") {
    state.poster = filterFileUpload(data);
  } else if (type == "approve") {
    state.approve = filterFileUpload(data);
  } else if (type == "publicize") {
    state.publicize = filterFileUpload(data);
  } else if (type == "plan") {
    state.plan = filterFileUpload(data);
  } else if (type == "materials") {
    state.materials = filterFileUpload(data);
  }

  console.log(state);
};

const showAreaName = () => {
  let { top_name, top_en_name, storey_name, storey_en_name, name, enname } =
    state.activityApplyInfo;

  return `${top_name}-${storey_name}-${name}`;
};

const showAreaType = () => {
  let info = state.activityApplyInfo?.categorys?.find(
    (e) => e?.id == state.submitData?.cate_id
  );

  return info?.name || "";
};

const showAreaTimes = () => {
  let { time } = state.submitData;
  let nTimes = time?.map((e) => {
    return `${e?.start_time} ~ ${e?.end_time}`;
  });

  return nTimes?.length ? nTimes.join(", ") : "";
};

const handleShow = (v) => {
  if (!v && state.apptResult?.type == "success") {
    router.replace("/");
  }
};
</script>
<template>
  <div class="apply" ref="containerRef">
    <a-affix :offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/activity_application')"
              >选择空间</a-breadcrumb-item
            >
            <a-breadcrumb-item>填写申请信息</a-breadcrumb-item>
            <!-- <a-breadcrumb-item>1</a-breadcrumb-item> -->
          </a-breadcrumb>
        </div>
      </div>
    </a-affix>
    <div class="content">
      <div class="left">
        <div class="left_top">
          <div v-if="state?.topImg" class="left_top_left">
            <img style="width: 90%; height: 100%" :src="state.topImg" alt="" />
            <div class="left_top_badge" :class="{ greenBadge: false }">
              {{ state.leftBadge }}
            </div>
          </div>
          <div class="left_top_right">
            <ActivitySpaceSwipe
              v-if="state.activityApplyInfo?.brother_area?.length"
              :data="state.activityApplyInfo"
              :defaultId="state.initQuerySpaceId"
              @changeSlide="onChangeSlide"
              @viewInfo="fetchGetActivityDetailInfo"
              @viewFloor="onViewFloor"
            />
          </div>
        </div>
        <div class="left_bottom">
          <div class="left_bottom_title">时间选择</div>
          <van-row
            v-if="state?.calendarInfo?.list?.length"
            class="time_select_box"
          >
            <van-col span="12">
              <div class="time_select_box_text">
                <div class="time_select_box_text_left">
                  点击您想要选择的日期<span>（可选择多天）</span>
                </div>
                <span class="can_book">有预约:</span>
              </div>
              <div class="calendar_box">
                <Calendar
                  :calendarInfo="state.calendarInfo"
                  @onSelected="onSelected"
                />
              </div>
            </van-col>
            <van-col v-if="state.selectChooseTime" span="10" offset="2">
              <div class="selected_time_text">
                已选时间：<span
                  >{{ exchangeDateTime(state.selectDateInfo[0], 2) }} ~
                  {{ exchangeDateTime(state.selectDateInfo[1], 2) }}</span
                >
              </div>
              <div
                class="choose_time_box"
                v-for="(item, index) in state.chooseTimeList"
                :key="index"
              >
                <div class="choose_time_item">
                  <a-time-picker
                    format="HH:mm"
                    valueFormat="HH:mm"
                    :bordered="false"
                    style="width: 100%"
                    hideDisabledOptions
                    size="middle"
                    :showNow="false"
                    :minuteStep="15"
                    v-model:value="item.begin_time"
                    placeholder="开始时间"
                    @change="(v) => onChangeTime(v, item, 'start', index)"
                  />
                </div>
                <div>~</div>
                <div class="choose_time_item">
                  <a-time-picker
                    format="HH:mm"
                    valueFormat="HH:mm"
                    :bordered="false"
                    style="width: 100%"
                    hideDisabledOptions
                    size="middle"
                    :showNow="false"
                    :minuteStep="15"
                    v-model:value="item.end_time"
                    placeholder="结束时间"
                    @change="(v) => onChangeTime(v, item, 'end', index)"
                  />
                </div>

                <img
                  v-if="index == 0"
                  @click="addTimeSlot"
                  src="@/assets/activity_application/add_one_time.svg"
                  alt=""
                />
                <img
                  v-if="index != 0"
                  @click="removeTimeSlot"
                  src="@/assets/activity_application/remove_one_time.svg"
                  alt=""
                />
              </div>
            </van-col>
          </van-row>

          <div v-if="state.selectSlideShow" style="margin-top: 12px">
            <div class="sliderSlt">
              <div>已选日期：<span class="sltText">2024-11-26</span></div>
            </div>
            <SliderCom
              :options="state.sliderConfig"
              v-model:value="state.sliderVal"
            />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right_top">
          <div class="right_top_title">申请信息</div>
          <!-- 活动类型 -->
          <van-row class="right_top_item">
            <van-col span="2" class="right_top_item_title">
              <span class="required">*</span>活动类型:
            </van-col>
            <van-col span="22">
              <a-radio-group v-model:value="state.filterActivityTypeId">
                <a-radio
                  v-for="item in state.activityApplyInfo?.categorys"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </van-col>
          </van-row>
          <!-- 申请主题 -->
          <van-row
            class="right_top_item"
            align="center"
            v-if="filterArguments('title')"
          >
            <van-col span="2" class="right_top_item_title"
              ><span class="required">*</span>申请主题:
            </van-col>
            <van-col span="22">
              <a-input
                placeholder="填写后将在活动报名页面展示"
                v-model:value="state.filterActivityTheme"
                size="middle"
              />
            </van-col>
          </van-row>
          <!-- 申请内容 -->
          <van-row class="right_top_item" v-if="filterArguments('content')">
            <van-col span="2" class="right_top_item_title"
              ><span class="required">*</span>申请内容:
            </van-col>
            <van-col span="22">
              <a-textarea
                placeholder="填写后将在活动报名页面展示"
                v-model:value="state.filterActivityContent"
                size="middle"
                show-count
                :autoSize="{ minRows: 3, maxRows: 5 }"
                :maxlength="200"
              />
            </van-col>
          </van-row>

          <van-row class="right_top_item">
            <!-- 最多人数 -->
            <van-col span="10" v-if="filterArguments('max')">
              <van-row align="center">
                <van-col span="5" class="right_top_item_title">
                  <span class="required">*</span>最多人数:
                </van-col>
                <van-col span="19">
                  <a-input
                    placeholder="请输入最多人数"
                    v-model:value="state.filterActivityMaxPeople"
                    size="middle"
                  />
                </van-col>
              </van-row>
            </van-col>
            <!-- 联系电话 -->
            <van-col span="12" offset="2" v-if="filterArguments('mobile')">
              <van-row align="center">
                <van-col span="4" class="right_top_item_title">
                  <span class="required">*</span>联系电话:
                </van-col>
                <van-col span="20">
                  <a-input
                    placeholder="请输入联系电话"
                    v-model:value="state.filterActivityMobile"
                    size="middle"
                  />
                </van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
        <div class="right_bottom">
          <div class="right_bottom_title">上传活动资料</div>
          <van-row class="upload_item">
            <!-- 审批附件 -->
            <van-col span="14" v-if="filterArguments('approve')">
              <div class="upload_file_title">
                <span style="color: #ff4d4f">*</span>审批附件:
              </div>
              <Uploader
                :initFileList="state.initApprove"
                filePath="activity"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v, 'approve')"
                accept="application/pdf,application/msword"
              >
                <div class="upload_file_box">
                  <img
                    src="@/assets/activity_application/upload_file.svg"
                    alt=""
                  />
                  Word/PDF
                </div>
              </Uploader>
            </van-col>
            <!-- 活动海报 -->
            <van-col span="10" v-if="filterArguments('poster')">
              <div class="upload_file_title">
                <span style="color: #ff4d4f">*</span>活动海报:
              </div>
              <Uploader
                filePath="activity"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v, 'poster')"
                accept=".png, .jpg, .jpeg"
              >
                <div class="upload_file_box">
                  <img
                    src="@/assets/activity_application/upload_file.svg"
                    alt=""
                  />
                  jpg/jpeg/png
                </div>
              </Uploader>
            </van-col>
          </van-row>
          <van-row class="upload_item margin_top_50">
            <!-- 活动策划案 -->
            <van-col span="14" v-if="filterArguments('plan')">
              <div class="upload_file_title">
                <span style="color: #ff4d4f">*</span>活动策划案:
              </div>

              <Uploader
                filePath="activity"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v, 'plan')"
                accept="application/pdf,application/msword"
              >
                <div class="upload_file_box">
                  <img
                    src="@/assets/activity_application/upload_file.svg"
                    alt=""
                  />
                  Word/PDF
                </div>
              </Uploader>
            </van-col>
            <!-- 宣传片 -->
            <van-col span="10" v-if="filterArguments('publicize')">
              <div class="upload_file_title">宣传片:</div>
              <Uploader
                filePath="activity"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v, 'publicize')"
                accept=".png, .jpg, .jpeg"
              >
                <div class="upload_file_box">
                  <img
                    src="@/assets/activity_application/upload_file.svg"
                    alt=""
                  />
                  jpg/jpeg/png
                </div>
              </Uploader>
            </van-col>
          </van-row>
          <van-row class="upload_item margin_top_50">
            <!-- 其他申请材料 -->
            <van-col span="14" v-if="filterArguments('materials')">
              <div class="upload_file_title">其他申请材料:</div>
              <Uploader
                filePath="activity"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v, 'v')"
                accept="application/pdf,application/msword"
              >
                <div class="upload_file_box">
                  <img
                    src="@/assets/activity_application/upload_file.svg"
                    alt=""
                  />
                  Word/PDF
                </div>
              </Uploader>
            </van-col>
          </van-row>
          <div class="bottom_btn">
            <van-button
              :disabled="bottomBtnDisabled()"
              round
              type="primary"
              style="width: 200px"
              @click="onSubmit"
              >立即申请</van-button
            >
          </div>
        </div>
      </div>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.activityDetailInfoShow"
      title="空间详情"
      @ok="state.activityDetailInfoShow = false"
      destroyOnClose
      okText="确认"
      cancelText="关闭"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <LibraryInfo
        v-if="state.activityDetailInfo?.id"
        :data="state.activityDetailInfo"
      />
    </a-modal>

    <SpaceRuleConfirm
      v-if="state.ruleShow"
      v-model:open="state.ruleShow"
      :content="state.ruleInfo?.content"
      @onConfirm="() => onSubmit('rule')"
    >
      <template v-slot:content>
        <div class="showArea">
          <div class="tag">当前预约选择</div>
          <div class="showCon">
            <div class="item">
              <p>
                空间：<span>{{ showAreaName() }}</span>
              </p>
              <p>
                类型：<span>{{ showAreaType() }}</span>
              </p>
            </div>
            <div class="item">
              <p>
                日期：<span
                  >{{
                    state.selectDateInfo?.length == 2
                      ? `${exchangeDateTime(
                          state?.selectDateInfo[0],
                          2
                        )} ~ ${exchangeDateTime(state?.selectDateInfo[1], 2)}`
                      : `${exchangeDateTime(state?.selectDateInfo[0], 2)}`
                  }}
                </span>
              </p>
              <p>
                人数：<span>≤{{ state.filterActivityMaxPeople || "" }}</span>
              </p>
            </div>
            <div class="item">
              <p>
                时间：<span>{{ showAreaTimes() }}</span>
              </p>
            </div>
          </div>
        </div>
      </template>
    </SpaceRuleConfirm>

    <ShowInfoToast
      v-if="state.apptResult.show"
      :isShow="state.apptResult.show"
      :type="state.apptResult.type"
      :title="state.apptResult.title"
      @handleShow="handleShow"
    >
      <template v-slot:content>
        <div class="toastItem">
          <span>申请人：</span>
          <span>{{ state.apptResult?.name || "" }}</span>
        </div>
        <div class="toastItem">
          <span>预约时间：</span>
          <span>{{ state.apptResult?.show_date || "" }}</span>
        </div>
        <div class="toastItem">
          <span>预约地点：</span>
          <span>{{ state.apptResult?.nameMerge || "" }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>预约提醒：</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
      </template>
    </ShowInfoToast>
  </div>
</template>
<style lang="less" scoped>
.apply {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  .header {
    padding: 20px 30px;
    color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .leftTit {
      font-size: 18px;
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
  .content {
    flex: 1;
    padding: 0 30px;
    display: flex;
    margin-bottom: 30px;
    .left {
      flex: 1.2;
      min-width: 650px;
      background: rgba(247, 249, 251, 1);
      border-radius: 16px;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      .left_top {
        flex: 1;
        margin: 30px;
        margin-bottom: 0;
        padding: 30px;
        background-color: #fff;
        border-radius: 16px;
        display: flex;
        .left_top_left {
          position: relative;
          flex: 1;
          img {
            border-radius: 6px;
            object-fit: cover;
          }
          .left_top_badge {
            position: absolute;
            top: 0;
            left: 0;
            padding: 3px 8px;
            background: #1a49c0;
            border-radius: 6px 0px 6px 0px;
            font-size: 12px;
            color: #ffffff;
          }
        }
        .left_top_right {
          width: 350px;
          padding-left: 10px;
          padding-top: 10px;
        }
      }
      .left_bottom {
        flex: 1.2;
        margin: 12px 30px 12px 30px;
        background-color: #fff;
        border-radius: 16px;
        padding: 30px 30px 12px 30px;
        .left_bottom_title {
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
          font-family: AliHeavy !important;
        }
        .time_select_box {
          margin-top: 12px;
          flex: 1;
          .time_select_box_text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .time_select_box_text_left {
              font-size: 14px;
              color: rgba(97, 97, 97, 1);
              flex: 1;
              span {
                color: rgba(26, 73, 192, 1);
              }
            }
            span {
              position: relative;
              &.can_book {
                font-size: 14px;
                color: rgba(97, 97, 97, 1);
                padding-right: 18px;
                &::after {
                  content: "";
                  position: absolute;
                  top: calc(50% - 7px);
                  right: 0;
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  background-color: rgba(245, 181, 68, 1);
                }
              }
            }
          }
          .calendar_box {
            margin-top: 10px;
            border: 1px solid rgba(4, 4, 21, 0.1);
            border-radius: 4px;
            // height: 255px;
            max-height: 320px;
            overflow-y: auto;
            &::-webkit-scrollbar {
              display: none; /* 隐藏滚动条 */
            }

            scrollbar-width: none; /* Firefox 隐藏滚动条 */
            -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
          }

          .selected_time_text {
            text-align: center;
            margin-bottom: 10px;
            color: rgba(97, 97, 97, 1);
            font-size: 14px;
            span {
              color: rgba(26, 73, 192, 1);
            }
          }
          .choose_time_box {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            .choose_time_item {
              width: 150px;
              border: 1px solid #cecfd5;
              border-radius: 18px;
            }
          }
        }
      }
      .sliderSlt {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #616161;
        font-size: 14px;
        .sltText {
          color: var(--primary-color);
        }
        .sltDot {
          span {
            position: relative;
            &::after {
              content: "";
              width: 10px;
              height: 8px;
              background: #e0e0e0;
              position: absolute;
              left: -15px;
              top: 50%;
              transform: translateY(-50%);
            }

            &:first-child {
              margin-right: 44px;
            }

            &.noselectable {
              &::after {
                background: #6f6f6f;
              }
            }
          }
        }
      }
    }
    .right {
      flex: 1.3;
      background: rgba(247, 249, 251, 1);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      .right_top {
        flex: 1;
        margin: 30px;
        margin-bottom: 0;
        padding: 30px;
        background-color: #fff;
        border-radius: 16px;
        .right_top_title {
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
          font-family: AliHeavy !important;
        }
        .right_top_item {
          margin-top: 20px;
          .required {
            color: red;
          }
          .right_top_item_title {
            color: rgba(32, 32, 32, 1);
            font-size: 14px;
          }
          .margin_top_50 {
            margin-top: 50px;
          }
        }
      }
      .right_bottom {
        position: relative;
        flex: 1.3;
        margin: 30px;
        padding: 30px;
        background-color: #fff;
        border-radius: 16px;
        .right_bottom_title {
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
          font-family: AliHeavy !important;
        }
        .upload_item {
          margin-top: 20px;
          .upload_file_title {
            color: rgba(32, 32, 32, 1);
            font-size: 14px;
          }
          .upload_file_box {
            cursor: pointer;
            margin-top: 12px;
            color: rgba(134, 134, 134, 1);
            font-size: 12px;
          }
        }
        .margin_top_50 {
          margin-top: 50px;
        }
        .bottom_btn {
          position: absolute;
          bottom: 30px;
          right: 30px;
        }
      }
    }
  }
}
.toastItem {
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #616161;
  margin-bottom: 10px;
  span {
    &:nth-child(2) {
      flex: 1;
    }
  }
}
</style>
<style lang="less">
.showArea {
  margin-bottom: 14px;
  background: #f7f7f7;
  border-radius: 8px;
  .tag {
    display: inline-block;
    padding: 4px 14px;
    font-size: 14px;
    color: #202020;
    background-color: #ececec;
    border-radius: 8px 0 8px 0;
  }
  .showCon {
    font-size: 13px;
    padding: 12px 75px 16px 14px;
    .item {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:last-child {
        margin-bottom: 0;
      }
      p {
        &:first-child {
          flex: 1;
        }
        span {
          color: #202020;
        }
      }
    }
  }
}
</style>
