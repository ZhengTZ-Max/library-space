<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'V4_event_details',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getActivityDetail, saveComments } from "@/request/activity-record";
import MyActivityRecordShare from "@/components/MyActivityRecordShare.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route?.query?.id || "",
  status: "预约成功",
  quickMode: 1,

  selectedDetails: {},
  selectedDate: "",
  selectedTimeList: [],
  appointmentTime: "",

  // 评价弹窗
  onShowTextArea: false,
  comments: "",
  onShare: false,
});

onMounted(() => {
  fetch();
});

const fetch = async () => {
  try {
    let params = {
      ilk: "1",
      id: state.id,
    };
    const res = await getActivityDetail(params);
    if (res?.code === 0) {
      state.selectedDetails = res?.data;
      onDealWithDate();
    }
  } catch (error) {
    console.log(error);
  }
};

const onDealWithDate = () => {
  state.selectedDetails.time.forEach((dateItem) => {
    // 检查当前日期的 time 数组
    const hasSubscribed = dateItem.time.some((timeItem) => {
      let isSelected = false;
      if (timeItem.is_subscribe === 1) {
        isSelected = true;
        state.appointmentTime = timeItem.id;
      }
      return isSelected;
    });

    // 根据是否有 is_subscribe = 1 来设置 isSelected
    dateItem.isAppointment = hasSubscribed;
    if (hasSubscribed && state.selectedDate === "") {
      state.selectedDate = dateItem.date;
    }

    if (dateItem.date === state.selectedDate) {
      state.selectedTimeList = dateItem.time;
    }
  });
  state.isShowDrawer = true;
  // console.log(state.selectedDate);
  // console.log(state.appointmentTime);
  // console.log(state.selectedDetails.time);
};

const onChangeQMode = (value) => {
  state.quickMode = value;
};

