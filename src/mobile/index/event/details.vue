<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'EventRegistration',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import EventApplyMobileCom from "../../../components/EventApplyMobileCom.vue";
import EventApplyResultMobileCom from "../../../components/EventApplyResultMobileCom.vue";
import { getEventDetails, getApplyActivity } from "@/request/event";
import { exchangeDateTime, getUserInfo } from "@/utils";
const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();

const state = reactive({

  id: route?.query?.id || "",
  eventInfo: {},
  eventImg: [],
  eventDateList: [],
  eventDateIndex: "",
  eventTimeList: [],
  eventTimeIndex: "",
  eventMaxNum: "",
  eventCurrentNum: "",
  eventTimeShow: "",
  isApply: false,
  isApplyResult: false,
  quickMode: 1,
  applyInfo: { phone: "", email: "", isClose: false },
  applyResultInfo: {
    result: "success",
    message: "XXXX",
    eventInfo: {},
    eventDateIndex: "",
    eventTimeShow: "",
    isClose: false,
  },
});

onMounted(() => {
  fetchEventDetails();
});

watch(
  () => state.eventDateList,
  (v) => {
    if (v?.length) {
      state.eventDateIndex = v[0]?.date;
      state.eventTimeList = v[0]?.list;
    }
  }
);

watch(
  () => state.eventTimeList,
  (v) => {
    if (v?.length) {
      state.eventTimeIndex = v[0]?.id;
      state.eventCurrentNum = v[0]?.count;
      state.eventTimeShow = v[0]?.show_time;
    }
  }
);
watch(
  () => state.applyInfo.isClose,
  (v) => {
    if (v) {
      state.isApply = false;
      fetchApplyActivity();
    }
  }
);
watch(
  () => state.applyResultInfo.isClose,
  (v) => {
    if (v) {
      state.isApplyResult = false;
    }
  }
);

const goToLink = (link) => {
  router.replace(link);
};
const onChangeQMode = (value) => {
  state.quickMode = value;
};
const onChangeDateAct = (row) => {
  state.eventDateIndex = row?.date;
  state.eventTimeList = row?.list;
  state.eventCurrentNum = row?.list[0]?.count;
  state.eventTimeShow = row?.list[0]?.show_time;
};
const onChangeTimeAct = (row) => {
  state.eventTimeIndex = row?.id;
  state.eventCurrentNum = row?.count;
  state.eventTimeShow = row?.show_time;
};

