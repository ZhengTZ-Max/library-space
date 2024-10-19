<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { SearchOutlined } from "@ant-design/icons-vue";

import { exchangeDateTime } from "@/utils";
import { getSpacePick, getSpaceDetail, getSpaceIndex } from "@/request/seat";
import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceFilter from "@/components/SpaceFilterCom.vue";
import SpaceMap from "@/components/SpaceMap.vue";
import SeatAreaSwipe from "@/components/SeatAreaSwipe.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const state = reactive({
  libraryInfoShow: false,
  libraryInfo: {},
  spaceFilterShow: false,
  activeIndex: "",

  initQuery: {
    spaceId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
    floorId: route?.query?.floor || "",
  },

  quickDate: route?.query?.date || "",
  quickDateList: [],
  quickMode: "1",
  quickModeList: [
    { value: 0, label: "地图模式" },
    { value: 1, label: "列表模式" },
  ],
  spaceList: [],
  floorList: [],

  spaceInfo: {},

  filterOptions: {},
  filterSearch: {
    search: "",
    library: [],
    floor: [],
    seatType: [],
    date: "",
    boutique: [],
  },

  floorMapOpt: {
    list: [],
    background: "",
  },
});

onMounted(() => {
  initQuickDateList();

  fetchFilter();

  if (state.initQuery?.spaceId) {
    fetchInfo(state.initQuery?.spaceId);
  } else {
    router.go(-1);
  }
});

watch(
  () => state.spaceList,
  (v) => {
    if (v?.length) {
      state.activeIndex = v[0]?.id;
    }
  }
);

const initQueryFn = () => {
  let { libraryId, quickDate, floorId } = state.initQuery;

  let floorSelect = [];

  state.filterSearch.library = [libraryId];
  state.filterSearch.date = quickDate;

  state.filterOptions?.storey?.map((e) => {
    if (e?.list?.find((f) => f?.id == floorId)) {
      floorSelect.push(e);
    }
  });

  state.filterSearch.floor = floorSelect?.map((e) => e.name);
};

const initQuickDateList = (list) => {
  state.quickDateList = [
    { label: "今天", value: moment().format("YYYY-MM-DD") },
    { label: "明天", value: moment().add(1, "days").format("YYYY-MM-DD") },
  ];

  if (list?.length) {
    state.quickDateList = list?.map((e) => {
      let label = "";
      if (moment().format("YYYY-MM-DD") == e) {
        label = "今天";
      } else if (exchangeDateTime(new Date(), 25).format("YYYY-MM-DD") == e) {
        label = "明天";
      } else {
        label = exchangeDateTime(e, 4);
      }
      return {
        label,
        value: moment(e).format("YYYY-MM-DD"),
      };
    });
  }
  if (!state?.quickDate) state.quickDate = state.quickDateList[0]?.value;
};

const handleShowInfo = (item) => {
  state.libraryInfo = {
    id: item.id,
    type: "library",
  };
  fetchInfo(item.id);
};

const handleAppt = () => {};

const onChangeAct = (i) => {
  state.activeIndex = i.id;
};

const fetchFilter = async () => {
  try {
    let res = await getSpaceIndex();
    state.filterOptions = res?.data;
    initQuickDateList(res?.data?.date);
    initQueryFn();
    fetchLibrary();
  } catch (e) {
    console.log(e);
  }
};

const fetchLibrary = async () => {
  try {
    let { search, library, floor, seatType, date, boutique } =
      state.filterSearch;
    let params = {
      premisesIds: library,
      categoryIds: seatType,
      storeyIds: filterFloorIds(floor),
      boutiqueIds: boutique,
      date,
    };
    state.floorMapOpt.list = [];
    let res = await getSpacePick(params);

    if (res.code != 0) {
      return false;
    }

    state.spaceList = res?.data?.area || [];
    state.floorList = res?.data?.storey || [];
    getFloorArea();
  } catch (e) {
    console.log(e);
  }
};

