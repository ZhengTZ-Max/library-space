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
  draftActivityApply,
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

import { getUserInfo } from "@/utils";

import { showToast, showImagePreview } from "vant";

const router = useRouter();
const route = useRoute();
const lang = computed(() => store.state.lang);

const containerRef = ref();

const state = reactive({
  userInfo: getUserInfo(),
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
  chooseTimeConfig: {
    step: 15,
    min_range: 10,
    max_range: 1425,
  },
  selectDateInfo: [],
  selectSlideShow: false,
  sliderShow: false,
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
    userName: "",
    location: "",
    time: "",
  },

  rangeTimeCantSelectTime: [],
  CalendarStartHour: "",
  CalendarEndHour: "",
  CalendarStartMinute: "",
  CalendarEndMinute: "",
  draftShow: false,
  submitTimeData: "",
});

onMounted(() => {
  fetchGetActivityApply();

  // 回显测试
  // setTimeout(() => {
  //   state.initApprove = [
  //     {
  //       file_ext: "pdf",
  //       file_name: "NKY2Pj2ipqIUQmFu1732951373143983.pdf",
  //       file_origin_name: "Transactions Explanation.pdf",
  //       file_path:
  //         "/upload/activity/2024-11-30/NKY2Pj2ipqIUQmFu1732951373143983.pdf",
  //       file_size: "524.64 KB",
  //     },
  //   ];
  // }, 3000);
});

watch(
  () => state.userInfo,
  (v) => {
    state.filterActivityMobile = v?.mobile;
  },
  { immediate: true }
);

watch(
  () => state.filterActivityMaxPeople,
  (v) => {
    if (v) {
      if (Number(v) > Number(state.activityApplyInfo.max_person)) {
        showToast({ message: `最大人数不能大于活动最大人数${state.activityApplyInfo.max_person}` });
        state.filterActivityMaxPeople = "";
        return false;
      }
    }
  }
);

const bottomBtnDisabled = () => {
  let submitErr = false;
  if (checkOverlap(state.sliderVal, state.sliderConfig?.disabledArr)?.length) {
    submitErr = true;
  }

  return submitErr;
};

const onSubmit = (type) => {
  try {
    if (state.ruleInfo?.type == "swiper") {
      state.ruleShow = false;
      state.ruleInfo = {};
      return false;
    }
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
        if (e?.begin_time && e?.end_time) {
          params.time.push({
            start_time: e.begin_time,
            end_time: e.end_time,
          });
        }
      });

      if (!params?.time?.length) {
        showToast({ message: "请选择时间段" });
        return false;
      }
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
    if (type == "draft") {
      state.draftShow = false;
      // draftActivity(params);
    } else if (type == "rule") {
      state.submitTimeData = getSubmitTimeData(params);
      applyActivity(params);
    } else {
      state.ruleInfo = { content: state.activityApplyInfo?.should };
      state.ruleShow = true;
      // getRuleInfo(params);
    }
  } catch (e) {}
};

const getSubmitTimeData = (params) => {
  let startTime = params.start_date;
  let endTime = params.end_date;
  let isOneDay = exchangeDateTime(startTime, 2) == exchangeDateTime(endTime, 2);

  const date = isOneDay ? startTime : `${startTime} ~ ${endTime}`;
  const time = params.time
    .map((item) => `${item.start_time} ~ ${item.end_time}`)
    .join(" , ");

  return `${date}\n${time}`;
};

const applyActivity = async (data) => {
  try {
    state.ruleShow = false;

    const res = await activityApply(data);

    state.apptResult = {
      show: true,
      title: res.message,
      type: res?.code == 0 ? "success" : "error",
      msg: (res?.code != 0 && res?.message) || "",
      userName: state.userInfo?.name,
      location: `${state.activityApplyInfo?.top_name}-${state.activityApplyInfo?.storey_name}-${state.activityApplyInfo?.name}`,
      time: state.submitTimeData,
      ...res.data,
    };
  } catch (e) {
    console.log(e);
  }
};

const draftActivity = async (data) => {
  try {
    state.draftShow = false;
    const res = await draftActivityApply(data);
    if (res?.code != 0) {
      message.error(res?.message || "保存失败");
      return false;
    }
    message.success(res?.message || "保存成功");
  } catch (e) {
    console.log(e);
  }
};

