<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Facility_Selection',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import moment from "moment";

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
  // initQuerySpaceId: route?.query?.id || "",
  // argumentArray: [],

  // dateIndex: "",
  // selectDateInfo: [],
  // selectSlideShow: false,
  // selectChooseTime: false,

  // spaceApplyInfo: {},
  // calendarInfo: {
  //   dateList: [],
  //   list: [],
  //   startDate: "",
  //   endDate: "",
  // },

  // topImg: "",
  // filterActivityTypeId: "",
  // filterActivityTheme: "",
  // filterActivityContent: "",
  // filterActivityMaxPeople: "",
  // filterActivityMobile: "",

  // chooseTimeList: [{ begin_time: "", end_time: "" }],
  // type: "",
  // addPeople: "",
  // addPeopleList: [],
  // isOpen: 0,
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
        return [e?.begin_time, e?.end_time];
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

    // console.log(state.calendarInfo);

    state.argumentArray = res?.data?.argument || [];
    state.topImg = res?.data?.detail?.firstImg || "";

    // state.filterActivityTypeId = state.spaceApplyInfo?.categorys[0]?.id;

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
  <div class="space_apply">
    <div class="top_swipe">
      <SpaceApplySwipe
        v-if="state.spaceApplyInfo?.brother_area?.length"
        :data="state.spaceApplyInfo"
        :defaultId="state.initQuerySpaceId"
        @changeSlide="onChangeSlide"
        @viewInfo="fetchGetSpaceDetailInfo"
        @viewFloor="onViewFloor"
      />
    </div>

    <div class="select_time">
      <div class="select_time_title">时间选择</div>
      <template v-if="state.spaceApplyInfo?.type_id == 5">
        <div class="select_time_desc">
          点击您想要选择的日期<span>（可选择多天）</span>
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
        <div v-if="state.spaceApplyInfo?.earlierPeriods == 0">
          <div class="selected_time_selected_text">
            已选时间：
            <span v-if="state.selectDateInfo?.length"
              >{{ showApplyDate() }}
            </span>
            <span v-else>-</span>
          </div>
          <div
            v-if="state.selectDateInfo?.length"
            class="add_time_box"
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
                :disabledTime="onDisabledTime"
                :minuteStep="60"
                size="middle"
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
                :disabledTime="onDisabledTime"
                :minuteStep="60"
                size="middle"
                :showNow="false"
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
        </div>
        <div
          v-if="
            state.spaceApplyInfo?.earlierPeriods == 3 &&
            state.axisTimeList?.length
          "
        >
          <div class="selected_time_selected_text">
            已选时间：
            <span v-if="state.selectDateInfo?.length"
              >{{ showApplyDate() }}
            </span>
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
        </div>
      </template>

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

    <div
      class="add_people_box"
      v-if="[5, 6]?.includes(Number(state.spaceApplyInfo?.type_id))"
    >
      <div class="add_people_box_content">
        <div class="add_people_box_title">参与人员</div>
        <div class="add_people_box_input">
          <a-input
            size="middle"
            class="input_box"
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
      <a-row v-if="state.addPeopleList?.length > 0" :gutter="[10, 0]">
        <template v-for="(item, index) in state.addPeopleList" :key="index">
          <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
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

    <div class="activity_info">
      <!-- 申请主题 -->
      <div class="activity_edit_info_item">
        <div class="activity_edit_info_item_title">申请主题</div>
        <div>
          <a-input
            class="edit_input"
            :bordered="false"
            v-model:value="state.filterActivityTheme"
            placeholder="请填写活动主题"
            size="small"
          />
        </div>
      </div>
      <div class="drive_line" />

      <!-- 申请内容 -->
      <div class="activity_edit_info_item_textarea">
        <div class="activity_edit_info_item_textarea_title">申请内容</div>
        <a-textarea
          v-model:value="state.filterActivityContent"
          show-count
          class="edit_textarea"
          :bordered="false"
          placeholder="请填写活动内容"
          :autoSize="{ minRows: 1, maxRows: 3 }"
          :maxlength="200"
        />
      </div>
      <div class="drive_line" />
      <!-- 手机号 -->
      <div class="activity_edit_info_item">
        <div class="activity_edit_info_item_title">联系电话</div>
        <div>
          <a-input
            class="edit_input"
            :bordered="false"
            v-model:value="state.filterActivityMobile"
            placeholder="请填写联系电话"
            size="small"
          />
        </div>
      </div>
      <!-- 是否公开 -->
      <div class="activity_edit_info_item">
        <div class="activity_edit_info_item_title">是否公开</div>
        <a-radio-group v-model:value="state.isOpen">
          <a-radio :value="0" :key="0">是</a-radio>
          <a-radio :value="1" :key="1">否</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="upload_file_box" v-if="state.spaceApplyInfo?.isMouldShow == 1">
      <div class="upload_file_box_content">
        <div class="upload_file_box_title">上传附件</div>
        <Uploader
          class="margin_left_10"
          filePath="seminar"
          :maxCount="1"
          @onFileUpload="(v) => fileUpload(v)"
          accept="image/jpeg,image/png,image/bmp"
          list-type="picture-card"
          :showUploadList="false"
          :initFileList="state.initFileList"
        >
          <img
            class="add_people_box_input_icon"
            src="@/assets/activity_application/add_one_time.svg"
            alt=""
          />
        </Uploader>
      </div>
      <!-- 等待一个文件上传成功列表 做for循环 -->
      <template v-for="item in state.fileList" :key="item">
        <div class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="@/assets/activity_application/upload_file.svg"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">文件名称xxx</div>
            <div class="item_for_file_item_right">10.85KB</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
      </template>
    </div>

    <!-- 底部按钮 -->
    <div class="bottomAction_box">
      <van-button round block type="default" @click="router.go(-1)">
        <img src="@/assets/seat/moBackBtn.svg" alt="" />
        返回
      </van-button>
      <van-button
        :disabled="bottomBtnDisabled()"
        round
        block
        type="primary"
        @click="onSubmit"
        >立即预约</van-button
      >
    </div>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="100%"
      placement="bottom"
      :open="state.spaceDetailInfoShow"
      @close="state.spaceDetailInfoShow = false"
      :closable="false"
    >
      <div class="libraryPop">
        <LibraryInfo
          v-if="state.spaceDetailInfo?.id"
          :data="state.spaceDetailInfo"
        />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.spaceDetailInfoShow = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            返回
          </van-button>
        </div>
      </div>
    </a-drawer>

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
.space_apply {
  height: 100%;
  background-color: #fafafa;
  padding: 20px;
  overflow-y: auto;
  .top_swipe {
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
  }
  .select_time {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    padding: 12px;
    .select_time_title {
      margin-bottom: 10px;
      font-size: 16px;
      color: rgba(32, 32, 32, 1);
      font-family: AliExtraBold !important;
    }
    .select_time_desc {
      margin-top: 10px;
      font-size: 12px;
      color: rgba(97, 97, 97, 1);
      span {
        color: rgba(26, 73, 192, 1);
      }
    }
    .calendar_box {
      margin-top: 10px;
      border: 1px solid rgba(4, 4, 21, 0.1);
      border-radius: 4px;
      min-height: 255px;
      max-height: 320px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none; /* 隐藏滚动条 */
      }

      scrollbar-width: none; /* Firefox 隐藏滚动条 */
      -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
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
    .selected_time_selected_text {
      margin-top: 10px;
      color: rgba(97, 97, 97, 1);
      font-size: 12px;
      span {
        color: rgba(26, 73, 192, 1);
      }
    }
    .add_time_box {
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

  .add_people_box {
    margin-top: 20px;
    margin-bottom: 0;
    padding: 12px;
    background-color: #fff;
    border-radius: 16px;
    margin-bottom: 20px;

    .add_people_box_content {
      display: flex;
      justify-content: space-between;
      .add_people_box_title {
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        font-family: AliHeavy !important;
      }
      .add_people_box_input {
        display: flex;
        justify-content: end;
        align-items: center;
        .input_box {
          text-align: right;
        }

        .add_people_box_input_icon {
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin-right: 10px;
        }
      }
    }
    .add_people_item {
      margin-top: 10px;
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
      margin-top: 10px;
      color: rgba(243, 116, 0, 1);
      font-size: 12px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .activity_info {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;

    .activity_edit_info_item {
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .activity_edit_info_item_title {
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        font-family: AliExtraBold !important;
      }
      .edit_input {
        color: rgba(32, 32, 32, 1);
        font-size: 14px;
        text-align: right;
      }
    }

    .activity_edit_info_item_textarea {
      padding: 12px;
      .activity_edit_info_item_textarea_title {
        margin-bottom: 10px;
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        font-family: AliExtraBold !important;
      }
      .edit_textarea {
        color: rgba(32, 32, 32, 1);
        font-size: 12px;
        margin-bottom: 12px;
      }
    }
  }
  .upload_file_box {
    padding: 12px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    .upload_file_box_content {
      display: flex;
      justify-content: space-between;
      .upload_file_box_title {
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        font-family: AliHeavy !important;
      }
    }
    .item_for_file_content {
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      .item_for_file_item {
        flex: 1;
        margin-left: 10px;
        color: rgba(97, 97, 97, 1);
        font-size: 12px;
      }
    }
  }
  .bottomAction_box {
    margin-top: 20px;
    padding: 5px;
    display: flex;
    justify-content: space-between;

    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
      img {
        margin-right: 4px;
        transform: translateY(-2px);
      }
    }
  }
}

.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  :deep(.libraryInfo) {
    flex: 1;
    padding: 14px;
  }
  .bottomAction {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
      img {
        margin-right: 4px;
        transform: translateY(-2px);
      }
    }
  }
}
.drive_line {
  height: 1px;
  background-color: rgba(245, 245, 245, 1);
}
</style>
