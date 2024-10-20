<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { SearchOutlined } from "@ant-design/icons-vue";

import { exchangeDateTime } from "@/utils";
import {
  getSpacePick,
  getSpaceDetail,
  getSpaceMap,
  getSpaceIndex,
  getSpaceLabel,
  getSpaceSeat,
} from "@/request/seat";
import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceFilterDate from "@/components/SpaceFilterDate.vue";
import SpaceSeatMap from "@/components/SpaceSeatMap.vue";
import SeatAreaSwipe from "@/components/SeatAreaSwipe.vue";
import SeatAreaList from "@/components/SeatAreaList.vue";

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
  },

  quickDate: route?.query?.date || "",
  quickDateList: [],

  quickMode: "1",
  quickModeList: [
    { value: 0, label: "地图模式" },
    { value: 1, label: "列表模式" },
  ],

  spaceSelected: {},
  spaceList: [],
  spaceInfo: {},
  spaceLabelList: [],

  filterOptions: {},
  filterSearch: {
    library: [],
    floor: [],
    seatType: [],
    date: "",
    boutique: [],
  },

  labelShow: false,
});

onMounted(() => {
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
  } catch (e) {
    console.log(e);
  }
};

const fetchSpaceMap = async () => {
  try {
    let params = {};
    let res = await getSpaceMap(params);

    if (res.code != 0) {
      return false;
    }

    state.spaceList = res?.data?.area || [];
    getFloorArea();
  } catch (e) {
    console.log(e);
  }
};

// const fetchSpace = async () => {
//   try {
//     let { date } = state.filterSearch;
//     let params = {};
//     state.floorMapOpt.list = [];
//     let res = await getSpaceSeat(params);

//     if (res.code != 0) {
//       return false;
//     }

//     state.spaceList = res?.data?.area || [];
//     getFloorArea();
//   } catch (e) {
//     console.log(e);
//   }
// };

const fetchLabel = async (data) => {
  try {
    let res = await getSpaceLabel(data);
    if (res.code != 0) return;
    state.spaceLabelList = res?.data || {};
    // state.libraryInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};

const fetchInfo = async (id) => {
  try {
    let params = {
      id,
    };
    fetchLabel(params);
    let res = await getSpaceMap(params);
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

const handleFilter = () => {
  // fetchLibrary();
  state.spaceFilterShow = false;
};

const onSelectLabel = () => {};

const onSelected = (v) => {
  state.spaceSelected = v;
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

          <a-dropdown
            v-if="state.spaceLabelList?.length"
            trigger="click"
            v-model:open="state.labelShow"
          >
            <div class="filters activeBtn">
              <img src="@/assets/seat/filtersIcon.svg" alt="" />
            </div>
            <template #overlay>
              <a-menu @click="onSelectLabel">
                <a-menu-item
                  v-for="item in state.spaceLabelList"
                  :key="item?.id"
                >
                  {{ item?.name }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-affix>
    <div class="showCon">
      <div class="leftBox">
        <template v-if="state.spaceInfo?.seat?.length">
          <div v-if="state.quickMode == '1'" class="librarySlt">
            <SeatAreaList
              :data="state.spaceInfo"
              :seatSelected="state.spaceSelected"
              @selected="onSelected"
            />
          </div>

          <div v-else class="spaceMapSlt">
            <SpaceSeatMap
              :data="state.spaceInfo"
              :seatSelected="state.spaceSelected"
              @selected="onSelected"
            />
          </div>
        </template>
        <a-skeleton v-else :paragraph="{ rows: 12 }" active />
      </div>

      <div class="rightBox">
        <SeatAreaSwipe
          v-if="state.spaceInfo?.brother_area?.length"
          :data="state.spaceInfo"
          :defaultId="state.initQuery.spaceId"
          @viewInfo="state.libraryInfoShow = true"
        />

        <div class="reservation">
          <div class="selectDate">
            <span>今天</span>
            <span>2023-11-28 10:00~18:00</span>
            <img
              style="cursor: pointer"
              @click="state.spaceFilterShow = true"
              src="@/assets/seat/selectDate.svg"
              alt=""
            />
          </div>
          <p class="selectSeat">
            已选座位： <span>{{ state.spaceSelected?.no || "-" }}</span>
          </p>
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
      title="选择时间"
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
      <SpaceFilterDate
        v-if="state.spaceInfo?.date?.list?.length"
        :date="state.spaceInfo?.date"
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
    height: calc(100% - 90px);
    display: flex;
    padding: 12px 30px;
    .leftBox {
      padding: 30px;
      flex: 1;
      background: #f7f9fb;
      border-radius: 10px;
      overflow-y: auto;
    }
    .rightBox {
      margin-left: 20px;
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
  }

  .spaceMapSlt {
    display: flex;
    justify-content: center;
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
