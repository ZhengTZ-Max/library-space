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

import { getSpaceApply, getSpaceDetail } from "@/request/space";
import { exchangeDateTime } from "@/utils";
import SpaceApplySwipe from "@/components/SpaceApplySwipe.vue";
import LibraryInfo from "@/components/LibraryInfo.vue";
import Calendar from "@/components/ActivityApplication/Calendar.vue";
import Uploader from "@/components/Uploader.vue";

const route = useRoute();
const state = reactive({
  initQuerySpaceId: route?.query?.id || "",
  argumentArray: [],

  dateIndex: "",
  selectDateInfo: [],
  selectSlideShow: false,
  selectChooseTime: false,

  spaceApplyInfo: {},
  calendarInfo: {
    dateList: [],
    list: [],
    startDate: "",
    endDate: "",
  },

  topImg: "",
  filterActivityTypeId: "",
  filterActivityTheme: "",
  filterActivityContent: "",
  filterActivityMaxPeople: "",
  filterActivityMobile: "",

  chooseTimeList: [{ begin_time: "", end_time: "" }],
  type: "",
  addPeople: "",
  addPeopleList: [],
  isOpen: 0,
});

onMounted(() => {
  fetchGetSpaceApply();
});

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

    if (state.calendarInfo.list.length) {
      state.calendarInfo.startDate = state.calendarInfo.list[0].date;
      state.calendarInfo.endDate =
        state.calendarInfo.list[state.calendarInfo.list.length - 1].date;
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

    state.filterActivityTypeId = state.spaceApplyInfo?.categorys[0]?.id;
  } catch (e) {
    console.log(e);
  }
};

const onChangeSlide = (row) => {
  state.initQuerySpaceId = row?.id;
  //   fetchGetSpaceApply();
  console.log(row);
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

const onViewFloor = (row) => {
  console.log(row);
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

const onChangeDateAct = (date) => {
  state.dateIndex = date;
};

const addPeople = () => {
  state.addPeopleList.push(state.addPeople);
  state.addPeople = "";
};

const removePeople = (index) => {
  state.addPeopleList.splice(index, 1);
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
      <template v-if="state.type == 'more'">
        <div class="select_time_desc">
          点击您想要选择的日期<span>（可选择多天）</span>
        </div>
        <div class="calendar_box">
          <Calendar
            :calendarInfo="state.calendarInfo"
            @onSelected="onSelected"
          />
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

      <a-row
        v-if="state.calendarInfo.dateList?.length && state.type != 'more'"
        :gutter="[15, 15]"
      >
        <template v-for="item in state.calendarInfo.dateList" :key="item">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
            <div
              class="libraryItem cardItemBorTran"
              :class="{ activeItem: item == state.dateIndex }"
              @click="onChangeDateAct(item)"
            >
              <span>{{ moment(item).format("MM-DD") }}</span>
              <span>{{ exchangeDateTime(item, 31) }}</span>
              <div v-if="item == state.dateIndex" class="check_icon">
                <img src="@/assets/event/checked.svg" />
              </div>
            </div>
          </a-col>
        </template>
      </a-row>

      <div v-if="state.type != 'more'" style="margin-top: 20px">1</div>
    </div>

    <div class="add_people_box">
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
              <span>{{ item }}</span>
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
        <div v-if="state.addPeopleList?.length < 1">还可添加1 ~ 12人</div>
        <div v-else>还可添加{{ 12 - state.addPeopleList?.length }}人</div>
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

    <div class="upload_file_box">
      <div class="upload_file_box_content">
        <div class="upload_file_box_title">上传附件</div>
        <Uploader
          class="margin_left_10"
          filePath="seminar"
          :maxCount="1"
          @onFileUpload="(v) => fileUpload(v, 'approve')"
          accept="application/pdf,application/msword"
        >
          <img
            @click="addFile"
            class="add_people_box_input_icon"
            src="@/assets/activity_application/add_one_time.svg"
            alt=""
          />
        </Uploader>
      </div>
      <!-- 等待一个文件上传成功列表 做for循环 -->
      <template v-for="item in 3" :key="item">
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
        round
        block
        type="primary"
        @click="onApply(state.activityInfo?.id)"
        >立即申请</van-button
      >
    </div>
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
.drive_line {
  height: 1px;
  background-color: rgba(245, 245, 245, 1);
}
</style>
