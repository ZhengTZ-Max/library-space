<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'V4_space_selection',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import moment from "moment";
import {
  getActivityApply,
  getActivityDetail,
  activityApply,
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

import { showToast, Toast } from "vant";

const router = useRouter();
const route = useRoute();

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

  filterActivityTypeId: "",
  filterActivityTheme: "",
  filterActivityContent: "",
  filterActivityMaxPeople: "",
  filterActivityMobile: "",

  selectDateInfo: [],
  selectSlideShow: false,
  selectChooseTime: false,

  chooseTimeList: [{ begin_time: "", end_time: "" }],

  poster: [],
  approve: [],
  publicize: [],
  plan: [],
  materials: [],

  ruleShow: false,
  ruleInfo: { content: "" },

  submitData: {},

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },
  rangeTimeCantSelectTime: [],
  draftShow: false,
});

onMounted(() => {
  fetchGetActivityApply();
});

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

    // console.log(state.calendarInfo);

    state.argumentArray = res?.data?.argument || [];

    state.filterActivityTypeId = state.activityApplyInfo?.categorys[0]?.id;
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
    if (res.code != 0) {
      state.activityInfo = {};
      return;
    }
    state.activityDetailInfo = { ...res?.data, type: "activity" } || {};
    state.activityDetailInfoShow = true;
    console.log(state.activityDetailInfo);
  } catch (e) {
    console.log(e);
  }
};

const onChangeSlide = (row) => {
  state.initQuerySpaceId = row?.id;
  //   fetchGetActivityApply();
  console.log(row);
};

const onViewFloor = (row) => {
  console.log(row);
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
  }
};

