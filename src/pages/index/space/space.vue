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

import { convertMinutesToHHMM, exchangeDateTime } from "@/utils";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();

const state = reactive({
  activeIndex: "",
  spaceInfo: {},
  spaceInfoShow: false,
  spaceInfoList: [],
  spaceFilterShow: false,

  boutiques: [{ name: "投影仪" }, { name: "WIFI" }],

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

  quickDate: route?.query?.date || "",
  quickDateList: [],

  initQuery: {
    libraryId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
    floorId: route?.query?.floor || "",
    categoryType: route?.query?.categoryType || "",
  },

  itemTime: [
    // {
    //   timeNum: 0,
    //   timeType: "all", // all 全天预约  unAll 非全天预约  am 上午预约  pm 下午预约
    // },
  ],
});

const goToLink = (link) => {
  router.replace(link);
};

onMounted(() => {
  fetchGetSpaceSelectList();
  fetchGetSpaceFilterList();
});

watch(
  () => state.filterSearch.num,
  (val) => {
    // fetchGetSpaceInfoList();
  }
);

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
        // return date === today ? `${formattedDate} 今天` : formattedDate;
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

    // if (library?.length) {
    //   params.premises = state.filterOptions?.library?.map((e) => e?.id);
    // }

    let res = await getSpaceInfoList(params);
    if (res.code != 0) {
      state.spaceInfoList = [];
      return;
    }
    state.spaceInfoList = res?.data?.data || [];
    if (state.spaceInfoList?.length) {
      state.activeIndex = state.spaceInfoList[0]?.id;
    }
  } catch (error) {
    state.spaceInfoList = [];
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
    console.log(state.spaceInfo);
  } catch (error) {
    state.spaceInfo = {};
    console.log(error);
  }
};

const onChangeAct = (i) => {
  if (i.id == state.activeIndex) return;
  state.activeIndex = i.id;
  dealWithTime(i);
};

const dealWithTime = (i) => {
  let startTimeNum = exchangeDateTime(i?.start_timestamp, 8)
    .split(":")
    .map(Number)[0];
  let endTimeNum = exchangeDateTime(i?.end_timestamp, 8)
    .split(":")
    .map(Number)[0];

  state.itemTime = [];
  // 先处理后端返回的时间，然后再根据具体占用的时间修改
  for (let i = startTimeNum; i <= endTimeNum; i++) {
    state.itemTime.push({
      timeNum: i,
      timeType: "unAll",
    });
  }
  state.itemTime[1].timeType = "all";
  state.itemTime[2].timeType = "am";
  state.itemTime[3].timeType = "pm";
  console.log(state.itemTime);
};

const filterCategorys = (list) => {
  let newList = list?.map((e) => e?.name);
  return newList?.join("/") || "";
};
const handleShowInfo = (item) => {
  fetchInfo(item.id);
};
const handleAppt = (row) => {
  router.push({
    path: "/space/apply",
    query: {
      id: row?.id,
    },
  });
  console.log(row);
};

const handleFilter = () => {
  fetchGetSpaceInfoList();
  state.quickDate = state.filterSearch?.date;
  state.spaceFilterShow = false;
};

