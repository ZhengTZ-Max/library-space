<route>
    {
      meta: {
        showHead: false,
        showLeftBack:false,
        title:'menu_home',
        showTabbar:true
      }
    }
    </route>

<script setup>
import { reactive, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import {
  getMyFeedback,
  getFeedbackCategory,
  getFeedbackIlk,
  postFeedback,
  postFeedbackForRepair,
  getIlkAddress,
  getFeedbackDetail,
} from "@/request/feedback";
import Uploader from "@/components/Uploader.vue";
import FeedbackFilter from "@/components/FeedbackFilter.vue";
import FeedbackDetailsMobile from "@/components/Feedback/FeedbackDetailsMobile.vue";
import FeedbackSubmitMobile from "@/components/Feedback/FeedbackSubmitMobile.vue";

const state = reactive({
  activeKey: "1",
  activeKeyList: [
    { label: "反馈列表", value: "1" },
    { label: "意见反馈", value: "2" },
    { label: "设备报修", value: "3" },
  ],
  isOptionDetails: false,

  refreshing: false,
  loading: false,
  finished: true,

  data: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  isShowDrawer: false,
  isShowSubmitDrawer: false,
  submitType: "",
  record: {},
  detail: {},

  submitInfo: {
    activeKey: "1",
    categoryList: [],
    categoryAreaList: [],
    categoryAreaId: "",
    categoryAreaName: "",
    categoryTypeList: [],
    categoryTypeId: "",
    categoryTypeName: "",
    categoryInputContent: "",
    fileList: [],
    phone: "",
    email: "",

    ilkList: [],
    ilkTypeList: [],
    ilkTypeId: "",
    ilkTypeName: "",
    ilkAddressList: [],
    concatenatedNames: "",
    ilkSeat: "",
    ilkIsStop: 0,
    ilkMobile: "",
    ilkContent: "",
  },

  defaultPic:
    "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
});

onMounted(() => {
  fetch();
  fetchCategory();
  fetchIlk();
});

watch(
  () => state.activeKey,
  (v) => {
    if (v != "1") {
      state.submitInfo.activeKey = v;
    }
  }
);

const onLoad = () => {
  state.currentPage++;
  fetch();
};

const onRefresh = () => {
  state.currentPage = 1;
  fetch();
};

const onShowOptionDetails = (item) => {
  state.record = item;
  fetchGetFeedbackDetail();
};

const fetch = async () => {
  try {
    let params = {
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getMyFeedback(params);
    state.loading = false;
    state.refreshing = false;

    if (res.code == 0) {
      if (state.currentPage === 1) {
        state.data = res?.data?.data || [];
      } else {
        state.data.push(...res?.data?.data);
      }
      state.total = res?.data?.total || 0;
      state.finished = state.currentPage >= res?.data?.last_page;
    } else {
      state.data = [];
      state.finished = true;
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
    console.log(error);
  }
};

const fetchGetFeedbackDetail = async () => {
  try {
    let params = {
      type: state.record.type,
      id: state.record.id,
    };
    const res = await getFeedbackDetail(params);
    if (res.code == 0) {
      state.detail = res.data;
      state.detail.type = state.record.type;
      state.isOptionDetails = true;
    } else {
      state.detail = {};
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchCategory = async () => {
  try {
    const res = await getFeedbackCategory();
    if (res.code == 0) {
      state.submitInfo.categoryList = res.data;

      state.submitInfo.categoryList.forEach((item) => {
        let obj = {
          value: item.id,
          label: item.name,
        };
        state.submitInfo.categoryAreaList.push(obj);
      });
      console.log(state.submitInfo.categoryAreaList);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchIlk = async () => {
  try {
    const res = await getFeedbackIlk();
    if (res.code == 0) {
      state.submitInfo.ilkList = res.data;

      state.submitInfo.ilkList.forEach((item) => {
        let obj = {
          value: item.id,
          label: item.name,
        };
        state.submitInfo.ilkTypeList.push(obj);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const onApply = () => {
  if (state.activeKey == "2") {
    // 意见反馈
    if (!state.submitInfo.categoryAreaId) {
      message.warning("请先选择反馈区域");
      return;
    }
    if (!state.submitInfo.categoryTypeId) {
      message.warning("请先选择反馈类型");
      return;
    }
    if (!state.submitInfo.categoryInputContent) {
      message.warning("请输入反馈内容");
      return;
    }
    if (!state.submitInfo.fileList.length) {
      message.warning("请上传反馈图片");
      return;
    }
    if (!state.submitInfo.phone) {
      message.warning("请输入手机号");
      return;
    }
    if (!state.submitInfo.email) {
      message.warning("请输入邮箱");
      return;
    }
    let params = {
      area_id: state.submitInfo.categoryAreaId,
      cate_id: state.submitInfo.categoryTypeId,
      content: state.submitInfo.categoryInputContent,
      pic_urls: state.submitInfo.fileList,
      mobile: state.submitInfo.phone,
      email: state.submitInfo.email,
    };
    console.log(params);
    fetchSubmit(params);
  } else if (state.activeKey == "3") {
    // 设备报修
    // fetchSubmit(params);
    if (!state.submitInfo.ilkTypeId) {
      message.warning("请选择报修类型");
      return false;
    }

    if (state.submitInfo.ilkTypeHaveRegion) {
      // 此时必填区域
      if (!state.submitInfo.ilkAreaID) {
        message.warning("请选择报修区域");
        return false;
      }
      if (!state.submitInfo.ilkTypeIsSpace) {
        // 不是空间类型， 座位一栏显示
        // 此时必填座位 第一层 ilkTypeHaveRegion 的判断下 此时必填区域
        if (!state.submitInfo.ilkSeat) {
          message.warning("请选择报修座位");
          return false;
        }
      }
    }

    if (!state.submitInfo.ilkMobile) {
      message.warning("请输入联系电话");
      return false;
    }
    if (!state.submitInfo.ilkContent) {
      message.warning("请输入报修内容");
      return false;
    }
    if (!state.submitInfo.fileList.length) {
      message.warning("请上传反馈图片");
      return false;
    }
    let areaId = state.submitInfo.ilkTypeHaveRegion
      ? state.submitInfo.ilkAreaID
      : "0";
    let spaceId = state.submitInfo.ilkTypeHaveRegion
      ? state.submitInfo.ilkSeat
      : "0";
    let params = {
      type_id: state.submitInfo.ilkTypeId,
      content: state.submitInfo.ilkContent,
      pic_urls: state.submitInfo.fileList,
      mobile: state.submitInfo.ilkMobile,
      area_id: areaId,
      space_id: spaceId,
    };
    console.log(params);
    fetchSubmit(params);
  }
};
const fetchSubmit = async (params) => {
  try {
    if (state.activeKey == "2") {
      const res = await postFeedback(params);
      if (res.code == 0) {
        message.success(res.message);

      }
    } else {
      const res = await postFeedbackForRepair(params);
      if (res.code == 0) {
        message.success(res.message);

      }
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="feedback">
    <div v-if="!state.isOptionDetails" style="height: 100%; overflow-y: hidden">
      <div class="cHeader">
        <div class="quickMode">
          <div
            v-for="item in state.activeKeyList"
            :key="item.label"
            class="item activeBtn"
            :class="{ itemActive: item?.value == state.activeKey }"
            @click="state.activeKey = item?.value"
          >
            {{ item?.label }}
          </div>
        </div>
      </div>

      <!-- 反馈列表 -->
      <van-pull-refresh
        v-model="state.refreshing"
        @refresh="onRefresh"
        v-if="state.activeKey == '1'"
      >
        <van-list
          v-if="state.data.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="feedback_list" v-for="item in state.data" :key="item?.id">
            <div class="item" @click="onShowOptionDetails(item)">
              <div class="van-ellipsis item_title">
                {{ item?.content }}
              </div>
              <div class="type_time">
                <div
                  class="type"
                  :class="{
                    opinion: item?.type == '1',
                    device: item?.type == '2',
                  }"
                >
                  {{ item?.type === "1" ? "意见反馈" : "设备报修" }}
                </div>
                <div class="time">{{ item?.create_time }}</div>
              </div>
              <a-divider />
              <div class="right_arrow">
                <img
                  src="@/assets/activity_application/right_arrow_gray.svg"
                  alt=""
                />
              </div>
              <div class="status_dot" v-if="item?.is_read == '0'"></div>

              <!-- <img src="@/assets/activity_application/right_arrow_gray.svg" alt="" /> -->
            </div>
          </div>
        </van-list>
        <a-empty v-else />
      </van-pull-refresh>

      <!-- 意见反馈 / 设备报修-->
      <div class="feedback_option_tab">
        <FeedbackSubmitMobile :data="state.submitInfo" />

        <div class="option_bottomAction">
          <van-button round block type="default">
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            返回
          </van-button>
          <van-button round block type="primary" @click="onApply"
            >提交</van-button
          >
        </div>
      </div>
    </div>

    <!-- 反馈详情 -->
    <div v-if="state.isOptionDetails">
      <FeedbackDetailsMobile :data="state.detail" />

      <div class="bottomAction">
        <van-button
          round
          block
          type="default"
          @click="state.isOptionDetails = false"
        >
          <img src="@/assets/seat/moBackBtn.svg" alt="" />
          返回
        </van-button>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.feedback {
  height: 100%;
  background-color: #fafafa;
  overflow: hidden;
  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
  }
  .quickMode {
    display: flex;
    gap: 20px;
    .item {
      padding-bottom: 10px;
      font-size: 15px;
      color: #616161;

      &.itemActive {
        color: #202020;
        border-bottom: 2px solid #1a49c0;
      }
    }
  }
  .feedback_list {
    height: 100%;
    overflow-y: auto;
    margin-top: 10px;
    .item {
      position: relative;
      background-color: #fff;
      padding: 10px;
      padding-bottom: 0;
      .item_title {
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
      }
      .type_time {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
        margin-top: 10px;
        .type {
          font-size: 12px;
          margin-right: 10px;
        }
        .opinion {
          background-color: rgba(31, 86, 225, 0.1);
          padding: 2px 8px;
          color: rgba(31, 86, 225, 1);
        }
        .device {
          background-color: rgba(243, 116, 0, 0.1);
          padding: 2px 8px;
          color: rgba(243, 116, 0, 1);
        }
        .time {
          font-size: 12px;
          color: rgba(97, 97, 97, 1);
        }
      }
      .right_arrow {
        position: absolute;
        right: 10px;
        top: 35%;
      }
      .status_dot {
        width: 6px;
        height: 6px;
        background: #f72222;
        border-radius: 7px;
        position: absolute;
        right: 10px;
        top: 10px;
      }
    }
  }

  .bottomAction {
    padding: 12px;
    flex: 1;
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

  .feedback_option_tab {
    height: calc(100vh - 110px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    :deep(.option_content) {
      flex: 1;
      overflow-y: auto;
    }

    .option_bottomAction {
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
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0px !important;
}
:deep(.ant-divider-horizontal) {
  margin: 0 !important;
}
:deep(.van-pull-refresh) {
  min-height: 90vh !important;
}
</style>
