<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import moment from "moment";
import { showToast, showImagePreview } from "vant";
import {
  getSpaceApply,
  getSpaceDetail,
  getSpaceShould,
  getSpaceGroup,
  fetchSpaceSubmit,
} from "@/request/space";
import {
  exchangeDateTime,
  checkOverlap,
  convertMinutesToHHMM,
  getDates,
  getUserInfo,
  convertHHMMToMinutes,
} from "@/utils";

import SpaceApplySwipe from "@/components/SpaceCom/SpaceApplySwipe.vue";
import LibraryInfo from "@/components/LibraryInfo.vue";
import Calendar from "@/components/ActivityApplication/Calendar.vue";
import Uploader from "@/components/Uploader.vue";
import SliderCom from "@/components/SliderCom.vue";
import SpaceRuleConfirm from "@/components/SpaceSeat/SpaceRuleConfirm.vue";
import ShowInfoToast from "@/components/ShowInfoToast.vue";

const router = useRouter();
const route = useRoute();

const state = reactive({
  UserInfo: getUserInfo(),

  initQuerySpaceId: route?.query?.id || "",

  argumentArray: [],

  spaceApplyInfo: {},
  spaceDetailInfo: {},
  spaceDetailInfoShow: false,

  calendarInfo: {
    dateList: [],
    list: [],
    startDate: "",
    endDate: "",
  },
  axisTimeList: [],
  dateIndex: "",
  selectDateInfo: [],
  selectSlideShow: false,
  selectChooseTime: false,
  filterRows: {
    date: "",
    time: "",
    times: {},
  },

  topImg: "",
  filterActivityTheme: "",
  filterActivityContent: "",
  filterActivityMobile: "",

  bottomBtnDisabled: true,

  chooseRadioTime: "",
  chooseTimeList: [{ begin_time: "", end_time: "" }],
  addPeople: "",
  addPeopleList: [],
  isOpen: 0,
  initFileList: [],
  fileList: [],

  sliderShow: false,
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

  ruleShow: false,
  ruleInfo: { content: "" },

  rangeTimeCantSelectTime: [],
  CalendarMin_time: 0,
  CalendarMax_time: 0,
  CalendarStartTime: "",
  CalendarEndTime: "",

  submitData: {},

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },
});

watch(
  () => state.dateIndex,
  (v) => {
    if (v) {
      state.sliderShow = false;

      let { start_time, end_time, min_time, max_time, list } = v?.info;
      state.sliderConfig.startTime = start_time;
      state.sliderConfig.endTime = end_time;
      state.sliderConfig.minRange = Number(min_time);
      state.sliderConfig.maxRange = Number(max_time);

      state.sliderConfig.disabledArr = list?.map((e) => {
        return [e?.begin_num, e?.end_num];
      });

      if (exchangeDateTime(v.date, 2) == exchangeDateTime(new Date(), 2)) {
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
        state.sliderShow = true;
      }, 200);
    }
  }
);

watch(
  () => state.UserInfo,
  (v) => {
    state.filterActivityMobile = v?.mobile;
  },
  { immediate: true }
);

onMounted(() => {
  fetchGetSpaceApply();
});