const getCurrentTime = () => {
  let findDate = state.calendarInfo?.list?.find(
    (e) => e?.day == exchangeDateTime(state?.selectDateInfo[0], 2)
  );
  console.log(findDate);

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

  setTimeout(() => {
    state.selectSlideShow = true;
    state.sliderShow = true;
  }, 200);
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
  row?.web_plane &&
    showImagePreview({
      images: [row?.web_plane],
      closeable: true,
      closeIconPosition: "top-left",
    });
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
    console.log(state.selectDateInfo);
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

  state.chooseTimeConfig.step = Number(list[0]?.info?.step) || 15;
  state.chooseTimeConfig.min_range = list[0]?.min_time || 0;
  state.chooseTimeConfig.max_range = list[0]?.max_time || 1440;

  list.forEach((e) => {
    e.list.forEach((item) => {
      state.rangeTimeCantSelectTime.push({
        begin_time: item.begin_time,
        end_time: item.end_time,
      });
    });
  });

  let mStartTime = list?.length ? list[0]?.begin_timestamp : "";
  let mEndTime = list?.length ? list[0]?.end_timestamp : "";

  let startTime = moment(mStartTime, "HH:mm:ss").format("HH:mm");
  let endTime = moment(mEndTime, "HH:mm:ss").format("HH:mm");

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  state.CalendarStartHour = startHour;
  state.CalendarStartMinute = startMinute;
  state.CalendarEndHour = endHour;
  state.CalendarEndMinute = endMinute;

  console.log(state.CalendarStartHour, state.CalendarStartMinute);
};

