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
import { reactive, onMounted, watch, ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import { exchangeDateTime } from "@/utils";

import {
  getSpaceSelectList,
  getSpaceFilterList,
  getSpaceInfoList,
  getSpaceDetail,
  getSpaceApply,
} from "@/request/space";

import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceChooseSpaceFilter from "@/components/SpaceCom/SpaceChooseSpaceFilter.vue";
// 声明 refs 对象
const refs = ref({});
const router = useRouter();
const route = useRoute();
const state = reactive({
  spaceInfo: {},
  spaceInfoShow: false,
  filterShow: false,
  refreshing: false,
  loading: false,
  finished: true,

  quickDate: route?.query?.date || moment().format("YYYY-MM-DD"),
  quickDateList: [],
  filterOptions: {},
  filterSearch: {
    library: [],
    floor: [],
    category: [],
    date: "",
    time: "",
    num: 0,
    boutique: [],
  },

  searchValue: "",
  spaceInfoList: [],

  initQuery: {
    libraryId: route?.query?.id || "",
    quickDate: route?.query?.date || moment().format("YYYY-MM-DD"),
    floorId: route?.query?.floor || "",
    categoryType: route?.query?.categoryType || "",
  },
});

onMounted(() => {
  initQuickDateList();

  fetchGetSpaceSelectList();
  fetchGetSpaceFilterList();
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

    initQueryFn();
    fetchGetSpaceInfoList();
  } catch (error) {
    state.filterOptions = {};
    console.log(error);
  }
};

const initQueryFn = () => {
  let { libraryId, quickDate, floorId, categoryType } = state.initQuery;

  let floorSelect = [];

  state.filterSearch.library = (libraryId && [libraryId]) || [];
  state.filterSearch.date = quickDate;
  state.filterSearch.category = (categoryType && [categoryType]) || [];

  state.filterOptions?.storey?.map((e) => {
    if (e?.list?.find((f) => f?.id == floorId)) {
      floorSelect.push(e);
    }
  });
  console.log("floorSelect", floorSelect);
  state.filterSearch.floor = floorSelect?.map((e) => e.name);

  state.filterSearch.time = [
    state.filterOptions.time?.start_num,
    state.filterOptions.time?.end_num,
  ];
  console.log("state", state.filterSearch);
};

const filterFloorIds = (ids) => {
  try {
    let list = state.filterOptions?.storey;
    let library = state.filterSearch.library;
    let floorIds = [];
    list = list?.filter((e) => {
      return ids?.includes(e?.name);
    });

    list.map((e) => {
      let floorList = e?.list;
      floorList?.map((fl) => {
        if (library?.includes(fl?.parentId)) floorIds.push(fl?.id);
      });
    });

    return floorIds || [];
  } catch (e) {
    console.log(e);
  }
};
const fetchGetSpaceInfoList = async () => {
  try {
    let { search, library, floor, date, boutique, category, time } =
      state.filterSearch;

    let params = {
      premises: library,
      members: state.filterSearch.num,
      date,
      floor: filterFloorIds(floor),
      category: category,
      boutique: boutique,
    };

    if (!params.members) {
      params.members = "";
    }

    if (time?.length) {
      if (
        time[0] == state.filterOptions?.time?.start_num &&
        time[1] == state.filterOptions?.time?.end_num
      ) {
        params.start_time = "";
        params.end_time = "";
      } else {
        params.start_time = convertMinutesToHHMM(time[0]);
        params.end_time = convertMinutesToHHMM(time[1]);
      }
    }

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
    query: { id, date: state.quickDate },
  });
};

const handleFilter = () => {
  state.quickDate = state.filterSearch?.date;
  state.filterShow = false;
  fetchGetSpaceInfoList();
};

const handleDateChange = (v) => {
  state.quickDate = v;
  state.filterSearch.date = v;
  console.log(state.quickDate);
  fetchGetSpaceInfoList();
};

