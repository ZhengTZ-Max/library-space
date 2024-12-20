<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Bookcase_Appointment_Record',
        showTabbar:true
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
  activeKeyList: [
    { value: "1", label: "日柜" },
    { value: "2", label: "周柜" },
    { value: "3", label: "长期柜" },
  ],
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

watch(
  () => state.activeKey,
  () => {
    state.currentPage = 1;
    fetchGetBookLocker();
  }
);


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
          <a-button type="primary" shape="round" size="small" block
            >取消</a-button
          >
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
        v-if="state.data.length > 0"
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      ></van-list>
      <a-empty v-else />
    </van-pull-refresh>
  </div>
</template>
<style lang="less" scoped>
.book-locker {
  height: 100%;
  overflow: auto;
  background-color: #fafafa;

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
  height: 150% !important;
}
:deep(.ant-btn-sm) {
  font-size: 12px !important;
}
</style>
