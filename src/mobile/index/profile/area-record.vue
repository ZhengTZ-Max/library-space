<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Space_Reservation_Record',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import { getAreaRecordList, getRenegesRecordList } from "@/request/area-record";
import PageSizeCom from "@/components/PageSizeCom.vue";
import MyAreaRecordDetails from "@/mobile/index/profile/area-record-details.vue";
import { getUserInfo } from "@/utils";

const router = useRouter();
const state = reactive({
  activeKey: "1",
  UserInfo: getUserInfo(),
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
  fetch();
  console.log(key);
};

const onChangeQMode = (row) => {
  state.quickMode = row?.value;
  state.currentPage = 1;
  fetch();
};

onMounted(() => {
  fetch();
});

const fetch = () => {
  if (state.quickMode === 1) {
    // 预约记录
    fetchAreaRecordList();
  } else if (state.quickMode === 2) {
    // 违约记录
    fetchRenegesRecordList();
  }
};

const fetchAreaRecordList = async () => {
  try {
    let params = {
      type: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getAreaRecordList(params);
    state.loading = false;
    state.refreshing = false;

    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total;
    }
    state.finished = res?.data?.current_page >= res?.data?.last_page || true;
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    console.log(error);
  }
};

const fetchRenegesRecordList = async () => {
  try {
    let params = {
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getRenegesRecordList(params);
    state.loading = false;
    state.refreshing = false;
    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total;
    }
    state.finished = res?.data?.current_page >= res?.data?.last_page || true;
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    console.log(error);
  }
};

const onRefresh = () => {
  state.currentPage = 1;
  fetch();
};
const onLoad = () => {
  state.currentPage++;
  fetch();
};

const onClickItem = (item) => {
  state.showItemDetails = true;

  state.itemDetails = item;
  console.log(state.itemDetails);
};
</script>
<template>
  <div class="area-record">
    <a-tabs
      v-model:activeKey="state.activeKey"
      class="top_tabs"
      size="middle"
      @change="onChangeTab"
    >
      <a-tab-pane key="1" tab="普通空间"></a-tab-pane>
      <a-tab-pane key="2" tab="大型空间"></a-tab-pane>
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

    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="item in state.data"
          :key="item?.id"
          class="item_list"
          @click="onClickItem(item)"
        >
          <div class="info_item margin_bottom">
            <img src="@/assets/event/seat.svg" alt="Location" />
            <span>{{ item.nameMerge }}</span>
          </div>
          <div class="info_item">
            <img src="@/assets/event/time.svg" alt="Time" />
            <span>{{ item.begin_time }}</span>

            <div v-if="item.status_name === '预约成功'">
              <a-button type="primary" shape="round" size="small" block
                >取消</a-button
              >
            </div>
          </div>

          <div
            class="rightBadge basicsBadge"
            :class="{
              status_success: item.status_name === '预约成功',
              status_cancel: item.status_name === '已取消',
              status_in_progress: item.status_name === '使用中',
              status_end: item.status_name === '已结束',
              status_waitting: item.status_name === '预约待审核',
              status_closed: item.status_name === '已关闭',
            }"
          >
            {{ item.status_name }}
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <a-drawer
      width="100%"
      height="100%"
      placement="bottom"
      :closable="false"
      :open="state.showItemDetails"
      destroyOnClose
    >
      <div class="libraryPop">
        <MyAreaRecordDetails :data="state.itemDetails" />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.showItemDetails = false"
          >
            <!-- <img src="@/assets/seat/moBackBtn.svg" alt="" /> -->
            确定
          </van-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
.area-record {
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
    .status_cancel,
    .status_end,
    .status_closed {
      background: rgba(243, 243, 243, 1);
      color: rgba(174, 174, 174, 1);
    }
    .status_in_progress {
      background: rgba(233, 239, 252, 1);
      color: rgba(31, 86, 225, 1);
    }
    .status_waitting {
      background: rgba(255, 245, 230, 1);
      color: rgba(255, 128, 0, 1);
    }
  }
}

.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  :deep(.area-record-details) {
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

:deep(.ant-tabs-nav) {
  margin-bottom: 0px !important;
}
:deep(.van-pull-refresh) {
  height: 100% !important;
}
:deep(.ant-btn-sm) {
  font-size: 12px !important;
}
</style>
