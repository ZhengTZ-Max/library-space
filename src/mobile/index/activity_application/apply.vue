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

  filterActivityTypeId: "",
  filterActivityTheme: "",
  filterActivityContent: "",
  filterActivityMaxPeople: "",
  filterActivityMobile: "",

  selectDateInfo: [],
  selectSlideShow: false,
  selectChooseTime: false,

  chooseTimeList: [{ begin_time: "", end_time: "" }],
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

const filterArguments = (key) => {
  return state.argumentArray?.some((e) => e.key == key) || false;
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
      <div v-if="state.selectSlideShow" style="background-color: aquamarine">
        1
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
    </div>
    <!-- 活动信息 -->
    <div class="activity_edit_info">
      <!-- 类型 -->
      <div class="activity_edit_info_item">
        <div class="activity_edit_info_item_title">活动类型</div>
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
        <div class="drive_line"></div>
      </template>
      <template v-if="filterArguments('content')">
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
      </template>

      <template v-if="filterArguments('max')">
        <!-- 最多人数  -->
        <div class="activity_edit_info_item">
          <div class="activity_edit_info_item_title">最多人数</div>
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
      </template>
    </div>

    <!-- 文件上传 -->
    <div class="file_upload">
      <div class="file_upload_text">上传活动资料</div>

      <!-- 活动海报 -->
      <template v-if="filterArguments('poster')">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>活动海报</div>
          <div class="item_for_file_title_right_upload">+图片</div>
        </div>
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
        <div class="drive_line" />
      </template>

      <!-- 审批附件 -->
      <template v-if="filterArguments('approve')">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>审批附件</div>
          <div class="item_for_file_title_right_upload">+Word/PDF</div>
        </div>
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
        <div class="drive_line" />
      </template>

      <!-- 宣传片 -->
      <template v-if="filterArguments('publicize')">
        <div class="item_for_file_title">
          <div>宣传片</div>
          <div class="item_for_file_title_right_upload">+视频</div>
        </div>
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
        <div class="drive_line" />
      </template>
      <!-- 活动策划案 -->
      <template v-if="filterArguments('approve')">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>活动策划案</div>
          <div class="item_for_file_title_right_upload">+Word/PDF</div>
        </div>
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
        <div class="drive_line" />
      </template>

      <!-- 活动策划案 -->
      <template v-if="filterArguments('approve')">
        <div class="item_for_file_title">
          <div>其他申请材料</div>
          <div class="item_for_file_title_right_upload">+Word/PDF</div>
        </div>
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
      <van-button
        round
        block
        type="default"
        @click="router.go(-1)"
      >
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

  .file_upload {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    .file_upload_text {
      font-size: 14px;
      color: rgba(32, 32, 32, 1);
      font-family: AliExtraBold !important;
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
