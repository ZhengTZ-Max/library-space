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

const router = useRouter();
const route = useRoute();

const state = reactive({
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
});

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
    if (item.end_time == "" || item.begin_time == null) return;
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
    if (item.begin_time == "" || item.end_time == "") return;
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

          <div
            v-if="state.selectSlideShow"
            style="margin-top: 20px; background-color: #ff4d4f"
          >
            1
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
              <div class="upload_file_box">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                Word/PDF
              </div>
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
            <!-- 活动海报 -->
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
</style>