const filterArguments = (key) => {
  return state.argumentArray?.some((e) => e.key == key) || false;
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
const getArgInfo = (key) => {
  return state.argumentArray?.find((e) => e.key == key) || false;
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
    if (type == "draft") {
      draftActivity(params);
    } else if (type == "rule") {
      applyActivity(params);
    } else {
      state.ruleInfo = { content: state.activityApplyInfo?.should };
      state.ruleShow = true;
      // getRuleInfo(params);
    }
  } catch (e) {
    console.log(e);
  }
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
</script>

<template>
  <div class="activity_application_apply_mobile">
    <div class="top_swipe">
      <ActivitySpaceSwipe
        v-if="state.activityApplyInfo?.brother_area?.length"
        :data="state.activityApplyInfo"
        :defaultId="state.initQuerySpaceId"
        @changeSlide="onChangeSlide"
        @viewInfo="fetchGetActivityDetailInfo"
        @viewFloor="onViewFloor"
      />
    </div>
    <div class="select_time">
      <div class="select_time_title">时间选择</div>
      <div class="select_time_desc">
        点击您想要选择的日期<span>（可选择多天）</span>
      </div>
      <div class="calendar_box">
        <Calendar :calendarInfo="state.calendarInfo" @onSelected="onSelected" />
      </div>
      <span class="can_book">有预约:</span>
      <div
        class="selected_time_selected_text"
        v-if="state.selectDateInfo.length"
      >
        已选时间：<span v-if="state.selectSlideShow"
          >{{ exchangeDateTime(state.selectDateInfo[0], 2) }}
        </span>
        <span v-if="state.selectChooseTime"
          >{{ exchangeDateTime(state.selectDateInfo[0], 2) }} ~
          {{ exchangeDateTime(state.selectDateInfo[1], 2) }}</span
        >
      </div>
      <div v-if="state.selectSlideShow">
        <div class="sliderSlt"></div>
        <SliderCom
          :options="state.sliderConfig"
          v-model:value="state.sliderVal"
        />
      </div>
      <div
        v-if="state.selectChooseTime"
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
    </div>
    <!-- 活动信息 -->
    <div class="activity_edit_info">
      <!-- 类型 -->
      <div class="activity_edit_info_item">
        <div class="activity_edit_info_item_title">
          <span class="required">*</span>活动类型
        </div>
        <div>
          <a-radio-group v-model:value="state.filterActivityTypeId">
            <a-radio
              v-for="item in state.activityApplyInfo?.categorys"
              :value="item?.id"
              :key="item?.id"
              >{{ item?.name }}</a-radio
            >
          </a-radio-group>
        </div>
      </div>
      <div class="drive_line"></div>

      <!-- 申请主题 -->
      <template v-if="filterArguments('title')">
        <div class="activity_edit_info_item">
          <div class="activity_edit_info_item_title">
            <span class="required">*</span>申请主题
          </div>
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
        <div class="drive_line"></div>
      </template>
      <template v-if="filterArguments('content')">
        <!-- 申请内容 -->
        <div class="activity_edit_info_item_textarea">
          <div class="activity_edit_info_item_textarea_title">
            <span class="required">*</span>申请内容
          </div>
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
      </template>

      <template v-if="filterArguments('max')">
        <!-- 最多人数  -->
        <div class="activity_edit_info_item">
          <div class="activity_edit_info_item_title">
            <span class="required">*</span>最多人数
          </div>
          <div>
            <a-input
              class="edit_input"
              :bordered="false"
              v-model:value="state.filterActivityMaxPeople"
              placeholder="请填写最多人数"
              size="small"
            />
          </div>
        </div>
        <div class="drive_line" />
      </template>

      <template v-if="filterArguments('mobile')">
        <!-- 手机号 -->
        <div class="activity_edit_info_item">
          <div class="activity_edit_info_item_title">
            <span class="required">*</span>联系电话
          </div>
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
      </template>
    </div>

    <!-- 文件上传 -->
    <div class="file_upload">
      <div class="file_upload_text">上传活动资料</div>

      <!-- 活动海报 -->
      <template v-if="filterArguments('poster')">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>活动海报</div>

          <Uploader
            :initFileList="state.initApprove"
            filePath="activity"
            :showUploadList="false"
            :maxCount="1"
            @onFileUpload="(v) => fileUpload(v, 'poster')"
            accept=".png, .jpg, .jpeg"
            list-type="picture"
          >
            <div class="item_for_file_title_right_upload">+图片</div>
          </Uploader>
        </div>
        <div v-if="state.poster.length > 0" class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="@/assets/activity_application/upload_file.svg"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">{{ state.poster[0]?.file_origin_name }}</div>
            <div class="item_for_file_item_right">{{ state.poster[0]?.file_size }}</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
        <div class="drive_line" />
      </template>

      <!-- 审批附件 -->
      <template v-if="filterArguments('approve')">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>审批附件</div>

          <Uploader
            :initFileList="state.initApprove"
            filePath="activity"
            :maxCount="1"
            :showUploadList="false"
            @onFileUpload="(v) => fileUpload(v, 'approve')"
            accept="application/pdf,application/msword"
            list-type="picture"
          >
            <div class="item_for_file_title_right_upload">+Word/PDF</div>
          </Uploader>
        </div>
        <div v-if="state.approve.length > 0" class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="@/assets/activity_application/upload_file.svg"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">{{ state.approve[0]?.file_origin_name }}</div>
            <div class="item_for_file_item_right">{{ state.approve[0]?.file_size }}</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
        <div class="drive_line" />
      </template>

      <!-- 宣传片 -->
      <template v-if="filterArguments('publicize')">
        <div class="item_for_file_title">
          <div>宣传片</div>

          <Uploader
            :initFileList="state.initApprove"
            filePath="activity"
            :maxCount="1"
            :showUploadList="false"
            @onFileUpload="(v) => fileUpload(v, 'publicize')"
            accept=".png, .jpg, .jpeg"
            list-type="picture"
          >
            <div class="item_for_file_title_right_upload">+视频</div>
          </Uploader>
        </div>
        <div v-if="state.publicize.length > 0" class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="@/assets/activity_application/upload_file.svg"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">{{ state.publicize[0]?.file_origin_name }}</div>
            <div class="item_for_file_item_right">{{ state.publicize[0]?.file_size }}</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
        <div class="drive_line" />
      </template>
      <!-- 活动策划案 -->
      <template v-if="filterArguments('plan')">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>活动策划案</div>

          <Uploader
            filePath="activity"
            :maxCount="1"
            :showUploadList="false"
            @onFileUpload="(v) => fileUpload(v, 'plan')"
            accept="application/pdf,application/msword"
            list-type="picture"
          >
            <div class="item_for_file_title_right_upload">+Word/PDF</div>
          </Uploader>
        </div>
        <div v-if="state.plan.length > 0" class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="@/assets/activity_application/upload_file.svg"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">{{ state.plan[0]?.file_origin_name }}</div>
            <div class="item_for_file_item_right">{{ state.plan[0]?.file_size }}</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
        <div class="drive_line" />
      </template>

      <!-- 其他申请材料 -->
      <template v-if="filterArguments('materials')">
        <div class="item_for_file_title">
          <div>其他申请材料</div>

          <Uploader
            filePath="activity"
            :maxCount="1"
            :showUploadList="false"
            @onFileUpload="(v) => fileUpload(v, 'materials')"
            accept="application/pdf,application/msword"
            list-type="picture"
          >
            <div class="item_for_file_title_right_upload">+Word/PDF</div>
          </Uploader>
        </div>
        <div v-if="state.materials.length > 0" class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="@/assets/activity_application/upload_file.svg"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">{{ state.materials[0]?.file_origin_name }}</div>
            <div class="item_for_file_item_right">{{ state.materials[0]?.file_size }}</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
      </template>
    </div>

    <van-button
      style="margin-top: 20px"
      round
      block
      type="primary"
      @click="state.draftShow = true"
      >存草稿</van-button
    >

    <!-- 底部按钮 -->
    <div class="bottomAction_box">
      <van-button round block type="default" @click="router.go(-1)">
        <img src="@/assets/seat/moBackBtn.svg" alt="" />
        返回
      </van-button>
      <van-button round block type="primary" @click="onSubmit"
        >立即申请</van-button
      >
    </div>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="100%"
      placement="bottom"
      :open="state.activityDetailInfoShow"
      @close="state.activityDetailInfoShow = false"
      :closable="false"
    >
      <div class="libraryPop">
        <LibraryInfo
          v-if="state.activityDetailInfo?.id"
          :data="state.activityDetailInfo"
        />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.activityDetailInfoShow = false"
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

    <van-dialog
      v-model:show="state.draftShow"
      title="提示"
      message-align="center"
      show-cancel-button
      @cancel="state.draftShow = false"
      @confirm="() => onSubmit('draft')"
      confirmButtonText="保存"
      cancelButtonText="不保存"
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
.activity_application_apply_mobile {
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
      font-size: 16px;
      color: rgba(32, 32, 32, 1);
      // font-family: AliHeavy !important;
      font-weight: bold;
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

    span {
      position: relative;
      &.can_book {
        top: 10px;
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
  }

  .activity_edit_info {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;

    .activity_edit_info_item {
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .required {
        color: red;
      }
      .activity_edit_info_item_title {
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        // font-family: AliHeavy !important;
        font-weight: bold;
      }
      .edit_input {
        color: rgba(32, 32, 32, 1);
        font-size: 14px;
        text-align: right;
      }
    }

    .activity_edit_info_item_textarea {
      padding: 12px;
      .required {
        color: red;
      }
      .activity_edit_info_item_textarea_title {
        margin-bottom: 10px;
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        // font-family: AliHeavy !important;
        font-weight: bold;
      }
      .edit_textarea {
        color: rgba(32, 32, 32, 1);
        font-size: 12px;
        margin-bottom: 12px;
      }
    }
  }

  .file_upload {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    .file_upload_text {
      font-size: 14px;
      color: rgba(32, 32, 32, 1);
      // font-family: AliHeavy !important;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .item_for_file_title {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      color: rgba(97, 97, 97, 1);
      font-size: 14px;
      .item_for_file_title_right_upload {
        border-radius: 22px;
        border: 1px solid rgba(223, 223, 223, 1);
        padding: 2px 10px;
        color: rgba(134, 134, 134, 1);
        margin-bottom: 10px;
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
  .filterDrawer {
    padding: 22px;
  }

  &::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }

  scrollbar-width: none; /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
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