const handleDateChange = (v) => {
  state.quickDate = v;
  console.log(state.quickDate);
  // fetchGetSpaceInfoList();
};
</script>
<template>
  <div class="space_chooseSpace">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/space')"
              >选择馆舍</a-breadcrumb-item
            >
            <a-breadcrumb-item>选择空间</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="select_radius">
            <a-select
              v-model:value="state.quickDate"
              @change="handleDateChange"
              placeholder="选择日期"
            >
              <template v-for="item in state.quickDateList" :key="item">
                <a-select-option :value="item?.value">{{
                  item?.label
                }}</a-select-option>
              </template>
            </a-select>
          </div>
          <div class="select_radius marginLeft">
            <a-input
              :bordered="false"
              v-model:value="state.searchValue"
              placeholder="名称/人数"
              style="width: 150px"
            />
          </div>

          <div class="filters activeBtn" @click="state.spaceFilterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            筛选
          </div>
        </div>
      </div>
    </a-affix>

    <div class="content">
      <a-row v-if="state.spaceInfoList?.length" :gutter="[40, 80]">
        <template v-for="item in state.spaceInfoList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
            <div
              class="libraryItem cardItem"
              :class="{ activeItem: item?.id == state.activeIndex }"
              @mousemove="onChangeAct(item)"
            >
              <div class="cardItemImgCon">
                <a-image
                  class="cardItemImg"
                  :src="item?.firstimg"
                  :preview="false"
                >
                  <template #placeholder>
                    <a-image
                      class="cardItemImg"
                      style="width: 100%; height: 100%"
                      :src="PlaceImg"
                      :preview="false"
                    />
                  </template>
                </a-image>
                <div class="leftBadge basicsBadge">{{ item?.top_name }}</div>
                <div
                  class="rightBadge viewMore clickBox"
                  @click.stop="handleShowInfo(item)"
                >
                  <span> 查看详情 </span>
                  <img src="@/assets/home/rightIconW.svg" alt="" />
                </div>
                <div class="posBot">
                  <span>- {{ item?.type_name }} -</span>
                </div>
              </div>
              <div class="bottomItem">
                <div class="title">
                  <span>{{ item?.name }}</span>
                  <span>{{ item?.storey_name }}</span>
                </div>
                <div class="num">
                  <span>可容纳人数</span>
                  <span
                    >{{ item?.minPerson }}
                    <span v-if="item?.minPerson != item?.maxPerson"
                      >~ {{ item?.maxPerson }}</span
                    >人</span
                  >
                </div>
                <div class="boutique">
                  <div class="boutiqueList" v-for="bout in item?.boutiques">
                    {{ bout.name }}
                  </div>
                </div>
              </div>
              <!-- 显示当前空间占用的时间 -->
              <div v-if="item?.id == state.activeIndex">
                <!-- 示例 -->
                <div class="timeStatus">
                  <span class="allCir"></span>
                  <span class="timeStatusText">已被占用</span>
                  <span class="unAllCir" style="margin-left: 30px"></span>
                  <span class="timeStatusText">可预约时段</span>
                </div>

                <a-flex wrap="wrap" gap="10px" style="margin-top: 10px">
                  <template v-for="item in state.itemTime" :key="item">
                    <div style="padding-right: 4px;">
                      <a-flex vertical align="center">
                        <!-- 此处还要根据后端返回每条数据里的 data 在判断上午还是下午 -->
                        <span
                          :class="
                            item?.timeType == 'all'
                              ? 'itemAll'
                              : item?.timeType == 'unAll'
                              ? 'itemUnAll'
                              : item?.timeType == 'am'
                              ? 'itemAm'
                              : 'itemPm'
                          "
                        ></span>
                        <span>{{ item?.timeNum }}</span>
                      </a-flex>
                    </div>
                  </template>
                </a-flex>
              </div>
              <div
                v-if="item?.id == state.activeIndex"
                class="action clickBoxT"
                @click="handleAppt(item)"
              >
                立即预约
              </div>
            </div>
          </a-col>
        </template>
      </a-row>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.spaceInfoShow"
      title="空间详情"
      @ok="handleAppt(state.spaceInfo)"
      destroyOnClose
      okText="预约"
      cancelText="关闭"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <LibraryInfo v-if="state.spaceInfo?.id" :data="state.spaceInfo" />
    </a-modal>

    <a-modal
      width="50%"
      v-model:open="state.spaceFilterShow"
      title="空间筛选"
      @ok="handleFilter"
      destroyOnClose
      okText="确认"
      cancelText="取消"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <SpaceChooseSpaceFilter
        v-if="state.filterOptions?.premises?.length"
        :data="state.filterOptions"
        :initSearch="state.filterSearch"
      />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.space_chooseSpace {
  height: 100%;
  background-color: #fff;
  overflow: auto;

  .header {
    padding: 20px 30px;
    color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .leftTit {
      font-size: 18px;
      img {
        width: 22px;
        height: 22px;
      }
    }
    .rightAction {
      flex: 1;
      display: flex;
      justify-content: flex-end;
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
      .quickMode {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      .filters {
        margin-left: 20px;
        padding: 8px 16px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 18px 18px 18px 18px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }
  }

  .content {
    width: 100%;
    margin: 38px 0 50px 0;
    padding: 0 82px;
    .libraryItem {
      position: relative;
      box-sizing: initial;

      :deep(.cardItemImgCon) {
        .ant-image {
          width: 100%;
        }
      }
    }
    .basicsBadge {
      padding: 3px 8px;
      background: #1a49c0;
      border-radius: 6px 0px 6px 0px;
      font-size: 14px;
      color: #ffffff;
    }
    .viewMore {
      display: flex;
      align-items: center;
      padding: 7px 10px 7px 22px;
      background: linear-gradient(
        254deg,
        #122f7a 0%,
        rgba(18, 47, 122, 0.3) 74%,
        rgba(18, 47, 122, 0) 100%
      );
      border-radius: 0px 6px 0px 6px;
      font-size: 14px;
      color: #ffffff;
      img {
        margin-left: 2px;
        width: 10px;
        height: 12px;
      }
    }
    .posBot {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 16px;
    }
    .bottomItem {
      padding: 14px 10px 5px 10px;

      .title {
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        color: #616161;
        span {
          &:nth-child(1) {
            font-size: 16px;
            color: #202020;
          }
        }
      }
      .num {
        margin-bottom: 6px;
        font-size: 14px;
        color: rgba(97, 97, 97, 1);
        display: flex;
        align-items: center;
        span {
          &:nth-child(2) {
            font-size: 16px;
            color: rgba(32, 32, 32, 1);
          }
        }
      }
      .boutique {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        max-height: 60px;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none; /* 隐藏滚动条 */
        }

        scrollbar-width: none; /* Firefox 隐藏滚动条 */
        -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
        .boutiqueList {
          border: 1px solid #f28800;
          font-size: 12px;
          color: rgba(242, 136, 0, 1);
          padding: 2px 6px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
    .timeStatus {
      display: flex;
      align-items: center;

      .allCir {
        display: inline-block;
        width: 12px;
        height: 6px;
        background-color: rgba(111, 111, 111, 1);
      }
      .unAllCir {
        display: inline-block;
        width: 12px;
        height: 6px;
        background-color: rgba(224, 224, 224, 1);
      }
      .timeStatusText {
        margin-left: 6px;
        font-size: 10px;
        color: rgba(97, 97, 97, 1);
      }
    }
    .itemAll {
      display: inline-block;
      width: 12px;
      height: 6px;
      background-color: rgba(111, 111, 111, 1);
    }
    .itemUnAll {
      display: inline-block;
      width: 12px;
      height: 6px;
      background-color: rgba(224, 224, 224, 1);
    }
    .itemAm {
      display: flex;
      width: 12px;
      height: 6px;
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
      height: 6px;
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
    .action {
      position: absolute;
      left: -2px;
      width: calc(100% + 4px);
      transform: translateY(10%);
      padding: 9px 0;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      background: #1a49c0;
      border-radius: 0px 0px 10px 10px;
      text-align: center;
      box-sizing: initial;
      z-index: 1;
    }
  }
}
</style>
