<route>
    {
      meta: {
        showHead: true,
        showLeftBack:true,
        title:'Space_Reservation_Record',
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
    { value: 3, label: "权限查询" },
  ],
  status_name: "预约成功",

  refreshing: false,
  loading: false,
  finished: true,

  filterRows: {
    premiseID: "",
    categoryID: "",
    areaID: "",
  },
  filterOptions: {
    premise: [{ id: 1, name: "图书馆" }, { id: 2, name: "基础馆" }],
    category: [{ id: 1, name: "1楼" }, { id: 2, name: "2楼" }],
    area: [{ id: 1, name: "1区" }, { id: 2, name: "2区" }],
  },
});

const onChangeTab = (key) => {
  state.activeKey = key;
  state.currentPage = 1;
  fetchGetSeatRecord();
};

const onChangeQMode = (row) => {
  if (state.activeKey == "1") {
    // 普通座位 下 不能点击 权限查询
    if (row?.value == "3") return;
  }
  state.quickMode = row?.value;
};

const fetchGetSeatRecord = async () => {
  try {
    let params = {
      tab: state.activeKey,
      page: state.currentPage,
      type: state.quickMode,

      limit: state.pageSize,
    };
    // const res = await getSeatRecord();

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
  fetchGetSeatRecord();
});

const onRefresh = () => {
  state.currentPage = 1;
  fetchGetSeatRecord();
};
const onLoad = () => {
  state.currentPage++;
  fetchGetSeatRecord();
};

const onClickItem = (id) => {
  // router.push({
  //   path: "/mo/profile/area-record-details",
  //   query: { id },
  // });
};

const fetchQuery = () => {
  console.log(state.filterRows);
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
      <a-tab-pane key="1" tab="普通座位"></a-tab-pane>
      <a-tab-pane key="2" tab="考研座位"></a-tab-pane>
      <a-tab-pane key="3" tab="研习座位"></a-tab-pane>
    </a-tabs>
    <div class="quickBtns" style="width: 270px; margin: 10px 10px">
      <div
        v-for="item in state.quickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        style="font-size: 14px"
        @click="onChangeQMode(item)"
      >
        {{ item?.label }}
      </div>
    </div>

    <div v-if="state.quickMode != 3" class="item_list">
      <div class="info_item margin_bottom" @click="onClickItem('1')">
        <img src="@/assets/my/mobile_seat_record_seat.svg" alt="Location" />
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
    <van-pull-refresh
      v-if="state.quickMode != 3"
      v-model="state.refreshing"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      ></van-list>
    </van-pull-refresh>

    <div v-if="state.quickMode == 3" class="query_result">
      <div class="query_result_info">
        <div class="query_result_info_item">
          查询结果<span class="span_gray">(请点击查询)</span>
          <div class="margin10 query_result_info_item_text">
            本期(2024-01-22至2024-01-28)预约权限:<span>100</span>
          </div>
          <div class="query_result_info_item_text">
            下期(2024-01-22至2024-01-28)预约权限:<span>100</span>
          </div>
        </div>

        <div class="filterCon">
          <div class="filterScr">
            <div class="filterFilter">馆舍</div>
            <div class="fiterItem">
              <a-radio-group v-model:value="state.filterRows.premiseID">
                <a-radio
                  v-for="item in state.filterOptions?.premise"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
            <div class="filterFilter">楼层</div>
            <div class="fiterItem">
              <a-radio-group v-model:value="state.filterRows.categoryID">
                <a-radio
                  v-for="item in state.filterOptions?.category"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
            <div class="filterFilter">区域</div>
            <div class="fiterItem">
              <a-radio-group v-model:value="state.filterRows.areaID">
                <a-radio
                  v-for="item in state.filterOptions?.area"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div style="margin: 10px">
        <a-button type="primary" shape="round" block @click="fetchQuery"
          >立即查询</a-button
        >
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.area-record {
  height: 100%;
  background-color: #fafafa;
  overflow: hidden;
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
  .query_result {
    margin-top: 20px;
    height: 80vh;


    display: flex;
    flex-direction: column;
    .query_result_info {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 10px;
      .query_result_info_item {
        padding: 10px;
        background-color: #fff;
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        padding-left: 20px;
        .margin10 {
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .query_result_info_item_text {
          color: rgba(97, 97, 97, 1);
          font-size: 13px;
        }

        .span_gray {
          color: rgba(160, 160, 160, 1);
          font-size: 14px;
        }
      }
      .filterCon {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: #fff;
        .filterScr {
          flex: 1;
          overflow-y: auto;
        }
        .filterFilter {
          margin-bottom: 24px;
          background: rgba(97, 97, 97, 0.05);
          border-radius: 0px 0px 0px 0px;
          padding: 2px 10px;
          color: rgba(97, 97, 97, 1);
        }
        .fiterItem {
          user-select: none;
          padding: 0 20px;
          margin-bottom: 20px;
          // &:last-child {
          //   margin-bottom: 0;
          // }
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
:deep(.ant-btn-sm) {
  font-size: 12px !important;
}
</style>
