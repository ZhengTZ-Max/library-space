<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { exchangeDateTime } from "@/utils";
import { getLockerList, getLockerFilter } from "@/request/bookcase";
import BookFilter from "@/components/BookcaseCom/BookFilterCom.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const state = reactive({
  BookFilterShow: false,
  activeIndex: "",

  initQuery: {
    bookcaseId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
    floorId: route?.query?.floor || "",
    seatType: route?.query?.seatType || "",
  },

  quickDate: route?.query?.date || "",
  quickDateList: [],

  bookcaseList: [],
  floorList: [],

  spaceInfo: {},

  filterOptions: [],
  filterSearch: {
    library: '',
    floor: '',
    bookType: [],
  },

  floorMapOpt: {
    list: [],
    background: "",
  },
});

onMounted(() => {
  fetchFilter();
  if (!state.initQuery?.quickDate) {
    state.initQuery.quickDate = exchangeDateTime(new Date(), 2);
    // router.go(-1);
  }
});

watch(
  () => state.bookcaseList,
  (v) => {
    if (v?.length) {
      state.activeIndex = v[0]?.id;
    }
  }
);

const initQueryFn = () => {
  let { bookcaseId, quickDate, floorId, seatType } = state.initQuery;

  let floorSelect = [];

  state.filterSearch.library = (bookcaseId && [bookcaseId]) || [];
  state.filterSearch.date = quickDate;
  state.filterSearch.seatType = (seatType && [seatType]) || [];

  // state.filterOptions?.storey?.map((e) => {
  //   if (e?.list?.find((f) => f?.id == floorId)) {
  //     floorSelect.push(e);
  //   }
  // });

  // state.filterSearch.floor = floorSelect?.map((e) => e.name);
};

const onChangeAct = (i) => {
  state.activeIndex = i.id;
};

const fetchFilter = async () => {
  try {
    let res = await getLockerFilter();
    state.filterOptions = res?.data;
    // initQueryFn();
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
      premisesIds: "",
      categoryIds: "",
      storeyIds: "",
      // boutiqueIds: boutique,
      // date,
    };
    // console.log("state.filterOptions", state.filterOptions, library);
    // if (!library?.length) {
    //   params.premisesIds = state.filterOptions?.premises?.map((e) => e?.id);
    // }
    // state.floorMapOpt.list = [];
    let res = await getLockerList(params);

    if (res.code != 0) {
      return false;
    }

    state.bookcaseList = res?.data?.list || [];
    // state.floorList = res?.data?.storey || [];
    // getFloorArea();
  } catch (e) {
    console.log(e);
  }
};

const goToLink = (link) => {
  router.replace(link);
};

const handleAppt = (row) => {
  router.push({
    path: "/bookcase/appointment",
    query: {
      id: row?.id,
    },
  });
  console.log(row);
};
</script>
<template>
  <div class="bookcase" ref="containerRef">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item
              >选择存书柜<img src="@/assets/seat/titRightIcon.svg" alt=""
            /></a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="filters activeBtn" @click="state.BookFilterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            筛选
          </div>
        </div>
      </div>
    </a-affix>

    <div class="librarySlt">
      <a-row v-if="state.bookcaseList?.length" :gutter="[60, 80]">
        <template v-for="item in state.bookcaseList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
            <div
              class="libraryItem cardItem"
              :class="{ activeItem: item?.id == state.activeIndex }"
              @click="onChangeAct(item)"
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
                <div class="leftBadge basicsBadge">{{ item?.atName }}</div>
                <div class="posBot">
                  <span>- {{ item?.atName }} -</span>
                </div>
              </div>
              <div class="bottomItem">
                <div class="title">
                  <span>{{ item?.name }}</span>
                  <span>{{ item?.storeyName }}</span>
                </div>
                <div class="num">
                  总数 <span>{{ item?.total_num || "-" }}</span> 空闲
                  <span>{{ item?.free_num || "-" }}</span>
                </div>
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
      <a-empty v-else />
    </div>

    <a-modal
      width="50%"
      v-model:open="state.BookFilterShow"
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
      <BookFilter
        v-if="state.filterOptions?.length"
        :data="state.filterOptions"
        :initSearch="state.filterSearch"
      />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.bookcase {
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
    margin: 38px 0 50px 0;
    padding: 0 82px;
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
