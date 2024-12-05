<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Facility_Selection',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import {
  getSpaceSelectList,
  getSpaceFilterList,
  getSpaceInfoList,
  getSpaceDetail,
  getSpaceApply,
} from "@/request/space";

import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceChooseSpaceFilter from "@/components/SpaceCom/SpaceChooseSpaceFilter.vue";

const router = useRouter();
const state = reactive({
  spaceInfo: {},
  spaceInfoShow: false,
  filterShow: false,
  refreshing: false,
  loading: false,
  finished: true,

  quickDate: moment().format("YYYY-MM-DD"),
  quickDateList: [],
  filterOptions: {},
  filterSearch: {
    premiseID: "",
    floorID: "",
    categoryID: "",
    date: "",
    time: "",
    num: "",
    boutiqueID: "",
  },

  searchValue: "",
  spaceInfoList: [],
});

onMounted(() => {
  initQuickDateList();

  fetchGetSpaceSelectList();
  fetchGetSpaceFilterList();
  fetchGetSpaceInfoList();
});

const initQuickDateList = () => {
  const formattedDate = moment().format("MM-DD");
  state.quickDateList = [
    { label: `${formattedDate} 今天`, value: moment().format("YYYY-MM-DD") },
  ];
};

const onRefresh = () => {
  fetchGetSpaceInfoList();
};
const onLoad = () => {
  //   fetchGetSpaceInfoList();
};

const handleShowInfo = (item) => {
  fetchInfo(item.id);
};

const fetchGetSpaceSelectList = async () => {
  try {
    let res = await getSpaceSelectList();
    if (res.code != 0) {
      state.quickDateList = [];
      return;
    }

    const today = moment().format("YYYY-MM-DD");
    state.quickDateList =
      res?.data.map((date) => {
        // 格式化为 MM-DD
        const formattedDate = moment(date).format("MM-DD");
        // 判断是否为今天
        // return {
        //   value: date === today ? `${formattedDate} 今天` : formattedDate,
        // };
        return {
          value: date,
          label: date === today ? `${formattedDate} 今天` : formattedDate,
        };
      }) || [];

    console.log(state.quickDateList);
  } catch (error) {
    state.quickDateList = [];
    console.log(error);
  }
};

const fetchGetSpaceFilterList = async () => {
  try {
    let res = await getSpaceFilterList();
    if (res.code != 0) {
      state.filterOptions = {};
      return;
    }
    state.filterOptions = res?.data || {};
  } catch (error) {
    state.filterOptions = {};
    console.log(error);
  }
};

const fetchGetSpaceInfoList = async () => {
  try {
    let params = {
      premiseID: state.filterSearch.premiseID,
      members: state.filterSearch.num,
      date: state.quickDate,
      floorID: state.filterSearch.floorID,
      categoryID: state.filterSearch.categoryID,
      boutiqueID: state.filterSearch.boutiqueID,
    };
    let res = await getSpaceInfoList(params);

    state.refreshing = false;
    state.loading = false;
    state.finished = true;

    if (res.code != 0) {
      state.spaceInfoList = [];
      return;
    }
    state.spaceInfoList = res?.data?.data || [];
  } catch (error) {
    state.spaceInfoList = [];
    state.refreshing = false;
    state.loading = false;
    state.finished = true;
    console.log(error);
  }
};
const fetchInfo = async (id) => {
  try {
    let res = await getSpaceDetail({ id });
    if (res.code != 0) {
      state.spaceInfo = {};
      return;
    }
    state.spaceInfo = { ...res?.data, type: "space" } || {};
    state.spaceInfoShow = true;
  } catch (error) {
    state.spaceInfo = {};
    console.log(error);
  }
};

const onApply = (id) => {
  state.spaceInfoShow = false;
  router.push({
    path: "/mo/space/apply",
    query: { id },
  });
};

const handleFilter = () => {
  state.filterShow = false;
  //   fetchGetSpaceInfoList();
};

