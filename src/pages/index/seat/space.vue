<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { SearchOutlined } from "@ant-design/icons-vue";

import { exchangeDateTime } from "@/utils";
import { getSpacePick, getSpaceDetail, getSpaceIndex } from "@/request/seat";
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
  activeIndex: "",

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
    { value: 0, label: $t("V4_map_view") },
    { value: 1, label: $t("V4_list_view") },
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
    time: [0, 0],
  },

  floorMapOpt: {
    activeId: "",
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

watch(
  () => state.spaceList,
  (v) => {
    if (v?.length) {
      state.activeIndex = v[0]?.id;
    }
  }
);

const initQueryFn = () => {
  let { libraryId, quickDate, floorId, seatType } = state.initQuery;

  let floorSelect = [];

  state.filterSearch.library = (libraryId && libraryId) || [];
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
    { label: $t("today"), value: moment().format("YYYY-MM-DD") },
    { label: $t("tomorrow"), value: moment().add(1, "days").format("YYYY-MM-DD") },
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

const handleShowInfo = (item) => {
  state.libraryInfo = {
    id: item.id,
    type: "space",
  };
  fetchInfo(item.id);
};

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
    console.log("state.filterOptions", state.filterOptions, library);
    if (!library?.length) {
      params.premisesIds = state.filterOptions?.premises?.map((e) => e?.id);
    }
    state.floorMapOpt.list = [];
    state.floorMapOpt.activeId = "";
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
    state.spaceInfo = { ...res?.data, type: "space" } || {};
    state.libraryInfoShow = true;
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

const onChangeQDate = (row) => {
  state.quickDate = row?.value;
  state.filterSearch.date = row?.value;
  fetchLibrary();
};

const getFloorArea = () => {
  let list = state.floorList;
  let area = state.spaceList;
  let firstFloor = {};

  if (state.floorMapOpt?.activeId) {
    firstFloor = list?.find((e) => e?.id == state.floorMapOpt?.activeId);
  } else {
    state.floorMapOpt.activeId = list[0]?.id;
    firstFloor = list[0];
  }

  area = area?.filter((e) => {
    return firstFloor?.id == e?.parentId;
  });

  state.floorMapOpt.background = firstFloor?.web_plane;
  state.floorMapOpt.list = area;
};

const handleAppt = (row) => {
  router.push({
    path: "/seat/appointment",
    query: {
      id: row?.id,
      date: state.filterSearch.date,
    },
  });
  console.log(row);
};
const onFloor = (row) => {
  state.floorMapOpt.activeId = row?.id;
  state.floorMapOpt.list = [];
  setTimeout(() => {
    getFloorArea();
  }, 100);
};
</script>
<template>
  <div class="seatLibrary" ref="containerRef">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/seat')"
              >{{ $t("visitor_Select_Library") }}</a-breadcrumb-item
            >
            <a-breadcrumb-item>{{ $t("V4_select_a_space") }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="quickDate">
            <div class="quickBtns" style="margin-right: 40px">
              <div
                v-for="item in state.quickDateList"
                :key="item.label"
                class="item activeBtn"
                :class="{ itemActive: item?.value == state.quickDate }"
                @click="onChangeQDate(item)"
              >
                {{ exchangeDateTime(item?.value, 40) }}
                {{ item?.label }}
              </div>
            </div>
          </div>

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
            {{ $t("Screen") }}
          </div>
        </div>
      </div>
    </a-affix>

    <div v-if="state.quickMode == '1'" class="librarySlt">
      <a-row v-if="state.spaceList?.length" :gutter="[60, 60]">
        <template v-for="item in state.spaceList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
            <div
              class="libraryItem cardItem"
              :class="{ activeItem: item?.id == state.activeIndex }"
              @mousemove="onChangeAct(item)"
            >
              <div class="cardItemImgCon">
                <a-image
                  @click="handleAppt(item)"
                  class="cardItemImg"
                  :src="item?.thumb_img"
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
                <div
                  class="leftBadge basicsBadge"
                  :style="{ background: item?.premises_color }"
                >
                  {{ item?.premisesName }}
                </div>
                <div
                  v-if="item?.show_detail == 1"
                  class="rightBadge viewMore clickBox"
                  @click.stop="handleShowInfo(item)"
                >
                  <span> {{ $t("V4_view_details") }} </span>
                  <img src="@/assets/home/rightIconW.svg" alt="" />
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
                  {{ $t("Tot") }} <span>{{ item?.total_num || "-" }}</span>
                  {{ $t("Avl") }}
                  <span>{{ item?.free_num || "-" }}</span>
                </div>
                <p class="boutiqueList ellipsis-2">
                  {{ filterBoutique(item?.boutique) }}
                </p>
              </div>
              <div
                v-if="item?.id == state.activeIndex"
                class="action clickBoxT"
                @click="handleAppt(item)"
              >
                {{ $t("book_now") }}
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
        @selected="handleAppt"
      />
    </div>

    <div
      v-if="state.floorList?.length && state.quickMode == 0"
      class="floorSltMap"
    >
      <a-row :gutter="[25, 25]">
        <a-col
          v-for="item in state.floorList"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="24"
          :xxl="24"
        >
          <div
            class="quickFloor"
            @click="onFloor(item)"
            :class="{ activeItem: state.floorMapOpt.activeId == item?.id }"
          >
            <p class="floorNum">{{ item?.name }}</p>
            <div class="floorTotal">
              <span>{{ $t("Avl") }}{{ item?.free_num }}</span>
              <span>/{{ $t("Tot") }}{{ item?.total_num }}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.libraryInfoShow"
      title="空间详情"
      @ok="handleAppt(state.spaceInfo)"
      destroyOnClose
      :okText="$t('Reservation')"
      :cancelText="$t('feedback_details_close')"
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
      :title="$t('V4_space_filter')"
      @ok="handleFilter"
      destroyOnClose
      :okText="$t('visitor_Confirm')"
      :cancelText="$t('cancel')"
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
.seatLibrary {
  height: 100%;
  overflow: auto;
  position: relative;
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
    margin: 0 0 50px 0;
    padding: 0 82px;
    .libraryItem {
      position: relative;
      box-sizing: initial;
      width: 220px;
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
    padding-left: 120px;
    display: flex;
    .spaceMap {
      border: 2px solid #cccccc;
      border-radius: 4px;
    }
  }
}

.filterCon {
  padding: 24px 0;
  height: 100%;
  max-height: 550px;
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
.floorSltMap {
  position: absolute;
  right: 95px;
  top: 6%;
  width: 220px;
  padding-right: 40px;
  height: calc(100vh - 210px);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  .quickFloor {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    height: 120px;
    background: linear-gradient(135deg, #f0f2f7 0%, #ffffff 100%);
    background-color: #e4e4e4;

    border-radius: 20px;
    box-shadow: 8px 10px 14px #e7ecf7;
    &.activeItem {
      border: 2px solid var(--primary-color);
    }
    &:hover {
      background: #e4e4e4;
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
</style>