const chooseTimeIsInRange = (value, item, type, index) => {
  // 先判断是否在已占用的时间段内
  const isInRange = state.rangeTimeCantSelectTime.some((range) => {
    const { begin_time, end_time } = range;
    if (type == "start") {
      return value >= begin_time && value < end_time;
    } else {
      return value > begin_time && value <= end_time;
    }
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
      if (type == "start") {
        return value >= begin && value < end;
      } else {
        return value > begin && value <= end;
      }
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
    return;
  }

  // 计算时间差（以分钟为单位）
  const timeDifference = (dateE.getTime() - dateS.getTime()) / (1000 * 60);
  // 判断时间差
  if (timeDifference > state.chooseTimeConfig.max_range) {
    message.warning(
      `预约时间最长时间不能超过${state.chooseTimeConfig.max_range}分钟`
    );
    if (type == "start") {
      item.begin_time = null;
    } else {
      item.end_time = null;
    }
  } else if (timeDifference < state.chooseTimeConfig.min_range) {
    message.warning(
      `预约时间最短时间不能低于${state.chooseTimeConfig.min_range}分钟`
    );
    if (type == "start") {
      item.begin_time = null;
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

const onDisabledTime = (date) => {
  try {
    let startHour = state.CalendarStartHour;
    let endHour = state.CalendarEndHour;

    let startMinute = state.CalendarStartMinute;
    let endMinute = state.CalendarEndMinute;

    console.log(startHour, endHour, startMinute, endMinute);

    return {
      disabledHours: () => {
        // 获取要禁用的小时
        const disabledHours = [];

        // 禁用 0 到 startHour 之前的所有小时
        for (let i = 0; i < startHour; i++) {
          disabledHours.push(i);
        }

        // 禁用 endHour 之后的所有小时
        for (let i = endHour + 1; i <= 23; i++) {
          disabledHours.push(i);
        }

        return disabledHours;
      },
      disabledMinutes: (selectedHour) => {
        console.log(selectedHour);
        // 如果是 startHour，禁用 0 到 startMinute 之前的分钟
        if (selectedHour === startHour) {
          const disabledMinutes = [];
          for (let i = 0; i < startMinute; i++) {
            disabledMinutes.push(i);
          }
          console.log(disabledMinutes);
          return disabledMinutes;
        }

        // 如果是 endHour，禁用 endMinute 之后的分钟
        if (selectedHour === endHour) {
          const disabledMinutes = [];
          for (let i = endMinute + 1; i < 60; i++) {
            disabledMinutes.push(i);
          }
          console.log(disabledMinutes);
          return disabledMinutes;
        }

        return [];
      },
    };
  } catch (e) {
    console.log(e);
  }
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
const onViewRule = () => {
  state.ruleInfo = { content: state.activityApplyInfo?.should, type: "swiper" };
  state.ruleShow = true;
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
            <a-breadcrumb-item @click="goToLink('/activity_application')">{{
              $t("V4_select_a_space")
            }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{
              $t("V4_fill_out_the_application_form")
            }}</a-breadcrumb-item>
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
              @viewRule="onViewRule"
            />
          </div>
        </div>
        <div class="left_bottom">
          <div class="left_bottom_title">{{ $t("V4_time_selection") }}</div>
          <van-row
            v-if="state?.calendarInfo?.list?.length"
            class="time_select_box"
          >
            <van-col span="12">
              <div class="time_select_box_text">
                <div class="time_select_box_text_left">
                  {{ $t("V4_click_on_the_date_you_want_to_select")
                  }}<span>{{
                    "(" + $t("V4_multiple_days_can_be_selected") + ")"
                  }}</span>
                </div>
                <span class="can_book">{{
                  $t("AppointmentExists") + ":"
                }}</span>
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
                {{ $t("SelectedDate") + ":"
                }}<span
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
                    :minuteStep="state.chooseTimeConfig.step"
                    v-model:value="item.begin_time"
                    :disabledTime="onDisabledTime"
                    :placeholder="$t('user_begintime')"
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
                    :minuteStep="state.chooseTimeConfig.step"
                    v-model:value="item.end_time"
                    :disabledTime="onDisabledTime"
                    :placeholder="$t('user_endtime')"
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

          <div
            v-if="state.selectSlideShow && state.sliderShow"
            style="margin-top: 12px"
          >
            <div class="sliderSlt">
              <div>
                {{ $t("SelectedDate") + ":"
                }}<span class="sltText">{{
                  exchangeDateTime(state?.selectDateInfo[0], 2)
                }}</span>
              </div>
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
          <div class="right_top_title">
            {{ $t("V4_application_information") }}
          </div>
          <!-- 活动类型 -->
          <a-flex class="right_top_item" gap="middle" align="center">
            <div>
              <span class="required">*</span>{{ $t("ActivityType") + ":" }}
            </div>
            <div style="flex: 1">
              <a-radio-group v-model:value="state.filterActivityTypeId">
                <a-radio
                  v-for="item in state.activityApplyInfo?.categorys"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
          </a-flex>
          <!-- 申请主题 -->
          <a-flex
            class="right_top_item"
            gap="middle"
            align="center"
            v-if="filterArguments('title')"
          >
            <div>
              <span class="required">*</span
              >{{ $t("V4_application_subject") + ":" }}
            </div>
            <div style="flex: 1">
              <a-input
                placeholder="填写后将在活动报名页面展示"
                v-model:value="state.filterActivityTheme"
                size="middle"
              />
            </div>
          </a-flex>

          <!-- 申请内容 -->
          <a-flex
            class="right_top_item"
            gap="middle"
            align="top"
            v-if="filterArguments('content')"
          >
            <div>
              <span class="required">*</span
              >{{ $t("Application_content") + ":" }}
            </div>
            <div style="flex: 1">
              <a-textarea
                placeholder="填写后将在活动报名页面展示"
                v-model:value="state.filterActivityContent"
                size="middle"
                show-count
                :autoSize="{ minRows: 3, maxRows: 5 }"
                :maxlength="200"
              />
            </div>
          </a-flex>

          <a-flex gap="middle" align="center">
            <div>
              <a-flex
                class="right_top_item"
                gap="middle"
                align="top"
                v-if="filterArguments('max')"
              >
                <div><span class="required">*</span>最多人数:</div>
                <div style="flex: 1">
                  <a-input
                    placeholder="请输入最多人数"
                    v-model:value="state.filterActivityMaxPeople"
                    size="middle"
                  />
                </div>
              </a-flex>
            </div>
            <div>
              <a-flex
                class="right_top_item"
                gap="middle"
                align="top"
                v-if="filterArguments('mobile')"
              >
                <div>
                  <span class="required">*</span>{{ $t("user_phone") + ":" }}
                </div>
                <div style="flex: 1">
                  <a-input
                    :placeholder="$t('Please_type_your_phone_number')"
                    v-model:value="state.filterActivityMobile"
                    size="middle"
                  />
                </div>
              </a-flex>
            </div>
          </a-flex>
        </div>
        <div class="right_bottom">
          <div class="right_bottom_title">
            {{ $t("V4_upload_event_materials") }}
          </div>
          <van-row class="upload_item">
            <!-- 审批附件 -->
            <van-col span="14" v-if="filterArguments('approve')">
              <div class="upload_file_title">
                <span style="color: #ff4d4f">*</span
                >{{ $t("V4_approval_attachments") + ":" }}
              </div>
              <Uploader
                :initFileList="state.initApprove"
                filePath="activity"
                :showUploadList="true"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v, 'approve')"
                accept="application/pdf,application/msword"
                list-type="picture"
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
                <span style="color: #ff4d4f">*</span
                >{{ $t("V4_event_poster") + ":" }}
              </div>
              <Uploader
                filePath="activity"
                :maxCount="1"
                :showUploadList="true"
                @onFileUpload="(v) => fileUpload(v, 'poster')"
                accept=".png, .jpg, .jpeg"
                list-type="picture"
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
                <span style="color: #ff4d4f">*</span
                >{{ $t("V4_event_plan") + ":" }}
              </div>

              <Uploader
                filePath="activity"
                :maxCount="1"
                :showUploadList="true"
                @onFileUpload="(v) => fileUpload(v, 'plan')"
                accept="application/pdf,application/msword"
                list-type="picture"
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
              <div class="upload_file_title">
                {{ $t("V4_promotional_video") + ":" }}
              </div>
              <Uploader
                filePath="activity"
                :maxCount="1"
                :showUploadList="true"
                @onFileUpload="(v) => fileUpload(v, 'publicize')"
                accept=".png, .jpg, .jpeg"
                list-type="picture"
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
                :showUploadList="true"
                @onFileUpload="(v) => fileUpload(v, 'materials')"
                accept="application/pdf,application/msword"
                list-type="picture"
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
              style="width: 100px"
              @click="onSubmit"
              >{{ $t("V4_apply_now") }}</van-button
            >
          </div>
          <div class="bottom_btn_draft">
            <van-button
              round
              type="primary"
              style="width: 100px"
              @click="state.draftShow = true"
              >存草稿</van-button
            >
          </div>
        </div>
      </div>
    </div>

    <a-modal
      width="980px"
      v-model:open="state.activityDetailInfoShow"
      title="空间详情"
      @ok="state.activityDetailInfoShow = false"
      destroyOnClose
      :footer="false"
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
      <div style="display: flex; justify-content: center">
        <button
          class="space_detail_btn"
          @click="state.activityDetailInfoShow = false"
        >
          {{ $t("feedback_details_close") }}
        </button>
      </div>
    </a-modal>

    <SpaceRuleConfirm
      v-if="state.ruleShow"
      v-model:open="state.ruleShow"
      :content="state.ruleInfo?.content"
      @onConfirm="() => onSubmit('rule')"
      :review="state.ruleInfo?.type == 'swiper'"
    >
      <template v-if="state.ruleInfo?.type != 'swiper'" v-slot:content>
        <div class="showArea">
          <div class="tag">{{ $t("V4_current_reservation_selection") }}</div>
          <div class="showCon">
            <a-flex justify="space-between" align="flex-start">
              <a-flex vertical>
                <p>
                  {{ $t("Space") + "：" }}<span>{{ showAreaName() }}</span>
                </p>
                <p>
                {{ $t("Date") + "："
                }}<span
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
                {{ $t("Time") + "：" }}<span>{{ showAreaTimes() }}</span>
              </p>
              </a-flex>
              <a-flex vertical >
                <p>
                  {{ $t("type") + "：" }}<span>{{ showAreaType() }}</span>
                </p>
                <p>
                {{ $t("Number_Of_People") + "："
                }}<span>≤{{ state.filterActivityMaxPeople || "" }}</span>
              </p>
              </a-flex>
            </a-flex>

            <!-- <div class="item">
              <p>
                {{ $t("Space") + "：" }}<span>{{ showAreaName() }}</span>
              </p>
              <p>
                {{ $t("type") + "：" }}<span>{{ showAreaType() }}</span>
              </p>
            </div>
            <div class="item">
              <p>
                {{ $t("Date") + "："
                }}<span
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
                {{ $t("Number_Of_People") + "："
                }}<span>≤{{ state.filterActivityMaxPeople || "" }}</span>
              </p>
            </div>
            <div class="item">
              <p>
                {{ $t("Time") + "：" }}<span>{{ showAreaTimes() }}</span>
              </p>
            </div> -->
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
          <span>{{ $t("V4_applicant") + ":" }}</span>
          <span>{{ state.apptResult?.userName || "" }}</span>
        </div>
        <div class="toastItem">
          <span>{{ $t("user_booktime") + ":" }}</span>
          <span>{{ state.apptResult?.time || "" }}</span>
        </div>
        <div class="toastItem">
          <span>{{ $t("Reservation_location") + ":" }}</span>
          <span>{{ state.apptResult?.location || "" }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>{{ $t("visitor_Reservation_Remind") + ":" }}</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
      </template>
    </ShowInfoToast>

    <van-dialog
      v-model:show="state.draftShow"
      :title="$t('V4_prompt')"
      message-align="center"
      show-cancel-button
      @cancel="state.draftShow = false"
      @confirm="() => onSubmit('draft')"
      :confirmButtonText="$t('user_submit')"
      :cancelButtonText="$t('visitor_Cancel')"
      cancelButtonColor="#808080"
    >
      <div
        style="
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
          text-align: center;
          margin-top: 20px;
          margin-bottom: 20px;
        "
      >
        是否存为草稿?
      </div>
    </van-dialog>
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
          // font-family: AliHeavy !important;
          font-weight: bold;
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
          // font-family: AliHeavy !important;
          font-weight: bold;
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
          // font-family: AliHeavy !important;
          font-weight: bold;
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
        .bottom_btn_draft {
          position: absolute;
          bottom: 30px;
          right: 140px;
        }
      }
    }
  }
}

.space_detail_btn {
  margin-top: 20px;
  width: 150px;
  border-radius: 12px;
  background: #f3f4f7;
  border: 1px solid #cecfd5;
  color: #8c8f9e; /* 按钮文字颜色 */
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
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