const goToLink = (link, goBack = false) => {
  if (goBack) {
    router.go(-1);
  } else {
    router.replace(link);
  }
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

const fetchGetSpaceApply = async () => {
  try {
    let params = {
      id: state.initQuerySpaceId,
    };
    let res = await getSpaceApply(params);
    if (res.code != 0) return;
    state.spaceApplyInfo = res?.data?.detail || {};
    state.calendarInfo.dateList = res?.data?.axis?.date || [];
    state.calendarInfo.list = res?.data?.axis?.list || [];
    if ([2, 6]?.includes(Number(state.spaceApplyInfo?.type_id))) {
      state.dateIndex = state.calendarInfo.list[0];
    }

    // 获取日历 开始时间 结束时间
    if (state.calendarInfo.list.length) {
      state.calendarInfo.startDate = state.calendarInfo.dateList[0];
      state.calendarInfo.endDate =
        state.calendarInfo.dateList[state.calendarInfo.dateList.length - 1];
    }

    // 大型空间 半日预约
    if (state?.spaceApplyInfo?.earlierPeriods == 3) {
      state.axisTimeList = res?.data?.axis?.category || [];
    }

    // // 模拟数据
    // state.calendarInfo.list[0].status = -1;
    // state.calendarInfo.list[1].status = 0;
    // state.calendarInfo.list[1].list.push({
    //   date: "2024-11-23",
    //   begin_timestamp: "2024-11-23 08:00:00",
    //   end_timestamp: "2024-11-23 19:00:00",
    //   begin_time: 480,
    //   end_time: 540,
    // });

    state.argumentArray = res?.data?.argument || [];
    state.topImg = res?.data?.detail?.image_url || "";

    if (state.spaceApplyInfo.maxPerson > 1) {
      state.spaceApplyInfo.maxPerson = state.spaceApplyInfo.maxPerson - 1;
    }
  } catch (e) {
    console.log(e);
  }
};
const fetchGetSpaceDetailInfo = async () => {
  try {
    let params = {
      id: state.initQuerySpaceId,
    };
    let res = await getSpaceDetail(params);
    if (res.code != 0) return;
    state.spaceDetailInfo = { ...res?.data, type: "space" } || {};
    state.spaceDetailInfoShow = true;
    console.log(state.spaceDetailInfo);
  } catch (e) {
    console.log(e);
  }
};

const onChangeSlide = (row) => {
  state.initQuerySpaceId = row?.id;
  fetchGetSpaceApply();
  console.log(row);
};

const onViewFloor = () => {
  state.spaceApplyInfo?.image_url &&
    showImagePreview({
      images: [state.spaceApplyInfo?.image_url],
      closeable: true,
      closeIconPosition: "top-left",
    });
};

const filterArguments = (key) => {
  return state.argumentArray?.some((e) => e.key == key) || false;
};

const onDisabledTime = (date) => {
  let startHour = state.CalendarStartTime;
  let endHour = state.CalendarEndTime;
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
  };
};

const onSelected = (date) => {
  if (state.spaceApplyInfo?.earlierPeriods == 0) {
    // 获取当前选择时间范围中 后端返回的已经占用的时间段
    chooseTimeList: [{ begin_time: "", end_time: "" }],
      getCurrentChooseTimeHaveSelectTime();
  } else {
    getDateStatus();

    if (state.axisTimeList?.length) {
      state.chooseRadioTime = "";
    }
  }
};

const getCurrentChooseTimeHaveSelectTime = () => {
  if (!state.selectDateInfo?.length) return;
  let startIndex = -1;
  let endIndex = -1;

  if (state.selectDateInfo?.length == 1) {
    endIndex = startIndex = state.calendarInfo.list.findIndex(
      (item) => item.date === exchangeDateTime(state.selectDateInfo[0], 2)
    );
  } else {
    let [startDate, endDate] = state.selectDateInfo;

    startIndex = state.calendarInfo.list.findIndex(
      (item) => item.date === exchangeDateTime(startDate, 2)
    );
    endIndex = state.calendarInfo.list.findIndex(
      (item) => item.date === exchangeDateTime(endDate, 2)
    );
  }

  if (startIndex === -1 || endIndex === -1) {
    return []; // 如果没有找到日期，返回空数组
  }

  // 确保 startIndex 小于 endIndex
  const [minIndex, maxIndex] =
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

  const list = state.calendarInfo.list.slice(minIndex, maxIndex + 1); // 包含 endDate
  list.forEach((e) => {
    e.info.list.forEach((item) => {
      state.rangeTimeCantSelectTime.push({
        begin_time: item.begin_num,
        end_time: item.end_num,
      });
    });
  });

  state.CalendarMin_time = list?.length ? list[0]?.info?.min_time : 0;
  state.CalendarMax_time = list?.length ? list[0]?.info?.max_time : 0;
  let mStartTime = list?.length ? list[0]?.info?.start_timestamp : "";
  let mEndTime = list?.length ? list[0]?.info?.end_timestamp : "";

  let startTime = moment(mStartTime, "YYYY-MM-DD HH:mm:ss").format("HH:mm");
  let endTime = moment(mEndTime, "YYYY-MM-DD HH:mm:ss").format("HH:mm");

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  state.CalendarStartTime = startHour;
  state.CalendarEndTime = endHour;
};