const fetchInfo = async (id) => {
  try {
    let params = {
      id,
    };
    let res = await getSpaceDetail(params);
    if (res.code != 0) return;
    state.spaceInfo = res?.data || {};
    // state.libraryInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};

const goToLink = (link) => {
  if (link === -1) {
    router.go(-1);
    return false;
  }
  router.replace(link);
};

const filterBoutique = (list) => {
  let newList = list?.map((e) => e?.name);
  return newList?.join("·") || "";
};

const filterFloorIds = (ids) => {
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
};

const handleFilter = () => {
  fetchLibrary();
  state.spaceFilterShow = false;
};

const onChangeQDate = (row) => {
  state.quickDate = row?.value;
  state.filterSearch.date = row?.value;
  fetchLibrary();
};

const getFloorArea = () => {
  let list = state.floorList;
  let area = state.spaceList;
  let firstFloor = list[0];

  area = area?.filter((e) => {
    return firstFloor?.id == e?.parentId;
  });

  state.floorMapOpt.background = firstFloor?.web_plane;
  state.floorMapOpt.list = area;
};
</script>
<template>
  <div class="seatAppointment" ref="containerRef">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/seat')"
              >选择馆舍</a-breadcrumb-item
            >
            <a-breadcrumb-item @click="goToLink(-1)"
              >选择空间</a-breadcrumb-item
            >
            <a-breadcrumb-item>选择座位</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="quickBtns">
            <div
              v-for="item in state.quickModeList"
              :key="item.label"
              class="item activeBtn"
              :class="{ itemActive: item?.value == state.quickMode }"
              @click="state.quickMode = item?.value"
            >
              {{ item?.label }}
            </div>
          </div>

          <div class="filters activeBtn" @click="state.spaceFilterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
          </div>
        </div>
      </div>
    </a-affix>
    <div class="showCon">
      <div class="leftBox">
        <div v-if="state.quickMode == '1'" class="librarySlt">
          <a-row v-if="state.spaceList?.length" :gutter="[60, 80]">
            <template v-for="item in state.spaceList" :key="item?.id">
              <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <div
                  class="libraryItem cardItem"
                  :class="{ activeItem: item?.id == state.activeIndex }"
                  @click="onChangeAct(item)"
                >
                  <div class="cardItemImgCon">
                    <img class="cardItemImg" :src="item?.firstImg" alt="" />
                    <div class="leftBadge basicsBadge">
                      {{ item?.typeName }}
                    </div>
                    <div
                      class="rightBadge viewMore clickBox"
                      @click.stop="handleShowInfo(item)"
                    >
                      <span> 查看详情 </span>
                      <img src="@/assets/home/rightIconW.svg" alt="" />
                    </div>
                    <div class="posBot">
                      <span>- {{ item?.typeName }} -</span>
                    </div>
                  </div>
                  <div class="bottomItem">
                    <div class="title">
                      <span>{{ item?.name }}</span>
                      <span>1F</span>
                    </div>
                    <div class="num">
                      总数 <span>{{ item?.total_num || "-" }}</span> 空闲
                      <span>{{ item?.free_num || "-" }}</span>
                    </div>
                    <p class="boutiqueList">
                      {{ filterBoutique(item?.boutique) }}
                    </p>
                  </div>
                  <div
                    v-if="item?.id == state.activeIndex"
                    class="action clickBoxT"
                  >
                    立即预约
                  </div>
                </div>
              </a-col>
            </template>
          </a-row>
          <a-empty v-else />
        </div>

        <div v-else class="spaceMapSlt">
          <SpaceMap
            v-if="state.floorMapOpt.list?.length"
            :options="state.floorMapOpt"
          />
        </div>
      </div>

      <div class="rightBox">
        <SeatAreaSwipe
          v-if="state.spaceInfo?.brother_area?.length"
          :data="state.spaceInfo"
          :defaultId="state.initQuery.spaceId"
        />

        <div class="reservation">
          <div class="selectDate">
            <span>今天</span>
            <span>2023-11-28 10:00~18:00</span>
            <img src="@/assets/seat/selectDate.svg" alt="" />
          </div>
          <p class="selectSeat">已选座位： <span>015</span></p>
        </div>
        <a-button class="reserve-btn" shape="round" type="primary" block
          >立即预约</a-button
        >
      </div>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.libraryInfoShow"
      title="空间详情"
      @ok="handleAppt"
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
      <SpaceFilter
        v-if="state.filterOptions?.premises?.length"
        :data="state.filterOptions"
        :initSearch="state.filterSearch"
      />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.seatAppointment {
  height: 100%;
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
      .quickDate {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      .filters {
        margin-left: 20px;
        padding: 6px 10px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 24px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .showCon {
    display: flex;
    padding: 12px 30px;
    .leftBox {
      flex: 1;
    }
    .rightBox {
      width: 320px;

      .reservation {
        background: #ffffff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #e7e7e7;
        padding: 20px 18px;
        margin-top: 20px;

        .selectDate {
          display: flex;
          font-size: 15px;
          color: #202020;
          span {
            &:nth-child(1) {
              font-size: 15px;
              color: #1a49c0;
              margin-right: 6px;
            }
            &:nth-child(2) {
              flex: 1;
            }
          }
        }
        .selectSeat {
          margin-top: 20px;
          font-size: 15px;
          color: #616161;
          span {
            color: #202020;
          }
        }
      }

      .reserve-btn {
        margin-top: 60px;
        font-size: 16px;
      }
    }
  }
  .librarySlt {
    width: 100%;
    .libraryItem {
      position: relative;
      box-sizing: initial;
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
        margin-bottom: 20px;
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
        color: #616161;
        display: flex;
        align-items: center;
        span {
          &:nth-child(1) {
            font-size: 16px;
            color: #202020;
            margin-left: 2px;
            margin-right: 40px;
          }
          &:nth-child(2) {
            font-size: 16px;
            color: #1a49c0;
            margin-left: 2px;
          }
        }
      }
      .boutiqueList {
        font-size: 14px;
        color: #868686;
      }
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

  .spaceMapSlt {
    display: flex;
    justify-content: center;
  }

  .quickFloor {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 180px;
    background: linear-gradient(135deg, #f0f2f7 0%, #ffffff 100%);
    border-radius: 20px;
    box-shadow: 8px 10px 14px #e7ecf7;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .floorNum {
      font-weight: 400;
      font-size: 36px;
      color: #1a49c0;
      transform: skewX(-12deg);
    }
    .floorTotal {
      font-size: 18px;
      color: #616161;
      span {
        &:nth-child(1) {
          color: #f28800;
        }
      }
    }
  }
}

.filterCon {
  padding: 24px 0;
  height: 100%;
  overflow: auto;
  .filterFilter {
    margin-bottom: 24px;
    background: rgba(97, 97, 97, 0.05);
    border-radius: 0px 0px 0px 0px;
    padding: 2px 10px;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 40px;
  }

  .ant-checkbox-group {
    column-gap: 36px;
    row-gap: 20px;
  }

  .ant-radio-group {
    display: inline-flex;
    column-gap: 36px;
    row-gap: 20px;
  }
}
</style>
