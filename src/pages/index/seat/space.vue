<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { exchangeDateTime } from "@/utils";
import { getSpacePick, getSpaceDetail } from "@/request/seat";

import LibraryInfo from "@/components/LibraryInfo.vue";
const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const state = reactive({
  libraryInfoShow: false,
  libraryInfo: {},
  libraryId: route?.query?.id || "",
  activeIndex: "",
  quickDate: "",
  quickDateList: [],
  quickMode: "",
  quickModeList: [
    { value: 0, label: "地图模式" },
    { value: 1, label: "列表模式" },
  ],
  spaceList: [],

  floorList: [],

  spaceInfo: {},
});

onMounted(() => {
  initQuickDateList();
  if (state.libraryId) {
    fetchLibrary();
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

const fetchLibrary = async () => {
  try {
    let params = {
      premisesIds: state?.libraryId,
      categoryIds: "",
      storeyIds: "",
      noiseIds: "",
      boutiqueIds: "",
      date: "",
    };
    let res = await getSpacePick(params);

    if (res.code != 0) {
      return false;
    }

    state.spaceList = res.data?.area || [];
  } catch (e) {}
};

const fetchInfo = async (id) => {
  try {
    let params = {
      id,
    };
    let res = await getSpaceDetail(params);
    if (res.code != 0) return;
    state.spaceInfo = res?.data || {};
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
              >选择馆舍</a-breadcrumb-item
            >
            <a-breadcrumb-item>选择空间</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="quickBtns" style="margin-right: 200px">
            <div
              v-for="item in state.quickDateList"
              :key="item.label"
              class="item activeBtn"
              :class="{ itemActive: item?.value == state.quickDate }"
              @click="state.quickDate = item?.value"
            >
              {{ exchangeDateTime(item?.value, 40) }}
              {{ item?.label }}
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

          <div class="filters activeBtn">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            筛选
          </div>
        </div>
      </div>
    </a-affix>

    <div class="librarySlt">
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
                <div class="leftBadge basicsBadge">{{ item?.typeName }}</div>
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
                <p class="boutiqueList">{{ filterBoutique(item?.boutique) }}</p>
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
  </div>
</template>
<style lang="less" scoped>
.seatLibrary {
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
      display: flex;
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
</style>