const onChangeTime = (v, item, type, index) => {
  // let rowData = { ...item };
  if (v == "" || v == null) return;
  const value = convertHHMMToMinutes(v); // 转换为第几分钟的数值
  chooseTimeIsInRange(value, item, type, index);
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
  if (timeDifference > state.max_time) {
    message.warning(`预约时间最长时间不能超过${state.max_time}分钟`);
    if (type == "start") {
      item.begin_time = null;
    } else {
      item.end_time = null;
    }
  } else if (timeDifference < state.min_time) {
    message.warning(`预约时间最短时间不能低于${state.min_time}分钟`);
    if (type == "start") {
      item.begin_time = null;
    } else {
      item.end_time = null;
    }
  }
};

const fileUpload = (data) => {
  console.log(data);
  state.fileList = data;
};

const onChangeDateAct = (date) => {
  state.dateIndex = date;
};

const addPeople = () => {
  if (state.addPeopleList?.find((e) => e?.id == state.addPeople)) {
    message.warning(`已添加该成员`);
    return false;
  }
  addGroupPeople();
};

const addGroupPeople = async (id) => {
  try {
    let params = {
      begin_time: "2024-04-02 09:15",
      member_id: state.addPeople,
      finish_time: "2024-04-02 09:45",
      area_id: 66,
    };

    const res = await getSpaceGroup(params);
    if (res?.code != 0) {
      showToast({ message: res?.message });
      return false;
    }

    state.addPeople = "";
    state.addPeopleList.push(res?.data);
    message.success(res?.message);
  } catch (e) {
    console.log(e);
  }
};

const removePeople = (index) => {
  state.addPeopleList.splice(index, 1);
};

const onSubmit = (type) => {
  try {
    // let placeholder = lang == "en" ? `placeholder_en` : `placeholder`;
    let {
      filterActivityTheme,
      filterActivityContent,
      filterActivityMobile,
      isOpen,
    } = state;

    let { date: sliderDate, info: dateInfo } = state.dateIndex;

    let { type_id, earlierPeriods, minPerson } = state.spaceApplyInfo;
    let params = {
      area_id: state.initQuerySpaceId,
      start_date: "",
      end_date: "",
      title: filterActivityTheme || "",
      title_id: "",
      content: filterActivityContent || "",
      open: isOpen,
      team: "",
      mobile: filterActivityMobile || "",
      time: [],
      file: [],
    };

    // 单日期逻辑处理
    if (sliderDate) {
      params.start_date = sliderDate;
      params.end_date = sliderDate;
      params.time = [
        {
          start_time: convertMinutesToHHMM(state.sliderVal[0]),
          end_time: convertMinutesToHHMM(state.sliderVal[1]),
        },
      ];
    }

    let min_person = "";
    if (type_id == 5) {
      min_person = minPerson;
      console.log(!state.selectDateInfo?.length);
      // if (!state.selectDateInfo?.length) {
      //   message.warning(`请选择预约日期`);
      //   return false;
      // } else if (!state.chooseRadioTime) {
      //   message.warning(`请选择预约时间`);
      //   return false;
      // }
      if (earlierPeriods == 3) {
        if (!state.chooseRadioTime) {
          message.warning(`请选择预约时间3`);
          return false;
        }
        params.cate_id = state.chooseRadioTime;
      }
      if (earlierPeriods == 0) {
        if (!state.selectDateInfo?.length) {
          message.warning(`请选择预约日期`);
          return false;
        }
        // 大型空间自定义时间段
        state.chooseTimeList.forEach((e) => {
          params.time.push({
            start_time: e.begin_time,
            end_time: e.end_time,
          });
        });
      }
      params.start_date = exchangeDateTime(state.selectDateInfo[0], 2);
      params.end_date = exchangeDateTime(state.selectDateInfo[1], 2);
    } else {
      min_person = dateInfo?.min_person;
    }

    // 添加参与人员逻辑处理
    let peopleList = state?.addPeopleList;
    if (!(peopleList?.length + 1 >= min_person)) {
      message.warning(`至少有${min_person - 1}位参与人员`);
      return false;
    } else if (peopleList?.length) {
      let arr = peopleList.map((e) => e?.id);
      params.team = arr?.join(",");
    }

    // if (!state.selectDateInfo?.length) {
    //   showToast({ message: "请选择申请日期" });
    //   return false;
    // }

    // if (state.selectDateInfo?.length == 1) {
    //   params.end_date = exchangeDateTime(startDate, 2);

    //   let [s, e] = state.sliderVal;
    //   params.time = [
    //     {
    //       start_time: convertMinutesToHHMM(s),
    //       end_time: convertMinutesToHHMM(e),
    //     },
    //   ];
    // } else {
    //   params.end_date = exchangeDateTime(endDate, 2);
    //   state.chooseTimeList.forEach((e) => {
    //     params.time.push({
    //       start_time: e.begin_time,
    //       end_time: e.end_time,
    //     });
    //   });
    // }

    if (!params?.title) {
      showToast({ message: "请填写申请主题" });
      return false;
    } else if (!params?.content) {
      showToast({ message: "请填写申请内容" });
      return false;
    } else if (!params?.mobile) {
      showToast({ message: "请输入联系电话" });
      return false;
    }

    state.submitData = params;
    if (type == "rule") {
      applySpace(params);
    } else {
      // state.ruleInfo = { content: state.activityApplyInfo?.should };
      // state.ruleShow = true;
      getRuleInfo();
    }
  } catch (e) {
    console.log(e);
  }
};

