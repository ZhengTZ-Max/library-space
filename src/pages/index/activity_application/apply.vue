<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";

import {
  getActivityApply,
  getActivityDetail,
} from "@/request/activity_application";
import { exchangeDateTime } from "@/utils";
import ActivitySpaceSwipe from "@/components/ActivityApplication/ActivitySpaceSwipe.vue";
import LibraryInfo from "@/components/LibraryInfo.vue";
import Calendar from "@/components/ActivityApplication/Calendar.vue";
import Uploader from "@/components/Uploader.vue";

const router = useRouter();
const route = useRoute();
const value = ref([20, 50]);
const marks = ref({
  0: "",
  26: "",
  37: "",
  100: "",
});
const containerRef = ref();

const state = reactive({
  sliderConfig: {
    previousValue: [],
    startTime: 45,
    endTime: 1395,
    step: 15,
    marksList: {},
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
  filterActivityTypeId: "",
  filterActivityTheme: "",
  filterActivityContent: "",
  filterActivityMaxPeople: "",
  filterActivityMobile: "",

  bottomBtnDisabled: true,

  chooseTimeList: [{ begin_time: "", end_time: "" }],
});

onMounted(() => {
  fetchGetActivityApply();
  initMarks();
});

const onChangeSlider = (v) => {
  console.log(v);
  const [prevStart, prevEnd] = state.sliderConfig.previousValue;
  const [newStart, newEnd] = v;

  let action = "";
  // 判断滑动方向
  if (newStart < prevStart) {
    console.log("左滑块向左滑动");
    action = "left";
  } else if (newStart > prevStart) {
    console.log("左滑块向右滑动");
  }

  if (newEnd < prevEnd) {
    console.log("右滑块向左滑动");
    action = "left";
  } else if (newEnd > prevEnd) {
    console.log("右滑块向右滑动");
  }

  // 更新上一次的值
  state.sliderConfig.previousValue = [...v];

  // 处理滑块的边界逻辑
  adjustSliderValue(v, action);
};

// 调整滑块的值，确保范围限制
const adjustSliderValue = ([start, end], type) => {
  const maxRange = 180; // 最大范围
  const minRange = 60; // 最小范围

  // 判断范围是否超出限制
  if (end - start > maxRange) {
    // 如果超出最大范围，调整 `start`
    if (type == "left") {
      end = start + maxRange;
    } else {
      start = end - maxRange;
    }
  } else if (end - start < minRange) {
    // 如果小于最小范围，调整 `end`
    end = start + minRange;
    // if (type == "left") {
    //   end = start + minRange;
    // } else {
    //   end = start + minRange;
    // }
  }

  // 边界检查
  if (start < state.sliderConfig.startTime) {
    // 如果 `start` 小于滑块最小值，固定 `end` 并调整 `start`
    start = state.sliderConfig.startTime;
    end = Math.min(start + minRange, state.sliderConfig.endTime); // 保持范围
  }

  if (end > state.sliderConfig.endTime) {
    // 如果 `end` 大于滑块最大值，固定 `start` 并调整 `end`
    end = state.sliderConfig.endTime;
    start = Math.max(end - minRange, state.sliderConfig.startTime); // 保持范围
  }

  // 更新滑块值
  value.value = [start, end];
};
const initMarks = () => {
  let { startTime, endTime } = state.sliderConfig;

  let step = 15;
  let showNum = (endTime - startTime) / step;

  // 生成标记对象
  let marks = {};

  // 循环生成标记
  for (let i = 0; i <= showNum; i++) {
    let value = i * step; // 每个标记的值
    value += startTime;
    let isLine = value % 60 == 0;
    marks[value] = isLine ? "line" : "short"; // 使用下标作为 key，值为对应的数值
  }
  state.sliderConfig.marksList = marks;
};

const convertMinutesToHHMM = (minutes, type) => {
  let hours = Math.floor(minutes / 60); // 计算小时数
  let mins = minutes % 60; // 计算剩余的分钟数

  if (type == 1) {
    return `${String(hours).padStart(2, "0")}`;
  } else if (type == 2) {
    return `${String(mins).padStart(2, "0")}`;
  } else {
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  // 格式化为 HH:MM 格式，确保小时和分钟都是两位数
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
    state.calendarInfo.list[0].status = -1;
    state.calendarInfo.list[1].status = 0;
    state.calendarInfo.list[1].list.push({
      date: "2024-11-23",
      begin_timestamp: "2024-11-23 08:00:00",
      end_timestamp: "2024-11-23 19:00:00",
      begin_time: 480,
      end_time: 540,
    });

    console.log(state.calendarInfo);

    state.argumentArray = res?.data?.argument || [];
    state.topImg = res?.data?.detail?.firstImg || "";

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

const onSelected = (date) => {
  state.selectDateInfo = date;

  if (state.selectDateInfo.length > 0) {
    if (state.selectDateInfo.length == 1) {
      state.selectSlideShow = true;
      state.selectChooseTime = false;
    } else {
      state.selectSlideShow = false;
      state.selectChooseTime = true;
    }
  } else {
    state.selectSlideShow = false;
    state.selectChooseTime = false;
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

const fileUpload = (data, type) => {
  console.log(data, type);
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
          <div class="left_top_left">
            <img style="width: 90%; height: 100%" :src="state.topImg" alt="" />
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
          <van-row class="time_select_box">
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
            </van-col>
          </van-row>

          <div v-if="state.selectSlideShow" style="margin-top: 12px">
            <div class="sliderSlt">
              <div style="margin-right: 40px">
                已选日期：<span class="sltText">2024-11-26</span>
              </div>
              <div style="flex: 1">
                已选时间：<span class="sltText">2024-11-26</span>
              </div>
              <div class="sltDot">
                <span class="selectable">可选</span>
                <span class="noselectable">不可选</span>
              </div>
            </div>

            <div class="sliderCon">
              <a-slider
                autofocus
                v-model:value="value"
                range
                :tip-formatter="null"
                :marks="state.sliderConfig.marksList"
                :min="state?.sliderConfig?.startTime"
                :max="state?.sliderConfig?.endTime"
                :step="state?.sliderConfig?.step"
                @change="onChangeSlider"
              >
                <template #mark="{ label, point }">
                  <span v-if="label == 'line'" class="longLine">{{
                    convertMinutesToHHMM(point, 1)
                  }}</span>
                  <!-- <span v-if="label == 'line'" class="longLine"></span> -->
                  <span v-if="label == 'short'" class="shortLine"></span>
                </template>
              </a-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right_top">
          <div class="right_top_title">申请信息</div>
          <!-- 活动类型 -->
          <van-row class="right_top_item">
            <van-col span="2" class="right_top_item_title"> 活动类型: </van-col>
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
            <van-col span="2" class="right_top_item_title"> 申请主题: </van-col>
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
            <van-col span="2" class="right_top_item_title"> 申请内容: </van-col>
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
                  最多人数:
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
                  联系电话:
                </van-col>
                <van-col span="20">
                  <a-input
                    placeholder="请输入联系电话"
                    v-model:value="state.filterActivityMaxPeople"
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
              <div class="upload_file_box">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                jpg/jpeg/png
              </div>
            </van-col>
          </van-row>
          <van-row class="upload_item margin_top_50">
            <!-- 活动策划案 -->
            <van-col span="14" v-if="filterArguments('plan')">
              <div class="upload_file_title">
                <span style="color: #ff4d4f">*</span>活动策划案:
              </div>
              <div class="upload_file_box">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                Word/PDF
              </div>
            </van-col>
            <!-- 宣传片 -->
            <van-col span="10" v-if="filterArguments('publicize')">
              <div class="upload_file_title">宣传片:</div>
              <div class="upload_file_box">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                jpg/jpeg/png
              </div>
            </van-col>
          </van-row>
          <van-row class="upload_item margin_top_50">
            <!-- 其他申请材料 -->
            <van-col span="14" v-if="filterArguments('materials')">
              <div class="upload_file_title">其他申请材料:</div>
              <div class="upload_file_box">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                Word/PDF
              </div>
            </van-col>
          </van-row>
          <div class="bottom_btn">
            <van-button
              :disabled="state.bottomBtnDisabled"
              round
              type="primary"
              style="width: 200px"
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
            font-size: 17px;
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

:deep(.ant-slider) {
  .ant-slider-step {
    display: none;
  }
  .ant-slider-mark {
    top: 20px;
  }
  .ant-slider-rail {
    background-color: #e0e0e0 !important;
  }
  .ant-slider-track {
    background-color: var(--primary-color) !important;
  }
  .ant-slider-rail,
  .ant-slider-track {
    height: 14px !important;
  }
  .ant-slider-handle {
    width: 12px !important;
    height: 20px !important;
    background-image: url("@/assets/common/sliderBtn.png");
    background-size: 100%;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
  }
  .ant-slider-mark-text {
    padding-top: 12px;
    > span {
      padding-top: 12px;
    }
  }
  .shortLine {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: -12px;
      left: 0;
      width: 1px;
      height: 6px;
      border-right: 1px solid #e7e7e7;
    }
  }
  .longLine {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 8px;
      width: 1px;
      height: 10px;
      border-right: 1px solid #e7e7e7;
      // background-color: #202020;
    }
  }
}
</style>
