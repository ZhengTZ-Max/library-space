<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'activity',
        showTabbar:true
      }
    }
</route>
<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getActivityRecordList,
  getActivityDetail,
  saveComments,
} from "@/request/activity-record";
import Carousel from "@/components/CarouselCom.vue";

const router = useRouter();

const state = reactive({
  activeKey: "1",

  activeKeyList: [
    { value: "1", label: $t("ApplicationRecord") },
    { value: "2", label: "报名记录" },
    { value: "3", label: $t("Drafts") },
  ],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],

  refreshing: false,
  loading: false,
  finished: true,

  isShowDrawer: false,
  selectedRecord: "",
  selectedDetails: {},
  selectedDate: "",
  selectedTimeList: [],
  appointmentTime: "",
  isShowTextArea: false,
  comments: "",

  status_name: "报名成功",
});

onMounted(() => {
  fetch();
});

watch(
  () => state.activeKey,
  () => {
    state.currentPage = 1;
    fetch();
  }
);

const onRefresh = () => {
  state.currentPage = 1;
  fetch();
};
const onLoad = () => {
  state.currentPage++;
  fetch();
};

const fetch = async () => {
  try {
    let params = {
      ilk: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getActivityRecordList(params);
    console.log(res);
    state.loading = false;
    state.refreshing = false;
    if (res?.code === 0) {
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
      state.total = 0;
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
    state.total = 0;
    console.log(error);
  }
};

// tab 切换
const onChangeTab = (key) => {
  state.activeKey = key;
  state.currentPage = 1;
  fetch();
  console.log(key);
};

const onClickItem = (id) => {
  if (state.activeKey !== "3") {
    if (state.activeKey == "1") {
      // 申请记录
      router.push({
        path: "/mo/profile/activity-record-apply-details",
        query: { id },
      });
    } else {
      // 报名记录
      router.push({
        path: "/mo/profile/activity-record-signup-details",
        query: { id },
      });
    }
  } else {
    // 草稿箱
    router.push({
      path: "/mo/profile/activity-record-details",
      query: { id },
    });
  }
};
</script>

<template>
  <div class="activityRecord">
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

    <div class="refreshCon">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-if="state.data.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="$t('No_more')"
          @load="onLoad"
        >
          <div
            class="item_list"
            v-if="state.activeKey !== '3'"
            v-for="item in state.data"
            :key="item?.id"
            @click="onClickItem(item?.id)"
          >
            <div class="item_title">{{ item?.title }}</div>
            <div
              class="rigthBadge basicsBadge"
              :class="{
                status_not_started: item?.status_name === '未开始',
                status_in_registration: item?.status_name === '报名中',
                status_in_progress: item?.status_name === '进行中',
                status_end:
                  item?.status_name === '已结束' ||
                  item?.status_name === '审核未通过',
                status_success: item?.status_name === '报名成功',
              }"
            >
              {{ item?.status_name }}
            </div>
            <van-image
              :src="item?.poster[0]?.file_path"
              alt="Empty state illustration"
            />
            <div class="item_bottom">
              <div class="event-location">
                <img src="@/assets/event/seat.svg" alt="Location" />
                <span>{{ item?.nameMerge }}</span>
              </div>
              <div class="event-time">
                <img src="@/assets/event/time.svg" alt="Time" />
                <div class="timeList">
                  <span>{{ item?.show_date }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="item_list"
            v-if="state.activeKey == '3'"
            v-for="item in state.data"
            :key="item?.id"
            @click="onClickItem(item)"
          >
            <div class="item_title">{{ item?.title }}</div>
            <van-image
              radius="10"
              :src="item?.poster[0]?.file_path"
              alt="Empty state illustration"
            />
            <div class="item_bottom_draft" @click="onClickDraftEdit('1')">
              <div class="draft_left">1111</div>
              <div class="draft_right">
                <div class="draft_time">编辑</div>
                <img src="@/assets/my/mobile_event_edit_draft.svg" alt="Edit" />
              </div>
            </div>
          </div>
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<style lang="less" scoped>
.activityRecord {
  height: 100%;
  overflow: auto;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;

  .cHeader {
    background-color: #fff;
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

  .item_list {
    border-radius: 10px;
    background: #fff;
    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    position: relative;
    margin-bottom: 30px;

    .item_title {
      font-size: 14px;
      color: rgba(32, 32, 32, 1);
      margin-bottom: 12px;
    }
    .rigthBadge {
      position: absolute;
      right: 0;
      top: 0;
    }
    .basicsBadge {
      padding: 3px 8px;
      border-radius: 0px 6px 0px 6px;
      font-size: 10px;
    }

    .status_not_started {
      background: rgba(174, 174, 174, 1);
    }
    .status_in_registration {
      background: rgba(86, 187, 70, 1);
    }
    .status_in_progress {
      background: rgba(233, 239, 252, 1);
      color: rgba(31, 86, 225, 1);
    }
    .status_end {
      background: rgba(243, 243, 243, 1);
      color: rgba(174, 174, 174, 1);
    }
    .status_success {
      background: rgba(238, 250, 239, 1);
      color: rgba(78, 201, 91, 1);
    }
    .item_bottom {
      padding: 10px 10px 0px 0px;

      .event-location,
      .event-time {
        display: flex;
        align-items: flex-start;

        margin-bottom: 8px;
        margin-top: 4px;
        color: #868686;
        font-size: 13px;

        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        .timeList {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
    .item_bottom_draft {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      .draft_left {
        font-size: 13px;
        color: rgba(134, 134, 134, 1);
      }
      .draft_right {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: rgba(31, 86, 225, 1);
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
:deep(.ant-tabs-nav) {
  margin-bottom: 0px !important;
}
.refreshCon {
  flex: 1;
  .van-pull-refresh {
    height: 100%;
  }
}
</style>