const onSelectDate = (item) => {
  state.selectedDate = item.date;
  state.selectedTimeList = item.time;
};
</script>
<template>
  <div class="activity-record-details">
    <div class="content height_calc">
      <div class="top_swipe">
        <van-swipe :autoplay="3000" v-if="state.selectedDetails?.poster">
          <van-swipe-item
            v-for="item in state.selectedDetails?.poster"
            :key="item?.file_path"
          >
            <van-image
              radius="10"
              :src="item?.file_path"
              alt="Empty state illustration"
            />
          </van-swipe-item>

          <template #indicator="{ active, total }">
            <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
          </template>
        </van-swipe>

        <div class="controls_mode">
          <div
            class="toggleLang"
            :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
          >
            <div
              class="langItem activeBtn"
              :class="{ langActive: state.quickMode == 1 }"
              @click="onChangeQMode(1)"
            >
            {{ $t('photo') }}
            </div>
            <div
              class="langItem activeBtn"
              :class="{ langActive: state.quickMode == 2 }"
              @click="onChangeQMode(2)"
            >
            {{ $t('video') }}
            </div>
          </div>
        </div>

        <div class="controls_share">
          <div class="share-btn">
            <img
              src="@/assets/rectangle_transaction.svg"
              alt=""
              class="background-image"
            />
            <span class="share-text" @click="state.onShare = true">{{ $t('V4_share') }}</span>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="item_left">{{ $t('activity_status') }}</div>
        <div class="item_right">{{ state.selectedDetails?.status_name }}</div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">{{ $t('user_activityname') }}</div>
        <div class="item_right">{{ state.selectedDetails?.title }}</div>
      </div>
      <a-divider />
      <div class="item_data_time">
        <div class="item_left">{{ $t('activity_Date') }}</div>
        <div class="date-options">
          <div
            v-for="(item, index) in state.selectedDetails.time"
            :key="item.date"
            :class="[
              'date-option',
              { selected: item.date === state.selectedDate },
            ]"
            @click="onSelectDate(item)"
          >
            <div class="leftBadge basicsBadge">
              {{ item.isAppointment ? "已预约" : "未预约" }}
            </div>
            {{ item.date }}
          </div>
        </div>
      </div>
      <a-divider />
      <div class="item_data_time">
        <div class="item_left">{{ $t('user_activitytime') }}</div>
        <div class="time-options">
          <div
            v-for="(item, index) in state.selectedTimeList"
            :key="item.id"
            :class="['time-option', { selected: item.is_subscribe === 1 }]"
          >
            {{ item.start_time }} ~ {{ item.end_time }}
            <div class="leftBadge basicsBadge">
              {{ item.is_subscribe === 1 ? "已预约" : "未预约" }}
            </div>
          </div>
        </div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">{{ $t('Enrollment_quantity') }}</div>
        <div class="item_right">xxx</div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">{{ $t('user_activityplace') }}</div>
        <div class="item_right">{{ state.selectedDetails?.nameMerge }}</div>
      </div>
      <a-divider />
      <div class="item_description">
        <div class="item_top">{{ $t('Activity_Introduction') }}</div>
        <div class="item_bottom">
          {{ state.selectedDetails?.content }}
        </div>
      </div>
      <a-divider />
      <div class="item_comments">
        <div class="item_comments_top">
          <div class="item_comments_left">活动评价</div>
          <div class="item_comments_right" @click="state.onShowTextArea = true">
            <img src="@/assets/my/activity-record/comments_edit.svg" alt="" />
          </div>
        </div>
        <div
          class="item_comments_bottom"
          v-for="item in state.selectedDetails?.comments"
          :key="item.id"
        >
          {{ item.contents }}
        </div>
      </div>
    </div>

    <div class="bottom_info_btn" v-if="state.selectedDetails?.status_name == '报名成功'">
      <a-button shape="round" block class="cancel_btn">{{ $t('Cancel_Enrollment') }}</a-button>
    </div>

    <van-dialog
      v-model:show="state.onShowTextArea"
      title="活动评价"
      message-align="center"
      show-cancel-button
    >
      <a-textarea
        style="width: 83%; margin: 20px 30px"
        v-model:value="state.comments"
        :allowClear="true"
        :placeholder="`请输入本次活动的评价`"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </van-dialog>
    <van-popup v-model:show="state.onShare" round class="share-popup">
      <MyActivityRecordShare
        :data="state.selectedDetails"
        @onClose="state.onShare = false"
      />
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.activity-record-details {
  position: relative;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .height_calc {
    height: calc(100% - 50px);
  }
  .content {
    overflow-y: auto;
    margin-bottom: 10px;

    .top_swipe {
      position: relative;
      background-color: #fff;
      padding: 10px;

      .custom-indicator {
        position: absolute;
        left: 5px;
        bottom: 5px;
        padding: 2px 5px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.1);
      }

      .controls_mode {
        position: absolute;
        width: 40%;
        bottom: 10px;
        left: 30%;
        display: flex;
        align-items: center;
        .toggleLang {
          width: 140px;
          height: 38px;
          padding: 4px;
          background: #333f6c;
          border-radius: 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .langItem {
            color: #868686;
            padding: 2px 16px;
            min-width: 60px;
            height: 28px;
          }
          .langActive {
            background: #707794;
            box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
            border-radius: 17px 17px 17px 17px;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
          }
        }
      }
      .controls_share {
        position: absolute;
        width: 20%;
        bottom: 10px;
        right: 8px;
        display: flex;
        align-items: center;
        .share-btn {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }

        .background-image {
          display: block;
          width: 100%;
          height: auto;
        }

        .share-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ffffff;
          font-size: 14px;
        }
      }
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      padding: 10px;

      .item_left {
        color: rgba(97, 97, 97, 1);
        font-size: 14px;
      }
      .item_right {
        color: rgba(32, 32, 32, 1);
        font-size: 14px;
      }
    }
    .item_data_time {
      display: flex;
      padding: 10px;
      background-color: #fff;
      flex-direction: column;

      .item_left {
        margin-bottom: 10px;
        color: rgba(97, 97, 97, 1);
        font-size: 14px;
      }
      .date-options,
      .time-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .date-option,
      .time-option {
        padding: 8px 10px;
        border: 1px solid #d9d9d9;
        background-color: rgba(97, 97, 97, 0.05);
        color: rgba(97, 97, 97, 1);
        border-radius: 4px;
        position: relative;
      }

      .date-option.selected,
      .time-option.selected {
        background-color: #e6f7ff;
        border-color: #91d5ff;
        color: #1890ff;
      }
      .leftBadge {
        position: absolute;
        left: 0;
        top: 0;
      }
      .basicsBadge {
        padding: 3px 5px;
        background: #1a49c0;
        border-radius: 2px 0px 2px 0px;
        font-size: 7px;
        color: #ffffff;
      }
    }
    .item_description,
    .item_comments {
      display: flex;
      padding: 10px;
      background-color: #fff;
      flex-direction: column;
      .item_top {
        margin-bottom: 10px;
        color: rgba(97, 97, 97, 1);
        font-size: 14px;
      }
      .item_bottom,
      .item_comments_bottom {
        color: rgba(32, 32, 32, 1);
        font-size: 14px;
      }
      .item_comments_top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        color: rgba(97, 97, 97, 1);
        font-size: 14px;
      }
    }
  }

  .bottom_info_btn {
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
  .share-popup {
    background: transparent !important;
    padding: 10px;
    width: 100%;
    .share-popup-container {
      border-radius: 10px;
      background-color: #fff;
      .share-popup-content {
        padding: 16px;
        .share-popup-title {
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
        }
        .share-popup-item {
          margin-top: 20px;
          font-size: 14px;
          color: rgba(32, 32, 32, 1);
        }
        .share-popup-item_value {
          font-size: 14px;
          color: rgba(97, 97, 97, 1);
        }
      }
      .share-popup-scan {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: end;
        background-color: rgba(0, 0, 0, 0.03);
        .share-popup-scan-text {
          font-size: 14px;
          color: rgba(97, 97, 97, 1);
        }
        .share-popup-scan-image {
          width: 80px;
          height: 80px;
        }
      }
    }
    .share-popup-footer {
      margin-top: 15px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      background-color: #fff;
      border-radius: 12px; /* 圆角效果 */

      .footer-button {
        background: none;
        border: none;
        color: rgba(97, 97, 97, 1); /* 按钮文字颜色 */
        padding: 10px 20px;
        cursor: pointer;
        font-size: 14px;
      }
      .share-button {
        color: rgba(31, 86, 225, 1);
        font-size: 14px;
        width: 30%;
      }

      .divider {
        width: 1px; /* 分隔线宽度 */
        height: 30px; /* 分隔线高度 */
        background-color: #e0e0e0; /* 分隔线颜色 */
      }
    }
    .share-popup-close {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
:deep(.ant-divider-horizontal) {
  margin: 0 !important;
}
</style>
