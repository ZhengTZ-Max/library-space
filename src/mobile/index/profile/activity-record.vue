<route>
    {
      meta: {
        showHead: true,
        showLeftBack:true,
        title:'activity',
        showTabbar:false
      }
    }
</route>
<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import {
  getActivityRecordList,
  getActivityDetail,
  saveComments,
} from "@/request/activity-record";
import Carousel from "@/components/CarouselCom.vue";

const state = reactive({
  activeKey: "1",
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],

  refreshing: false,
  loading: false,
  finished: false,

  isShowDrawer: false,
  selectedRecord: "",
  selectedDetails: {},
  selectedDate: "",
  selectedTimeList: [],
  appointmentTime: "",
  isShowTextArea: false,
  comments: "",
});

onMounted(() => {
  fetch();
});

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
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = false;
    state.data = [];
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

const onClickItem = (item) => {
  console.log(item.id);
};
</script>

<template>
  <div class="activityRecord">
    <a-tabs
      v-model:activeKey="state.activeKey"
      class="top_tabs"
      size="middle"
      @change="onChangeTab"
    >
      <a-tab-pane key="1" tab="申请记录"></a-tab-pane>
      <a-tab-pane key="2" tab="报名记录"></a-tab-pane>
      <a-tab-pane key="3" tab="草稿箱"></a-tab-pane>
    </a-tabs>

    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="item"
          v-if="state.activeKey !== '3'"
          v-for="item in state.data"
          :key="item?.id"
          @click="onClickItem(item)"
        >
          <div class="item_title">{{ item?.title }}</div>
          <div
            class="rigthBadge basicsBadge"
            :class="{
              status_not_started: item?.status_name === '未开始',
              status_in_registration: item?.status_name === '报名中',
              status_in_progress: item?.status_name === '进行中',
              status_end: item?.status_name === '已结束',
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
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<style lang="less" scoped>
.activityRecord {
  height: 100%;
  overflow: auto;
  background-color: #fafafa;

  .top_tabs {
    background-color: #fff;
    padding-left: 10px !important;
    padding-bottom: 0px !important;
  }
  .item {
    border-radius: 10px;
    background: #fff;
    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    position: relative;

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
  }
}
:deep(.ant-tabs-nav) {
  margin-bottom: 0px !important;
}
:deep(.van-pull-refresh) {
  height: 50% !important;
}
</style>