const getItemTime = (item) => {
  let startTimeNum = exchangeDateTime(item?.start_timestamp, 8)
    .split(":")
    .map(Number)[0];
  let itemTime = [];
  let endTimeNum = exchangeDateTime(item?.end_timestamp, 8)
    .split(":")
    .map(Number)[0];
  for (let i = startTimeNum; i <= endTimeNum; i++) {
    itemTime.push({
      timeNum: i,
      timeType: "unAll",
    });
  }
  itemTime[1].timeType = "all";
  itemTime[2].timeType = "am";
  itemTime[3].timeType = "pm";
  return itemTime;
};
</script>
<template>
  <div class="space_space_mobile">
    <div class="header">
      <div class="select_radius">
        <a-select
          v-model:value="state.quickDate"
          @change="handleDateChange"
          :placeholder="$t('visitor_Select_Date')"
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
          :placeholder="$t('V4_name_number_of_participants')"
          style="width: 150px"
        />
      </div>
      <div @click="state.filterShow = true">
        <img src="@/assets/event/mobile_event_filter.svg" alt="filter" />
      </div>
    </div>

    <div class="refreshCon">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-if="state.spaceInfoList?.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="$t('No_more')"
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

                <a-flex class="vertical_scroll">
                  <div
                    class="boutiqueList"
                    v-for="bout in item?.boutiques"
                    :key="bout?.id"
                  >
                    {{ bout.name }}
                  </div>
                </a-flex>
                <div class="num">
                  <span>{{ $t("Capacity_Capacity") }}</span>
                  <span
                    >{{ item?.minPerson }}
                    <span v-if="item?.minPerson != item?.maxPerson"
                      >~ {{ item?.maxPerson }} </span
                    >人</span
                  >
                </div>

                <div class="action">
                  <span @click="handleShowInfo(item)">{{ $t("V4_view_details") }} ></span>

                  <van-button
                    plain
                    type="primary"
                    color="#1a49c0"
                    round
                    size="mini"
                    style="padding: 4px 15px; font-size: 12px"
                    @click="onApply(item?.id)"
                    >{{ $t("V4_apply") }}</van-button
                  >
                </div>
              </van-col>
            </van-row>
            <div>
              <div class="timeStatus">
                <span class="allCir"></span>
                <span class="timeStatusText">{{ $t("V4_already_occupied") }}</span>
                <span class="unAllCir" style="margin-left: 30px"></span>
                <span class="timeStatusText">{{ $t("V4_available_reservation_slots") }}</span>
              </div>
              <a-flex
                gap="10px"
                class="vertical_scroll_time"
                justify="space-between"
              >
                <template
                  v-for="item_ in getItemTime(item)"
                  :key="item_?.timeNum"
                >
                  <div style="padding-right: 4px">
                    <a-flex vertical align="center">
                      <!-- 此处还要根据后端返回每条数据里的 data 在判断上午还是下午 -->
                      <span
                        :class="
                          item_?.timeType == 'all'
                            ? 'itemAll'
                            : item_?.timeType == 'unAll'
                            ? 'itemUnAll'
                            : item_?.timeType == 'am'
                            ? 'itemAm'
                            : 'itemPm'
                        "
                      ></span>
                      <span>{{ item_?.timeNum }}</span>
                    </a-flex>
                  </div>
                </template>
              </a-flex>
            </div>
          </div>
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>

    <van-popup
      v-model:show="state.spaceInfoShow"
      position="bottom"
      :style="{ height: '100%' }"
      destroy-on-close
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
            {{ $t("Return") }}
          </van-button>
          <van-button
            round
            block
            type="primary"
            @click="onApply(state.spaceInfo?.id)"
            >{{ $t("V4_apply") }}</van-button
          >
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model:show="state.filterShow"
      position="bottom"
      :style="{ height: '70%' }"
      destroy-on-close
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
            {{ $t("cancel") }}
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >{{ $t("visitor_Confirm") }}</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.space_space_mobile {
  height: 100%;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
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
      .vertical_scroll {
        overflow-x: auto;
        white-space: nowrap;
        margin-top: 10px;
        /* 设置滚动条样式 */
        &::-webkit-scrollbar {
          height: 4px; /* 设置滚动条的高度 */
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(97, 97, 97, 0.05); /* 设置滚动条的颜色 */
          border-radius: 10px; /* 设置滚动条的圆角 */
        }

        &::-webkit-scrollbar-track {
          background: transparent; /* 设置滚动条轨道的颜色 */
        }

        /* Firefox 的滚动条样式 */
        scrollbar-width: thin; /* 滚动条的宽度 */
        scrollbar-color: rgba(97, 97, 97, 0.05) transparent; /* 滚动条的颜色和轨道的颜色 */
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

    .timeStatus {
      display: flex;
      align-items: center;

      .allCir {
        display: inline-block;
        width: 12px;
        height: 3px;
        background-color: rgba(111, 111, 111, 1);
      }
      .unAllCir {
        display: inline-block;
        width: 12px;
        height: 3px;
        background-color: rgba(224, 224, 224, 1);
      }
      .timeStatusText {
        margin-left: 6px;
        font-size: 10px;
        color: rgba(97, 97, 97, 1);
      }
    }
    .vertical_scroll_time {
      margin-top: 10px;
      overflow-x: auto;
      white-space: nowrap;

      /* 设置滚动条样式 */
      &::-webkit-scrollbar {
        height: 4px; /* 设置滚动条的高度 */
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(97, 97, 97, 0.05); /* 设置滚动条的颜色 */
        border-radius: 10px; /* 设置滚动条的圆角 */
      }

      &::-webkit-scrollbar-track {
        background: transparent; /* 设置滚动条轨道的颜色 */
      }

      /* Firefox 的滚动条样式 */
      scrollbar-width: thin; /* 滚动条的宽度 */
      scrollbar-color: rgba(97, 97, 97, 0.05) transparent; /* 滚动条的颜色和轨道的颜色 */
    }
    .itemAll {
      display: inline-block;
      width: 12px;
      height: 3px;
      background-color: rgba(111, 111, 111, 1);
    }
    .itemUnAll {
      display: inline-block;
      width: 12px;
      height: 3px;
      background-color: rgba(224, 224, 224, 1);
    }
    .itemAm {
      display: flex;
      width: 12px;
      height: 3px;
    }
    .itemAm::before {
      content: "";
      flex: 1;
      background-color: rgba(111, 111, 111, 1);
    }
    .itemAm::after {
      content: "";
      flex: 1;
      background-color: rgba(224, 224, 224, 1);
    }

    .itemPm {
      display: flex;
      width: 12px;
      height: 3px;
    }
    .itemPm::before {
      content: "";
      flex: 1;
      background-color: rgba(224, 224, 224, 1);
    }
    .itemPm::after {
      content: "";
      flex: 1;
      background-color: rgba(111, 111, 111, 1);
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
.refreshCon {
  margin-top: 60px;
  flex: 1;
  .van-pull-refresh {
    height: 100%;
  }
}
</style>
