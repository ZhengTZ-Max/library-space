<route>
    {
      meta: {
        showHead: true,
        showLeftBack:true,
        title:'Bookcase_Appointment_Record',
        showTabbar:false
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const state = reactive({
  activeKey: "1",
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],

  quickMode: 1,
  quickModeList: [
    { value: 1, label: "预约记录" },
    { value: 2, label: "违约记录" },
  ],
  status_name: "预约成功",


  refreshing: false,
  loading: false,
  finished: true,
});

const onChangeTab = (key) => {
  state.activeKey = key;
  state.currentPage = 1;
  fetchGetBookLocker();
};

const onChangeQMode = (row) => {
  state.quickMode = row?.value;
  state.currentPage = 1;
  fetchGetBookLocker();
};

const fetchGetBookLocker = async () => {
  try {
    let params = {
      tab: state.activeKey,
      page: state.currentPage,
      type: state.quickMode,

      limit: state.pageSize,
    };
    // const res = await getBookLocker();

    state.loading = false;
    state.refreshing = false;

    state.total = 0;
    state.data = [];
    state.finished = true;
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
    console.log(error);
  }
};

onMounted(() => {
    fetchGetBookLocker();
});

const onRefresh = () => {
  state.currentPage = 1;
  fetchGetBookLocker();
};
const onLoad = () => {
  state.currentPage++;
  fetchGetBookLocker();
};

const onClickItem = (id) => {
  router.push({
    path: "/mo/profile/book-locker-details",
    query: { id },
  });
};
</script>
<template>
  <div class="book-locker">
    <a-tabs
      v-model:activeKey="state.activeKey"
      class="top_tabs"
      size="middle"
      @change="onChangeTab"
    >
      <a-tab-pane key="1" tab="日柜"></a-tab-pane>
      <a-tab-pane key="2" tab="周柜"></a-tab-pane>
      <a-tab-pane key="3" tab="长期柜"></a-tab-pane>
    </a-tabs>
    <div class="quickBtns" style="width: 220px; margin: 10px 10px">
      <div
        v-for="item in state.quickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        @click="onChangeQMode(item)"
      >
        {{ item?.label }}
      </div>
    </div>

    <div class="item_list">
      <div class="info_item margin_bottom" @click="onClickItem('1')">
        <img
          src="@/assets/my/mobile_lostAndFound_item_location.svg"
          alt="Location"
        />
        <span>失物招领</span>
      </div>
      <div class="info_item">
        <img src="@/assets/event/time.svg" alt="Time" />
        <span>2024-02-05 09:57:00 2024-02-05 09:57:00 2024-02-05 09:57:00</span>

        <div>
          <a-button type="primary" shape="round" size="small" block>取消</a-button>
        </div>
      </div>

      <div
        class="rightBadge basicsBadge"
        :class="{
          status_success: state.status_name === '预约成功',
          status_cancel: state.status_name === '已取消',
          status_in_progress: state.status_name === '使用中',
          status_end: state.status_name === '已结束',
        }"
      >
        {{ state.status_name }}
      </div>
    </div>
    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      ></van-list>
    </van-pull-refresh>
  </div>
</template>
<style lang="less" scoped>
.book-locker {
  height: 100%;
  overflow: auto;
  background-color: #fafafa;

  .top_tabs {
    background-color: #fff;
    padding-left: 10px !important;
  }
  .item_list {
    position: relative;
    margin: 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    .info_item {
      display: flex;
      align-items: flex-start;

      img {
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
      span {
        flex: 8;
        flex-wrap: wrap;
        font-size: 13px;
        color: rgba(32, 32, 32, 1);
      }
      div {
        align-self: flex-end;

        flex: 2;
      }
    }
    .margin_bottom {
      margin-bottom: 16px;
    }
    .rightBadge {
      position: absolute;
      right: 0;
      top: 0;
    }
    .basicsBadge {
      padding: 3px 8px;
      border-radius: 0px 6px 0px 6px;
      font-size: 10px;
    }
    .status_success {
      background: rgba(238, 250, 239, 1);
      color: rgba(78, 201, 91, 1);
    }
    .status_cancel .status_end {
      background: rgba(243, 243, 243, 1);
      color: rgba(174, 174, 174, 1);
    }
    .status_in_progress {
      background: rgba(233, 239, 252, 1);
      color: rgba(31, 86, 225, 1);
    }
  }
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0px !important;
}
:deep(.van-pull-refresh) {
  height: 50% !important;
}
:deep(.ant-btn-sm) {
  font-size: 12px !important;
}
</style>