const getDefalutList = () => {
  return {
    code: 0,
    message: "操作成功",
    data: {
      id: "1402",
      title: "v4申请活动标题",
      status: -1,
      max: "25",
      nameMerge: "活动馆舍-一层-活动区域",
      ennameMerge: "new prem--ActivityArea001",
      content: "v4申请活动内容",
      ddl_time: "2024-04-19 16:59:30",
      status_name: "未开始",
      status_en_name: "Not started",
      times: [
        {
          date: "2024-04-18",
          list: [
            {
              id: "1942",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-19",
          list: [
            {
              id: "1943",
              show_time: "10:00-20:00",
              count: 0,
            },
          ],
        },
        {
          date: "2024-04-20",
          list: [
            {
              id: "1944",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-21",
          list: [
            {
              id: "1945",
              show_time: "08:00-09:00",
              count: 1,
            },
            {
              id: "1946",
              show_time: "10:00-20:00",
              count: 1,
            },
            {
              id: "1947",
              show_time: "21:00-22:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-22",
          list: [
            {
              id: "1948",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-23",
          list: [
            {
              id: "1949",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-24",
          list: [
            {
              id: "1950",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-25",
          list: [
            {
              id: "1951",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
      ],
    },
  };
};

const onApply = () => {
  state.isApply = true;
};
const onApplyResult = () => {
  state.isApplyResult = true;
};

const fetchEventDetails = async () => {
  try {
    let res = await getEventDetails({ id: state.id });

    if (res?.code == 0) {
      state.eventInfo = res?.data || {};
      state.eventImg = res?.data?.poster || [];
      state.eventDateList = res.data?.times;
      state.eventMaxNum = state.eventInfo?.max;
      console.log(state.eventDateList);
    } else {
      state.eventInfo = {};
      state.eventImg = [];
      state.eventDateList = [];
      state.eventMaxNum = 0;
    }
  } catch (e) {
    state.eventInfo = {};
    state.eventImg = [];
    state.eventDateList = [];
    state.eventMaxNum = 0;
    console.log(e);
  }
};
const fetchApplyActivity = async () => {
  try {
    let params = {
      id: state.eventTimeIndex, // 活动时间 id
      book_id: state.eventInfo?.id, // 活动 id
      mobile: state.applyInfo.phone,
      email: state.applyInfo.email,
    };
    let res = await getApplyActivity(params);
    let result = {};

    result = {
      result: res?.code == 0 ? "success" : "failed",
      message: res?.message || "",
      eventInfo: state.eventInfo,
      eventDateIndex: state.eventDateIndex,
      eventTimeShow: state.eventTimeShow,
      isClose: false,
    };
    state.applyResultInfo = result;
    onApplyResult();
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <div class="content">
    <div class="top_img">
      <van-image
        :src="state.eventImg[0]?.file_path"
        alt="Empty state illustration"
      />
      <div class="controls" v-if="state.eventInfo.publicize.length > 0">
        <div class="toggleLang">
          <div
            class="langItem activeBtn langActive"
            :class="{ langActive: state.quickMode == 1 }"
            @click="onChangeQMode(1)"
          >
            图片
          </div>
          <div
            class="langItem activeBtn"
            :class="{ langActive: state.quickMode == 2 }"
            @click="onChangeQMode(2)"
          >
            视频
          </div>
        </div>
        <div class="share-btn">
          <img
            src="@/assets/rectangle_transaction.svg"
            alt=""
            class="background-image"
          />
          <span class="share-text">分享</span>
        </div>
      </div>
    </div>

    <div class="content_body">
      <div class="content_title">
        <span
          class="left_title_status"
          :class="{
            status_not_started: state.eventInfo?.status_name === '未开始',
            status_in_registration: state.eventInfo?.status_name === '报名中',
            status_in_progress: state.eventInfo?.status_name === '进行中',
          }"
          >报名中</span
        >

        <span class="left_title_name">{{ state.eventInfo?.title }}</span>
      </div>

      <div class="content_body_title">活动时间</div>
      <div class="content_body_data_time">
        <a-row v-if="state.eventDateList?.length" :gutter="[5, 5]">
          <template v-for="item in state.eventDateList" :key="item?.date">
            <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
              <div
                class="libraryItem cardItemBorTran"
                :class="{ activeItem: item?.date == state.eventDateIndex }"
                @click="onChangeDateAct(item)"
              >
                <span>{{ moment(item?.date).format("MM-DD") }}</span>
                <span>{{ exchangeDateTime(item?.date, 31) }}</span>
                <div
                  v-if="item?.date == state.eventDateIndex"
                  class="check_icon"
                >
                  <img src="@/assets/event/checked.svg" />
                </div>
              </div>
            </a-col>
          </template>
        </a-row>

        <a-row
          class="margin_top"
          v-if="state.eventTimeList?.length"
          :gutter="[5, 5]"
        >
          <template v-for="item in state.eventTimeList" :key="item?.id">
            <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
              <div
                class="libraryItem cardItemBorTran"
                :class="{ activeItem: item?.id == state.eventTimeIndex }"
                @click="onChangeTimeAct(item)"
              >
                <span>{{ item?.show_time }}</span>
                <div v-if="item?.id == state.eventTimeIndex" class="check_icon">
                  <img src="@/assets/event/checked.svg" />
                </div>
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
      <div class="content_body_title">活动人数</div>
      <div
        v-if="state.eventTimeList?.length"
        style="color: rgba(97, 97, 97, 1)"
      >
        {{ state.eventCurrentNum }}/{{ state.eventMaxNum }}
      </div>
      <div class="content_body_title">活动地点</div>
      <div class="content_body_data">{{ state.eventInfo?.nameMerge }}</div>
      <div class="content_body_title">活动介绍</div>
      <div class="content_body_data">
        {{ state.eventInfo?.content }}
      </div>
    </div>
  </div>
  <div class="bottomAction">
    <van-button round block type="default" @click="router.go(-1)">
      <img src="@/assets/seat/moBackBtn.svg" alt="" />
      返回
    </van-button>
    <van-button round block type="primary" @click="onApply"
      >我要报名</van-button
    >
  </div>

  <van-popup v-model:show="state.isApply" round @close="state.isApply = false">
    <EventApplyMobileCom :data="state.applyInfo" />
  </van-popup>
  <van-popup
    v-model:show="state.isApplyResult"
    round
    @close="state.isApplyResult = false"
  >
    <EventApplyResultMobileCom :data="state.applyResultInfo" />
  </van-popup>
</template>

<style lang="less" scoped>
.content {
  padding: 10px;
  height: calc(100% - 80px);
  background-color: #fff;
  overflow-y: auto;
  .top_img {
    position: relative;
    .controls {
      position: absolute;

      width: 70%;
      bottom: 0px;
      right: 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .toggleLang {
        width: 140px;
        height: 35px;
        margin-bottom: 15px;
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
  .content_body {
    .content_title {
      display: flex;
      align-items: center;
      background-color: #fff;

      .left_title_status {
        border-radius: 6px;
        margin-right: 10px;
        padding: 3px 8px;

        font-size: 14px;
        color: #ffffff;

        background: rgba(86, 187, 70, 1);
      }
      .left_title_name {
        font-size: 18px;
        color: #202020;
        flex: 1;
        // font-family: "AliHeavy";
        font-weight: bold;
      }
    }
    .content_body_title {
      color: rgba(32, 32, 32, 1);
      font-size: 14px;
      margin-bottom: 10px;
      margin-top: 10px;
      // font-family: AliHeavy !important;
      font-weight: bold;
    }
    .content_body_data_time {
      background-color: #fff;
      .margin_top {
        margin-top: 10px;
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
    .content_body_data {
      font-size: 16px;
      color: #6e6e6e;
    }
  }
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
</style>