const handleDateChange = (v) => {
  state.quickDate = v;
  console.log(state.quickDate);
  //   fetchGetSpaceInfoList();
};
</script>
<template>
  <div class="space_space_mobile">
    <div class="header">
      <div class="select_radius">
        <a-select
          v-model:value="state.quickDate"
          @change="handleDateChange"
          placeholder="选择日期"
        >
          <template v-for="item in state.quickDateList" :key="index">
            <a-select-option :value="item?.value">{{
              item?.label
            }}</a-select-option>
          </template>
        </a-select>
      </div>
      <div class="select_radius marginLeftAndRight">
        <a-input
          :bordered="false"
          v-model:value="state.searchValue"
          placeholder="名称/人数"
          style="width: 150px"
        />
      </div>
      <div @click="state.filterShow = true">
        <img src="@/assets/event/mobile_event_filter.svg" alt="filter" />
      </div>
    </div>

    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="item in state.spaceInfoList" :key="item?.id" class="item">
          <van-row>
            <van-col span="9" class="img_col">
              <a-image
                style="width: 100px; height: 100px; border-radius: 10px"
                :src="item?.firstimg"
                :preview="false"
              />
              <div class="basicsBadge" :class="{ greenBadge: false }">
                {{ item?.top_name }}
              </div>
              <div class="posBot">
                <!-- - {{ filterCategorys(item?.categorys) }} - -->
                <span>- {{ item?.type_name }} -</span>
              </div>
            </van-col>
            <van-col span="15" class="right_info">
              <div class="title">
                <span>{{ item?.name }}</span>
                <span>{{ item?.storey_name }}</span>
              </div>

              <div class="boutique">
                <div
                  class="boutiqueList"
                  v-for="bout in item?.boutiques"
                  :key="bout?.id"
                >
                  {{ bout.name }}
                </div>
              </div>
              <div class="num">
                <span>可容纳人数</span>
                <span>{{ item?.minPerson }} ~ {{ item?.maxPerson }} 人</span>
              </div>

              <div class="action">
                <span @click="handleShowInfo(item)">查看详情 ></span>

                <van-button
                  plain
                  type="primary"
                  color="#1a49c0"
                  round
                  size="mini"
                  style="padding: 4px 15px; font-size: 12px"
                  @click="onApply(item?.id)"
                  >申请</van-button
                >
              </div>
            </van-col>
          </van-row>
        </div>
      </van-list>
    </van-pull-refresh>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="100%"
      placement="bottom"
      :open="state.spaceInfoShow"
      @close="state.spaceInfoShow = false"
      :closable="false"
    >
      <div class="libraryPop">
        <LibraryInfo v-if="state.spaceInfo?.id" :data="state.spaceInfo" />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.spaceInfoShow = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            返回
          </van-button>
          <van-button
            round
            block
            type="primary"
            @click="onApply(state.spaceInfo?.id)"
            >申请</van-button
          >
        </div>
      </div>
    </a-drawer>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="70%"
      placement="bottom"
      :open="state.filterShow"
      @close="state.filterShow = false"
      :closable="false"
    >
      <div class="drawerCon">
        <SpaceChooseSpaceFilter
          style="flex: 1"
          v-if="state.filterOptions?.premises?.length"
          :data="state.filterOptions"
          :initSearch="state.filterSearch"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.filterShow = false"
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
.space_space_mobile {
  height: 100%;
  background-color: #fafafa;
  overflow-y: auto;
  overflow-x: hidden;

  .header {
    background-color: #fff;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .marginLeftAndRight {
      margin-left: 10px;
      margin-right: 10px;
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
            color: #000;
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
    margin-left: 16px;
    margin-right: 16px;
    background-color: #fff;
    padding: 16px;
    margin-top: 10px;
    border-radius: 10px;
    .img_col {
      height: 100px;
      position: relative;
      .basicsBadge {
        position: absolute;
        top: 0;
        left: 0;
        padding: 3px 8px;
        background: #1a49c0;
        border-radius: 6px 0px 6px 0px;
        font-size: 12px;
        color: #ffffff;
      }

      .posBot {
        position: absolute;
        bottom: 10px;
        left: 0;
        display: flex;
        width: 90%;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 1);
        // color: #000;
        font-size: 12px;
      }
    }
    .right_info {
      padding: 0 0 5px 0;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #616161;
        span {
          &:nth-child(1) {
            font-size: 14px;
            color: #202020;
          }
        }
      }
      .num {
        font-size: 12px;
        color: rgba(97, 97, 97, 1);
        display: flex;
        align-items: center;
        span {
          &:nth-child(2) {
            font-size: 14px;
            color: rgba(32, 32, 32, 1);
          }
        }
      }
      .boutique {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        .boutiqueList {
          border: 1px solid #f28800;
          font-size: 10px;
          color: rgba(242, 136, 0, 1);
          padding: 1px 4px;
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
      .action {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 12px;
          color: rgba(134, 134, 134, 1);
        }
      }
    }
  }
  .filterDrawer {
    padding: 22px;
  }
}
.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  :deep(.libraryInfo) {
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
// :deep(.van-pull-refresh) {
//   height: 50% !important;
// }
</style>
