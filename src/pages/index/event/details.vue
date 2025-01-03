<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import Carousel from "@/components/CarouselCom.vue";
import EventApplyCom from "../../../components/EventApplyCom.vue";
import EventApplyResultCom from "../../../components/EventApplyResultCom.vue";
import { getEventDetails, getApplyActivity } from "@/request/event";
import { exchangeDateTime } from "../../../utils";

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

const onApplyClose = () => {
  state.isApply = false;
  fetchApplyActivity();
};


</script>
<template>
  <div class="eventDetail">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/event')"
              >{{ $t("V4_select_an_event") }}</a-breadcrumb-item
            >
            <a-breadcrumb-item>{{ $t("V4_sign_up_now") }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
    </a-affix>
    <div class="content">
      <div class="left_info">
        <div class="left_top">
          <div class="left_top_content">
            <Carousel>
              <template v-slot:content>
                <div v-for="item in state.eventImg">
                  <img class="image" :src="item?.file_path" alt="" />
                </div>
              </template>
            </Carousel>
            <div class="controls" v-if="state.eventInfo.publicize?.length > 0">
              <div></div>
              <div
                class="toggleLang"
                :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
              >
                <div
                  class="langItem activeBtn"
                  :class="{ langActive: state.quickMode == 1 }"
                  @click="onChangeQMode(1)"
                >
                  {{ $t("photo") }}
                </div>
                <div
                  class="langItem activeBtn"
                  :class="{ langActive: state.quickMode == 2 }"
                  @click="onChangeQMode(2)"
                >
                  {{ $t("video") }}
                </div>
              </div>
              <div class="share-btn">
                <img
                  src="@/assets/rectangle_transaction.svg"
                  alt=""
                  class="background-image"
                />
                <span class="share-text">{{ $t("V4_share") }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="left_bottom">
          <div>
            <span
              class="left_bottom_title_status"
              :class="{
                status_not_started: state.eventInfo?.status_name === '未开始',
                status_in_registration:
                  state.eventInfo?.status_name === '报名中',
                status_in_progress: state.eventInfo?.status_name === '进行中',
              }"
              >{{ state.eventInfo?.status_name }}</span
            >
            <span class="left_bottom_title_name">{{
              state.eventInfo?.title
            }}</span>
          </div>
          <div class="left_bottom_detail">
            <div class="left_bottom_detail_item">
              <span>{{ $t("user_activityplace") + "： " }}</span>
              <span>{{ state.eventInfo?.nameMerge }}</span>
            </div>
            <div class="left_bottom_detail_item">
              <span>{{ $t("Activity_Introduction") + "： " }}</span>
              <span>
                {{ state.eventInfo?.content }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right_info">
        <div class="right_info_box">
          <div class="right_info_title">{{ $t("activity_Date") }}</div>
          <a-row v-if="state.eventDateList?.length" :gutter="[15, 15]">
            <template v-for="item in state.eventDateList" :key="item?.date">
              <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
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
          <a-empty v-else />
          <div class="right_info_title" style="margin-top: 50px">{{ $t("user_activitytime") }}</div>
          <a-row v-if="state.eventTimeList?.length" :gutter="[15, 15]">
            <template v-for="item in state.eventTimeList" :key="item?.id">
              <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <div
                  class="libraryItem cardItemBorTran"
                  :class="{ activeItem: item?.id == state.eventTimeIndex }"
                  @click="onChangeTimeAct(item)"
                >
                  <span>{{ item?.show_time }}</span>
                  <div
                    v-if="item?.id == state.eventTimeIndex"
                    class="check_icon"
                  >
                    <img src="@/assets/event/checked.svg" />
                  </div>
                </div>
              </a-col>
            </template>
          </a-row>

          <div class="right_info_title" style="margin-top: 50px">{{ $t("Enrollment_quantity") }}</div>
          <div
            v-if="state.eventTimeList?.length"
            style="color: rgba(97, 97, 97, 1)"
          >
            {{ state.eventCurrentNum }}/{{ state.eventMaxNum }}
          </div>
          <div v-if="state.eventTimeList?.length" class="right_info_btn">
            <a-button
              type="primary"
              shape="round"
              style="width: 200px"
              @click="onApply"
              >{{ $t("INeedToRegiste") }}</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <a-modal
      width="40%"
      v-model:open="state.isApply"
      :title="$t('V4_contact_information')"
      destroyOnClose
      :footer="null"
      @cancel="state.isApply = false"
      centered
    >
      <EventApplyCom :data="state.applyInfo" @close="onApplyClose" />
    </a-modal>
    <a-modal
      width="22%"
      v-model:open="state.isApplyResult"
      destroyOnClose
      :closable="false"
      @cancel="state.isApplyResult = false"
      :footer="null"
      centered
    >
      <EventApplyResultCom :data="state.applyResultInfo" />
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.eventDetail {
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
    .rightAction {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .quickDate {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      .filters {
        margin-left: 20px;
        padding: 8px 16px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 18px 18px 18px 18px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }
  }
  .content {
    margin: 20px 30px;
    border-radius: 10px;
    height: calc(100% - 110px);
    background: #fff;
    display: flex;
    .left_info {
      width: 60%;
      background: #f7f9fb;
      border-radius: 10px;
      margin-right: 20px;
      overflow: auto;
      .left_top {
        height: 65%;
        min-height: 570px;
        background: #fff;
        border-radius: 10px;
        margin: 20px;
        .left_top_content {
          padding: 20px 20px 0 20px;
          position: relative;
          width: 100%;
          .image {
            width: 100%;
            height: 500px;
            object-fit: cover; /* 确保图片不失真 */
          }

          .controls {
            position: absolute;

            width: 87%;
            bottom: 30px;
            right: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .toggleLang {
              width: 140px;
              height: 35px;
              margin-bottom: 25px;
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
      }
      .left_bottom {
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        margin: 20px;
        .left_bottom_title_status {
          margin-right: 10px;
          padding: 3px 8px;

          font-size: 14px;
          color: #ffffff;
        }
        .status_not_started {
          background: rgba(174, 174, 174, 1);
        }
        .status_in_registration {
          background: rgba(86, 187, 70, 1);
        }
        .status_in_progress {
          background: rgba(26, 73, 192, 1);
        }
        .left_bottom_title_name {
          font-size: 18px;
          color: #202020;
        }
        .left_bottom_detail {
          .left_bottom_detail_item {
            display: flex;
            align-items: flex-start;
            margin-top: 15px;
            span {
              &:nth-child(1) {
                font-size: 16px;
                color: #a7a7a7;
                margin-left: 2px;
              }
              &:nth-child(2) {
                flex: 1;
                font-size: 16px;
                color: #6e6e6e;
                margin-left: 2px;
              }
            }
          }
        }
      }
    }
    .right_info {
      width: 40%;
      background: #f7f9fb;
      border-radius: 10px;
      margin-left: 20px;
      padding: 20px;
      .right_info_box {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .right_info_title {
          font-size: 18px;
          color: #202020;
          font-weight: bold;
          // font-family: AliHeavy !important;
          margin-bottom: 20px;
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
        .right_info_btn {
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
      }
    }
  }
}

:deep(.slick-prev) {
  left: 0 !important;
  bottom: 12px !important;
}
:deep(.slick-next) {
  right: 0 !important;
  bottom: 12px !important;
}
:deep(.carouseDots) {
  bottom: 3px !important;
}

.ant-input,
.ant-input-affix-wrapper {
  padding-left: 20px;
  border-radius: 40px;
}
</style>
