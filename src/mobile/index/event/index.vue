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
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { exchangeDateTime } from "@/utils";
import { getCurrentEventList, getEventFilterIndex } from "@/request/event";
import EventFilter from "@/components/EventFilterCom.vue";

const router = useRouter();
const state = reactive({
  eventFilterShow: false,
  filterOptions: {},
  filterSearch: {
    premiseID: "",
    categoryID: "",
    date: "",
  },
  activeKey: "1",
  activeKeyList: [
    { value: "1", label: "当前活动" },
    { value: "0", label: "历史活动" },
  ],
  refreshing: false,
  loading: false,
  finished: true,
  date: moment().format("YYYY-MM-DD"),
  selectDate: null,
  selectType: "",
  selectDateList: [
    { value: "2024-01-02", label: "01-02" },
    { value: "2024-01-03", label: "01-03" },
    { value: "2024-01-04", label: "01-04" },
  ],
  eventList: [],
});

watch(
  () => state.activeKey,
  () => {
    state.currentPage = 1;
    fetchCurrentEventList();
  }
);

const onClickItem = (id) => {
  router.push({
    path: "/mo/event/details",
    query: { id },
  });
};

const handleFilter = () => {
  state.eventFilterShow = false;
  console.log(state.filterSearch);
  fetchCurrentEventList();
};

onMounted(() => {
  fetchGetEventIndex();
});
const onRefresh = () => {
  fetchCurrentEventList();
};
const onLoad = () => {
  fetchCurrentEventList();
};
const fetchGetEventIndex = async () => {
  try {
    let res = await getEventFilterIndex();
    state.filterOptions = res?.data;
    fetchCurrentEventList();
  } catch (e) {}
};
const fetchCurrentEventList = async () => {
  try {
    let params = {
      ilk: state.activeKey,
      date: state.date,
      premises: state.filterSearch.premiseID,
      category: state.filterSearch.categoryID,
    };
    let res = await getCurrentEventList(params);
    state.loading = false;
    state.refreshing = false;

    if (res.code == 0) {
      if (state.currentPage === 1) {
        state.eventList = res?.data?.data || [];
      } else {
        state.eventList.push(...res?.data?.data);
      }
      state.total = res?.data?.total;
      state.finished = res?.data?.current_page >= res?.data?.last_page || true;
    } else {
      state.eventList = [];
      state.total = 0;
      state.finished = true;
    }
  } catch (e) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.eventList = [];
    state.total = 0;
  }
};
</script>
<template>
  <div class="event">
    <div class="cHeader">
      <div class="quickMode">
        <div
          v-for="item in state.activeKeyList"
          :key="item.label"
          class="item_tab activeBtn"
          :class="{ itemActive: item?.value == state.activeKey }"
          @click="state.activeKey = item?.value"
        >
          {{ item?.label }}
        </div>
      </div>
    </div>
    <div class="right_filter" @click="state.eventFilterShow = true">
      <img src="@/assets/event/mobile_event_filter.svg" alt="filter" />
    </div>
    <div class="select_box">
      <div class="select_radius">
        <a-select v-model:value="state.selectDate" placeholder="选择日期">
          <template v-for="item in state.selectDateList" :key="item?.value">
            <a-select-option value="item?.value">{{
              item?.value
            }}</a-select-option>
          </template>
        </a-select>
      </div>
      <div class="select_radius marginLeft">
        <a-select v-model:value="state.selectDate" placeholder="名称/活动类型">
          <template v-for="item in state.selectDateList" :key="item?.value">
            <a-select-option value="item?.value">{{
              item?.value
            }}</a-select-option>
          </template>
        </a-select>
      </div>
    </div>

    <div class="refreshCon">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-if="state.eventList.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="item"
            v-for="item in state.eventList"
            :key="item?.id"
            @click="onClickItem(item?.id)"
          >
            <div class="item_title">{{ item?.title }}</div>
            <div
              class="leftBadge basicsBadge"
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
            <div class="item_img">
              <van-image
                :src="item?.poster[0]?.file_path"
                alt="Empty state illustration"
              />
              <div class="posBot">
                <span>- {{ item?.cate_name }} -</span>
              </div>
            </div>

            <div class="item_bottom">
              <div class="event-location">
                <img src="@/assets/event/seat.svg" alt="Location" />
                <span>{{ item?.nameMerge }}</span>
              </div>
              <div class="event-time">
                <img src="@/assets/event/time.svg" alt="Time" />
                <div class="timeList">
                  <span>{{ item?.show_time }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="70%"
      placement="bottom"
      :open="state.eventFilterShow"
      @close="state.eventFilterShow = false"
      :closable="false"
    >
      <div class="drawerCon">
        <EventFilter
          v-if="state.filterOptions?.premise?.length"
          :data="state.filterOptions"
          :initSearch="state.filterSearch"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.eventFilterShow = false"
          >
            取消
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >确认</van-button
          >
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
.event {
  height: 100%;
  background-color: #fafafa;

  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .top_tabs {
    background-color: #fff;
    padding-left: 10px !important;
    padding-bottom: 0px !important;
  }
  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
    background-color: #fff;
  }
  .quickMode {
    display: flex;
    gap: 20px;
    .item_tab {
      padding-bottom: 10px;
      font-size: 15px;
      color: #616161;

      &.itemActive {
        color: #202020;
        border-bottom: 2px solid #1a49c0;
      }
    }
  }

  .right_filter {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .select_box {
    padding: 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    .marginLeft {
      margin-left: 10px;
    }
    .select_radius {
      width: 180px;
      padding: 0px 9px;
      background: rgba(243, 239, 239, 0.2);
      border-radius: 21px;
      border: 1px solid #d9d9d9;
      :deep(.ant-select) {
        display: block;
        .ant-select-selector {
          background-color: transparent !important;
          border: none;
          .ant-select-selection-item {
            color: #fff;
            display: flex;
            align-items: center;
          }
        }
        .ant-select-arrow {
          color: #afaaaa;
        }
      }
    }
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
      margin-top: 20px;
      font-size: 14px;
      color: rgba(32, 32, 32, 1);
      margin-bottom: 12px;
    }
    .leftBadge {
      position: absolute;
      left: 0;
      top: 0;
    }
    .basicsBadge {
      padding: 3px 8px;
      border-radius: 6px 0px 6px 0px;
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

    .item_img {
      position: relative;

      .posBot {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 8px;
        color: #ffffff;
        font-size: 16px;
        width: 100%;
      }
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
  .filterDrawer {
    padding: 22px;
  }
}
.drawerCon {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bottomAct {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  & button {
    &:nth-child(1) {
      margin-right: 12px;
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
