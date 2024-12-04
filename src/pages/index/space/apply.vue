<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import moment from "moment";
import { showToast } from "vant";

import {
  getSpaceApply,
  getSpaceDetail,
  getSpaceShould,
  getSpaceGroup,
  fetchSpaceSubmit,
} from "@/request/space";
import { exchangeDateTime, checkOverlap, convertMinutesToHHMM } from "@/utils";
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

    if (state.calendarInfo.list.length) {
      state.calendarInfo.startDate = state.calendarInfo.list[0].date;
      state.calendarInfo.endDate =
        state.calendarInfo.list[state.calendarInfo.list.length - 1].date;
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

    console.log(state.calendarInfo);

    state.argumentArray = res?.data?.argument || [];
    state.topImg = res?.data?.detail?.firstImg || "";

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
    state.spaceDetailInfo = { ...res?.data } || {};
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

const onViewFloor = (row) => {
  console.log(row);
};

const filterArguments = (key) => {
  return state.argumentArray?.some((e) => e.key == key) || false;
};

const onSelected = (date) => {
  state.selectDateInfo = date;

  if (state.selectDateInfo.length == 1) {
    state.selectDateInfo = [date[0], date[0]];
  }
};

const onChangeTime = (v, item, type, index) => {
  // let rowData = { ...item };

  if (type == "start") {
    // 结束时间没有选择
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
      item.begin_time = null; // 必须为null才能置空
    }
  } else {
    // rowData.end_time = rowData.end_time * 60;
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
      message.warning("结束时间不能小于开始时间");
      item.end_time = null; // 必须为null才能置空
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

    // 添加参与人员逻辑处理
    let peopleList = state?.addPeopleList;
    if (!(peopleList?.length + 1 >= dateInfo?.min_person)) {
      message.warning(`至少有${dateInfo?.min_person - 1}位参与人员`);
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
    date =
      state.selectDateInfo?.length == 2
        ? `${exchangeDateTime(
            state?.selectDateInfo[0],
            2
          )} ~ ${exchangeDateTime(state?.selectDateInfo[1], 2)}`
        : `${exchangeDateTime(state?.selectDateInfo[0], 2)}`;
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
    // router.replace("/");
  }
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
          <div class="left_top_left">
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
                <span class="can_book">有预约:</span>
              </div>
              <div class="calendar_box">
                <Calendar
                  :calendarInfo="state.calendarInfo"
                  @onSelected="onSelected"
                />
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
                  >{{ exchangeDateTime(state.selectDateInfo[0], 2) }} ~
                  {{ exchangeDateTime(state.selectDateInfo[1], 2) }}</span
                >
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
              </template>
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
          <van-row class="right_bottom_item" align="center">
            <van-col span="2" class="right_bottom_item_title">
              申请主题:
            </van-col>
            <van-col span="22" class="padding_left_10">
              <a-input
                placeholder="填写后将在活动报名页面展示"
                v-model:value="state.filterActivityTheme"
                size="middle"
              />
            </van-col>
          </van-row>
          <!-- 申请内容 -->
          <van-row class="right_bottom_item">
            <van-col span="2" class="right_bottom_item_title">
              申请内容:
            </van-col>
            <van-col span="22" class="padding_left_10">
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
          <!-- 联系电话 -->
          <van-row class="right_bottom_item">
            <van-col span="2" class="right_bottom_item_title">
              联系电话:
            </van-col>
            <van-col span="22" class="padding_left_10">
              <a-input
                placeholder="请输入联系电话"
                v-model:value="state.filterActivityMobile"
                size="middle"
              />
            </van-col>
          </van-row>

          <!-- 是否公开 -->
          <van-row class="right_bottom_item">
            <van-col span="2" class="right_bottom_item_title">
              是否公开:
            </van-col>
            <van-col span="22" class="padding_left_10">
              <a-radio-group v-model:value="state.isOpen">
                <a-radio :value="0" :key="0">是</a-radio>
                <a-radio :value="1" :key="1">否</a-radio>
              </a-radio-group>
            </van-col>
          </van-row>

          <!-- 附件 -->
          <van-row class="upload_item">
            <van-col span="2" class="upload_item_title"> 上传附件: </van-col>
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
          </van-row>

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
                空间：<span>{{ showAreaName() || "" }}</span>
              </p>
              <p>
                时间：<span>{{ showApplyDate() || "" }}</span>
              </p>
            </div>
            <div class="item">
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
          <span>{{ state.apptResult?.name || "" }}</span>
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
        <div class="toastItem">
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
          font-family: AliHeavy !important;
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
            font-family: AliHeavy !important;
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
          font-family: AliHeavy !important;
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
