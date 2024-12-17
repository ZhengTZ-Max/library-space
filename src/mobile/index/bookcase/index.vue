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
    library: "",
    floor: "",
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
    let { library, floor, bookType } = state.filterSearch;
    let params = {
      premisesIds: (library && [library]) || "",
      categoryIds: bookType?.length ? bookType : "",
      storeyIds: (floor && [floor]) || "",
    };

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
    path: "/mo/bookcase/appointment",
    query: {
      id: row?.id,
    },
  });
  console.log(row);
};

const handleFilter = () => {
  fetchLibrary();
  state.BookFilterShow = false;
};
</script>
<template>
  <div class="bookcase" ref="containerRef">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit"></div>
        <div class="rightAction">
          <div class="filters activeBtn" @click="state.BookFilterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            筛选
          </div>
        </div>
      </div>
    </a-affix>

    <div class="librarySlt">
      <a-row v-if="state.bookcaseList?.length" :gutter="[0, 12]">
        <template v-for="item in state.bookcaseList" :key="item?.id">
          <a-col :xs="24" :sm="24">
            <div class="libraryItem cardItem" @click="onChangeAct(item)">
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
                <div class="actionApt">
                  <p class="boutiqueList ellipsis-2"></p>
                  <van-button
                    style="padding: 0 15px"
                    plain
                    hairline
                    size="small"
                    round
                    type="primary"
                    @click="handleAppt(item)"
                    >预约</van-button
                  >
                </div>
              </div>
            </div>
          </a-col>
        </template>
      </a-row>
      <a-empty v-else />
    </div>

    <a-drawer
      rootClassName="filterDrawer"
      width="100%"
      height="50%"
      placement="bottom"
      :open="state.BookFilterShow"
      @close="state.BookFilterShow = false"
      :closable="false"
    >
      <div class="drawerCon">
        <BookFilter
          v-if="state.filterOptions?.length"
          :data="state.filterOptions"
          :initSearch="state.filterSearch"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.BookFilterShow = false"
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
.bookcase {
  height: 100%;
  overflow: auto;
  background: #fafafa;
  .header {
    padding: 8px 16px;
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
</style>
