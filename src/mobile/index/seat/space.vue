<route>
  {
    meta: {
      showHead: false,
      showLeftBack:true,
      title:'V4_space_selection',
      showTabbar:true
    }
  }
  </route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { SearchOutlined } from "@ant-design/icons-vue";

import { exchangeDateTime } from "@/utils";
import { getSpacePick, getSpaceIndex, getSpaceDetail } from "@/request/seat";
import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceFilter from "@/components/SpaceSeat/SpaceFilterCom.vue";
import SpaceMap from "@/components/SpaceSeat/SpaceMap.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const state = reactive({
  libraryInfoShow: false,
  libraryInfo: {},
  spaceFilterShow: false,

  initQuery: {
    libraryId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
    floorId: route?.query?.floor || "",
    seatType: route?.query?.seatType || "",
  },

  quickDate: route?.query?.date || "",
  quickDateList: [],
  quickMode: "1",
  quickModeList: [
    { value: 0, label: "V4_map_view" },
    { value: 1, label: "V4_list_view" },
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
  if (!state.initQuery?.quickDate) {
    state.initQuery.quickDate = exchangeDateTime(new Date(), 2);
    // router.go(-1);
  }
});

const initQueryFn = () => {
  let { libraryId, quickDate, floorId, seatType } = state.initQuery;

  let floorSelect = [];

  state.filterSearch.library = (libraryId && [libraryId]) || [];
  state.filterSearch.date = quickDate;
  state.filterSearch.seatType = (seatType && [seatType]) || [];

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
        label = $t("today");
      } else if (exchangeDateTime(new Date(), 25).format("YYYY-MM-DD") == e) {
        label = $t("tomorrow");
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

const showQuickDate = () => {
  let date = state.quickDate;
  let findCurDate = state?.quickDateList?.find((e) => e?.value == date);
  if (date && findCurDate?.value) {
    return `${date} ${findCurDate?.label}`;
  }
  return "-";
};

const onQuickDateAct = (type) => {
  let date = state.quickDate;
  let findIndex = state?.quickDateList?.findIndex((e) => e?.value == date);
  if (type == "prev") {
    state.filterSearch.date = state?.quickDateList[findIndex - 1]?.value;
  } else if (type == "next") {
    state.filterSearch.date = state?.quickDateList[findIndex + 1]?.value;
  }
  state.quickDate = state.filterSearch.date;
  fetchLibrary();
};

const onChangeAct = (row) => {
  row?.id && row?.show_detail == "1" && fetchInfo(row?.id);
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

const goToLink = (link) => {
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
  state.quickDate = state.filterSearch?.date;
  fetchLibrary();
  state.spaceFilterShow = false;
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

const handleAppt = (row) => {
  router.push({
    path: "/mo/seat/appointment",
    query: {
      id: row?.id,
      date: state.filterSearch.date,
    },
  });
  console.log(row);
};

const fetchInfo = async (id) => {
  try {
    let params = {
      id,
    };
    let res = await getSpaceDetail(params);
    if (res.code != 0) return;
    state.spaceInfo = { ...res?.data, type: "space" } || {};

    state.libraryInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <div class="seatLibrary" ref="containerRef">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit"></div>
        <div v-if="state.filterOptions?.date?.length" class="rightAction">
          <div class="quickDate">
            <img
              v-if="
                state?.quickDateList?.findIndex(
                  (e) => e?.value == state.quickDate
                ) != 0
              "
              class="activeBtn"
              src="@/assets/seat/quickLeftIcon.svg"
              @click="onQuickDateAct('prev')"
              alt=""
            />
            <span>{{ showQuickDate() }}</span>
            <img
              v-if="
                state?.quickDateList?.findIndex(
                  (e) => e?.value == state.quickDate
                ) !=
                state?.quickDateList?.length - 1
              "
              @click="onQuickDateAct('next')"
              class="activeBtn"
              src="@/assets/seat/quickRightIcon.svg"
              alt=""
            />
          </div>

          <div class="filters activeBtn" @click="state.spaceFilterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            {{ $t("Screen") }}
          </div>
        </div>
      </div>
    </a-affix>
    <div v-if="state.quickMode == '1'" class="librarySlt">
      <a-row v-if="state.spaceList?.length" :gutter="[0, 12]">
        <template v-for="item in state.spaceList" :key="item?.id">
          <a-col :xs="24" :sm="24">
            <div class="libraryItem cardItem">
              <div class="cardItemImgCon" @click="onChangeAct(item)">
                <van-image
                  lazy-load
                  class="cardItemImg"
                  :src="item?.thumb_img"
                />
                <div
                  class="leftBadge basicsBadge"
                  :style="{ background: item?.premises_color }"
                >
                  {{ item?.premisesName }}
                </div>
                <div class="posBot" v-if="item?.show_category == 1">
                  <span>- {{ item?.typeName }} -</span>
                </div>
              </div>
              <div class="bottomItem">
                <div class="title">
                  <span>{{ item?.name }}</span>
                  <span>{{ item?.storeyName }}</span>
                </div>
                <div class="num">
                  {{ $t("Total") }} <span>{{ item?.total_num || "-" }}</span>
                  {{ $t("Avl") }}
                  <span>{{ item?.free_num || "-" }}</span>
                </div>
                <div class="actionApt">
                  <p class="boutiqueList ellipsis-2">
                    {{ filterBoutique(item?.boutique) }}
                  </p>
                  <van-button
                    style="padding: 0 15px"
                    plain
                    hairline
                    size="small"
                    round
                    type="primary"
                    @click="handleAppt(item)"
                    >{{ $t("Reservation") }}</van-button
                  >
                </div>
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

    <!-- <a-modal
      width="40%"
      v-model:open="state.libraryInfoShow"
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
    </a-modal> -->

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="100%"
      placement="bottom"
      :open="state.libraryInfoShow"
      @close="state.libraryInfoShow = false"
      :closable="false"
    >
      <div class="libraryPop">
        <LibraryInfo v-if="state.spaceInfo?.id" :data="state.spaceInfo" />

        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.libraryInfoShow = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            {{ $t("Return") }}
          </van-button>
          <van-button
            round
            block
            type="primary"
            @click="handleAppt(state.spaceInfo)"
            >{{ $t("Reservation") }}</van-button
          >
        </div>
      </div>
    </a-drawer>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="70%"
      placement="bottom"
      :open="state.spaceFilterShow"
      @close="state.spaceFilterShow = false"
      :closable="false"
    >
      <div class="drawerCon">
        <SpaceFilter
          v-if="state.filterOptions?.premises?.length"
          :data="state.filterOptions"
          :initSearch="state.filterSearch"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.spaceFilterShow = false"
          >
            {{ $t("cancel") }}
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >{{ $t("visitor_Confirm") }}</van-button
          >
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
.seatLibrary {
  height: 100%;
  overflow: auto;
  background: #fafafa;
  .header {
    padding: 20px 12px;
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
      align-items: center;
      justify-content: space-between;
      .quickDate {
        border-radius: 30px;
        border: 1px solid #eaeaea;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        span {
          padding: 0 24px;
          flex: 1;
        }
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
  .librarySlt {
    width: 100%;
    margin: 12px 0 50px 0;
    padding: 0 12px;
    .libraryItem {
      padding: 14px;
      position: relative;
      box-sizing: initial;
      display: flex;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
      border: none;
      .cardItemImgCon {
        width: 120px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .basicsBadge {
      padding: 3px 8px;
      background: #1a49c0;
      border-radius: 6px 0px 6px 0px;
      font-size: 12px;
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
      padding: 10px 17px 7px 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 12px;
    }
    .bottomItem {
      flex: 1;
      padding: 0 12px;

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
        margin-top: 11px;
        font-size: 12px;
        color: #616161;
        display: flex;
        align-items: center;
        span {
          &:nth-child(1) {
            font-size: 14px;
            color: #202020;
            margin-left: 2px;
            margin-right: 20px;
          }
          &:nth-child(2) {
            font-size: 14px;
            color: #1a49c0;
            margin-left: 2px;
          }
        }
      }
      .actionApt {
        margin-top: 4px;
        display: flex;
        align-items: flex-end;
        .boutiqueList {
          flex: 1;
          font-size: 12px;
          color: #868686;
        }
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
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
    }
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

.filterDrawer {
  padding: 12px;
}

.drawerCon {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filterCon {
    padding: 12px;
    flex: 1;
  }
  .bottomAct {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
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
</style>