const getRuleInfo = async () => {
  try {
    const res = await getSpaceShould({ id: state.initQuerySpaceId });
    if (res?.code != 0) {
      showToast({
        message: res?.message || "网络请求错误",
      });
      return false;
    }

    state.ruleInfo.content = res?.data?.seat_rule;
    state.ruleShow = true;
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

const applySpace = async (data) => {
  try {
    state.ruleShow = false;

    const res = await fetchSpaceSubmit(data);

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

const showAreaName = () => {
  let { top_name, top_en_name, storey_name, storey_en_name, name, enname } =
    state.spaceApplyInfo;

  return `${top_name}-${storey_name}-${name}`;
};

const showPeopleName = () => {
  let nameArr = state.addPeopleList?.map((e) => {
    return e?.name;
  });

  return nameArr?.length ? nameArr.join(", ") : "";
};

const showApplyDate = () => {
  let date = "";
  if ([2, 6]?.includes(Number(state.spaceApplyInfo?.type_id))) {
    date = state.dateIndex?.date;
  } else if (state.selectDateInfo?.length) {
    if (state.selectDateInfo[0] == state.selectDateInfo[1]) {
      date = exchangeDateTime(state?.selectDateInfo[0], 2);
    } else {
      date =
        state.selectDateInfo?.length == 2
          ? `${exchangeDateTime(
              state?.selectDateInfo[0],
              2
            )} ~ ${exchangeDateTime(state?.selectDateInfo[1], 2)}`
          : `${exchangeDateTime(state?.selectDateInfo[0], 2)}`;
    }
  }

  return date;
};

const bottomBtnDisabled = () => {
  let submitErr = false;
  if (checkOverlap(state.sliderVal, state.sliderConfig?.disabledArr)?.length) {
    submitErr = true;
  }

  return submitErr;
};

const handleShow = (v) => {
  if (!v && state.apptResult?.type == "success") {
    router.replace("/");
  } else {
    state.apptResult.show = false;
  }
};

const getDateStatus = () => {
  let [startDate, endDate] = state.selectDateInfo;

  let dates = getDates(startDate, endDate);
  let { list } = state?.calendarInfo;

  let statusArr = [];
  let newTimeList = [...state.axisTimeList];
  if (state?.axisTimeList?.length) {
    if (dates?.length) {
      list.map((e) => {
        if (dates?.includes(e?.date)) {
          if (e?.status != 1) {
            statusArr.push(e?.status);
          }
        }
      });
    }

    if (
      statusArr?.find((e) => e == "-1") ||
      (statusArr?.find((e) => e == "-2") && statusArr?.find((e) => e == "-3"))
    ) {
      message.warning("日期范围已被预约，请重新选择日期。");
      setTimeout(() => {
        state.selectDateInfo = [startDate, startDate];
      }, 500);

      return false;
    } else {
      newTimeList = newTimeList?.map((e) => {
        if (
          statusArr?.find((e) => e == "-2") &&
          [1, 3]?.includes(Number(e?.id))
        ) {
          e["status"] = "disabled";
        } else if (
          statusArr?.find((e) => e == "-3") &&
          [2, 3]?.includes(Number(e?.id))
        ) {
          e["status"] = "disabled";
        } else {
          e["status"] = "";
        }
        return e;
      });
    }
    state.axisTimeList = newTimeList;
  }
  console.log("newTimeList", newTimeList, state.selectDateInfo);
};
</script>
<template>
  <div class="apply">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/space')"
              >选择馆舍</a-breadcrumb-item
            >
            <a-breadcrumb-item @click="goToLink('/space/space', true)"
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
          <div v-if="state.topImg" class="left_top_left">
            <span class="tag">{{ state?.spaceApplyInfo?.top_name || "" }}</span>
            <img style="width: 90%; height: 100%" :src="state.topImg" alt="" />
          </div>
          <div class="left_top_right">
            <SpaceApplySwipe
              v-if="state.spaceApplyInfo?.brother_area?.length"
              :data="state.spaceApplyInfo"
              :defaultId="state.initQuerySpaceId"
              @changeSlide="onChangeSlide"
              @viewInfo="fetchGetSpaceDetailInfo"
              @viewFloor="onViewFloor"
            />
          </div>
        </div>
        <div class="left_bottom">
          <div class="left_bottom_title">时间选择</div>
          <van-row
            v-if="state.spaceApplyInfo?.type_id == 5"
            class="time_select_box"
          >
            <van-col span="12">
              <div class="time_select_box_text">
                <div class="time_select_box_text_left">
                  点击您想要选择的日期<span>（可选择多天）</span>
                </div>
              </div>
              <div class="calendar_box">
                <Calendar
                  v-model:selectedDate="state.selectDateInfo"
                  :calendarInfo="state.calendarInfo"
                  :axisTimeList="state.axisTimeList"
                  @onSelected="onSelected"
                />
              </div>
              <div style="margin-top: 8px" class="timeStatus">
                <span class="can_book">有预约:</span>
                <span class="allCir"></span>
                <span style="margin-right: 30px">全天</span>
                <span class="allCir topCir"></span>
                <span class="allCir botCir"></span>
                <span>半天</span>
              </div>
            </van-col>
            <van-col
              v-if="state.spaceApplyInfo?.earlierPeriods == 0"
              span="10"
              offset="2"
            >
              <div
                class="selected_time_text"
                :style="{
                  marginTop: !state.selectDateInfo?.length ? '70%' : '',
                }"
              >
                已选时间：
                <span v-if="state.selectDateInfo?.length"
                  >{{ showApplyDate() }}
                </span>
                <span v-else>-</span>
              </div>
              <template v-if="state.selectDateInfo?.length">
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
                      :disabledTime="onDisabledTime"
                      :minuteStep="60"
                      :showNow="false"
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
                      :minuteStep="60"
                      :showNow="false"
                      :disabledTime="onDisabledTime"
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
              </template>
            </van-col>
            <van-col
              v-if="
                state.spaceApplyInfo?.earlierPeriods == 3 &&
                state.axisTimeList?.length
              "
              span="10"
              offset="2"
            >
              <div
                class="selected_time_text"
                :style="{
                  marginTop: '30%',
                  textAlign: 'left',
                }"
              >
                已选时间：
                <span v-if="state.selectDateInfo?.length">{{
                  showApplyDate()
                }}</span>
                <span v-else>-</span>
              </div>
              <a-radio-group
                v-if="state.selectDateInfo?.length"
                v-model:value="state.chooseRadioTime"
              >
                <a-radio
                  v-for="item in state.axisTimeList"
                  :value="item?.id"
                  :disabled="item?.status == 'disabled'"
                  :style="{
                    display: 'flex',
                    height: '40px',
                    lineHeight: '40px',
                  }"
                  >{{ item?.name }}
                  {{ `(${item?.start_time} ~ ${item?.end_time})` }}</a-radio
                >
              </a-radio-group>
            </van-col>
          </van-row>

          <a-row v-else :gutter="[15, 15]">
            <template v-for="item in state.calendarInfo.list" :key="item">
              <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <div
                  class="libraryItem cardItemBorTran"
                  :class="{ activeItem: item?.date == state.dateIndex?.date }"
                  @click="onChangeDateAct(item)"
                >
                  <span>{{ moment(item?.date).format("MM-DD") }}</span>
                  <span>{{ exchangeDateTime(item?.date, 31) }}</span>
                  <div
                    v-if="item?.date == state.dateIndex?.date"
                    class="check_icon"
                  >
                    <img src="@/assets/event/checked.svg" />
                  </div>
                </div>
              </a-col>
            </template>
          </a-row>

          <div
            v-if="state.spaceApplyInfo?.type_id != 5 && state.sliderShow"
            style="margin-top: 20px"
          >
            <SliderCom
              :options="state.sliderConfig"
              v-model:value="state.sliderVal"
            />
          </div>
        </div>
      </div>
      <div class="right">
        <div
          class="right_top"
          v-if="[5, 6]?.includes(Number(state.spaceApplyInfo?.type_id))"
        >
          <div class="add_people_box">
            <div class="add_people_box_title">参与人员</div>
            <div class="add_people_box_input">
              <a-input
                size="middle"
                :bordered="false"
                v-model:value="state.addPeople"
                placeholder="请输入学工号"
              />
              <img
                @click="addPeople"
                class="add_people_box_input_icon"
                src="@/assets/activity_application/add_one_time.svg"
                alt=""
              />
            </div>
          </div>

          <a-row v-if="state.addPeopleList?.length > 0" :gutter="[15, 15]">
            <template v-for="(item, index) in state.addPeopleList" :key="index">
              <a-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4" :xxl="4">
                <div class="add_people_item">
                  <span>{{ item?.name }}</span>
                  <img
                    style="cursor: pointer"
                    @click="removePeople(index)"
                    src="@/assets/blue_remove_icon.svg"
                    alt=""
                  />
                </div>
              </a-col>
            </template>
          </a-row>
          <div v-else style="display: flex; justify-content: center">
            <img
              style="width: 170px; height: 150px"
              src="@/assets/no_add_people_icon.svg"
              alt=""
            />
          </div>

          <div class="right_top_right_text">
            <div v-if="state.addPeopleList?.length < 1">
              还可添加{{ state.spaceApplyInfo?.maxPerson }}人
            </div>
            <div v-else>
              还可添加{{
                state.spaceApplyInfo?.maxPerson - state.addPeopleList?.length
              }}人
            </div>
          </div>
        </div>
        <div class="right_bottom">
          <div class="right_bottom_title">完善信息</div>
          <!-- 申请主题 -->
          <a-flex class="right_bottom_item" gap="middle" align="center">
            <div>申请主题:</div>
            <div style="flex: 1">
              <a-input
                placeholder="填写后将在活动报名页面展示"
                v-model:value="state.filterActivityTheme"
                size="middle"
              />
            </div>
          </a-flex>
          <!-- 申请内容 -->
          <a-flex class="right_bottom_item" gap="middle" align="start">
            <div>申请内容:</div>
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
          <!-- 联系电话 -->
          <a-flex class="right_bottom_item" gap="middle" align="center">
            <div>联系电话:</div>
            <div style="flex: 1">
              <a-input
                placeholder="请输入联系电话"
                v-model:value="state.filterActivityMobile"
                size="middle"
              />
            </div>
          </a-flex>
          <!-- 是否公开 -->
          <a-flex class="right_bottom_item" gap="middle" align="center">
            <div>是否公开:</div>
            <div style="flex: 1">
              <a-radio-group v-model:value="state.isOpen">
                <a-radio :value="0" :key="0">是</a-radio>
                <a-radio :value="1" :key="1">否</a-radio>
              </a-radio-group>
            </div>
          </a-flex>

          <!-- 附件 -->
          <a-flex
            v-if="state.spaceApplyInfo?.isMouldShow == 1"
            class="right_bottom_item"
            gap="middle"
            align="start"
          >
            <div>上传附件:</div>
            <div style="flex: 1">
              <Uploader
                class="margin_left_10"
                filePath="seminar"
                :maxCount="1"
                @onFileUpload="(v) => fileUpload(v)"
                accept="image/jpeg,image/png,image/bmp"
                list-type="picture-card"
                showUploadList
                :initFileList="state.initFileList"
              >
                <img src="@/assets/upload_file_plus.svg" alt="" />
              </Uploader>
            </div>
          </a-flex>

          <div class="bottom_btn">
            <van-button
              :disabled="bottomBtnDisabled()"
              round
              type="primary"
              style="width: 200px"
              @click="onSubmit"
              >立即预约</van-button
            >
          </div>
        </div>
      </div>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.spaceDetailInfoShow"
      title="空间详情"
      @ok="state.spaceDetailInfoShow = false"
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
        v-if="state.spaceDetailInfo?.id"
        :data="state.spaceDetailInfo"
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
                空间：<span>{{ showAreaName() || "" }}</span>
              </p>
              <p>
                时间：<span>{{ showApplyDate() || "" }}</span>
              </p>
            </div>
            <div v-if="showPeopleName()" class="item">
              <p>
                成员：<span> {{ showPeopleName() || "" }}</span>
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
          <span>{{ state?.UserInfo?.name || "" }}</span>
        </div>
        <div class="toastItem">
          <span>预约时间：</span>
          <span>
            <span>{{ showApplyDate() || "" }}</span>
          </span>
        </div>
        <div class="toastItem">
          <span>预约地点：</span>
          <span>{{ showAreaName() || "" }}</span>
        </div>
        <div v-if="showPeopleName()" class="toastItem">
          <span>参与人员：</span>
          <span>{{ showPeopleName() || "" }}</span>
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
          flex: 1;
          position: relative;
          img {
            border-radius: 6px;
          }
          .tag {
            position: absolute;
            padding: 4px 12px;
            background-color: var(--primary-color);
            font-size: 14px;
            color: #ffffff;
            border-radius: 6px 0 6px 0;
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
          margin-bottom: 20px;
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
          // font-family: AliHeavy !important;
          font-weight: bold;
        }
        .time_select_box {
          margin-top: 20px;
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
              // font-size: ;
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
        .timeStatus {
          font-size: 14px;
          color: #616161;
          display: flex;
          align-items: center;
          .allCir {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: #f5b544;
            border: 2px solid #f5b544;
            margin: 0 4px;
            overflow: hidden;
            &.topCir {
              position: relative;
              background-color: #f5b544;
              &::after {
                position: absolute;
                content: "";
                width: 100%;
                height: 100%;
                background-color: #fff;
                transform: translateY(50%);
              }
            }

            &.botCir {
              position: relative;
              background-color: #f5b544;
              &::after {
                position: absolute;
                content: "";
                width: 100%;
                height: 100%;
                background-color: #fff;
                transform: translateY(-50%);
              }
            }
          }
        }
        .libraryItem {
          position: relative;
          background-color: rgba(97, 97, 97, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .check_icon {
            position: absolute;
            right: 0;
            bottom: 0;
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
        position: relative;
        .add_people_box {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          .add_people_box_title {
            font-size: 16px;
            color: rgba(32, 32, 32, 1);
            // font-family: AliHeavy !important;
            font-weight: bold;
          }
          .add_people_box_input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #cecfd5;
            border-radius: 18px;
            .add_people_box_input_icon {
              width: 20px;
              height: 20px;
              cursor: pointer;
              margin-right: 10px;
            }
          }
        }
        .add_people_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(26, 73, 192, 0.4);
          border-radius: 6px;
          padding: 7px 14px;
          color: rgba(26, 73, 192, 1);
          font-size: 14px;
          background-color: rgba(26, 73, 192, 0.05);
        }

        .right_top_right_text {
          color: rgba(243, 116, 0, 1);
          font-size: 12px;
          position: absolute;
          bottom: 16px;
          right: 30px;
        }
      }
      .right_bottom {
        position: relative;
        flex: 3;
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
        .right_bottom_item {
          margin-top: 20px;
          .padding_left_10 {
            padding-left: 10px;
          }
          .right_bottom_item_title {
            color: rgba(32, 32, 32, 1);
            font-size: 14px;
          }
          .margin_top_50 {
            margin-top: 50px;
          }
        }
        .upload_item {
          margin-top: 20px;
          display: flex;
          .upload_item_title {
            margin-top: 12px;
            color: rgba(32, 32, 32, 1);
            font-size: 14px;
          }
          .margin_left_10 {
            margin-left: 10px;
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
</style>
