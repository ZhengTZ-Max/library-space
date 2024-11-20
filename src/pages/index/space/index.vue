<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import moment from "moment";

import { exchangeDateTime } from "@/utils";
import { getPcTopFor, getSpaceDetail } from "@/request/seat";
import { getSeminarIndex } from "@/request/space";

import LibraryInfo from "@/components/LibraryInfo.vue";
const store = useStore();
const router = useRouter();
const containerRef = ref();

const state = reactive({
  libraryInfoShow: false,
  libraryInfo: {},
  activeIndex: "",
  quickDate: "",
  quickDateList: [],
  libraryList: [],

  floorList: [],

  spaceInfo: {},
});

onMounted(() => {
  initQuickDateList();
});

watch(
  () => state.quickDate,
  (v) => {
    if (v) fetchLibrary();
  }
);

watch(
  () => state.libraryList,
  (v) => {
    if (v?.length) {
      state.activeIndex = v[0]?.id;
      state.floorList = v[0]?.children;
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

const handleAppt = () => {
  goToLink(state.libraryInfo?.id);
};

const onChangeAct = (i) => {
  state.activeIndex = i.id;
};

const fetchLibrary = async () => {
  try {
    let params = {
      day: state.quickDate,
    };
    let res = await getSeminarIndex(params);

    if (res.code != 0) {
      return false;
    }

    state.libraryList = res.data || [];
    initQuickDateList(res.data?.date || []);
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

const goToLink = (id) => {
  router.push({
    path: "/seat/space",
    query: { id: id || state.activeIndex, date: state.quickDate },
  });
};

const onFloor = (row) => {
  router.push({
    path: "/seat/space",
    query: {
      id: state.activeIndex,
      date: state.quickDate,
      floor: row?.id || "",
    },
  });
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
            <a-breadcrumb-item
              >选择馆舍<img src="@/assets/seat/titRightIcon.svg" alt=""
            /></a-breadcrumb-item>
            <!-- <a-breadcrumb-item>1</a-breadcrumb-item> -->
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="quickBtns">
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
        </div>
      </div>
    </a-affix>
    <div class="librarySlt">
      <a-row v-if="state.libraryList?.length" :gutter="[40, 40]">
        <template v-for="item in state.libraryList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="6">
            <div
              class="libraryItem cardItem"
              :class="{ activeItem: item?.id == state.activeIndex }"
              @click="onChangeAct(item)"
            >
              <div class="cardItemImgCon">
                <a-image
                  class="cardItemImg"
                  :src="item?.firstImg"
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
                <!-- <img class="cardItemImg" :src="item?.firstImg" alt="" /> -->
                <div class="posBot">
                  <span>{{ item?.name }}</span>
                  <span @click.stop="handleShowInfo(item)">查看详情</span>
                  <img
                    @click.stop="handleShowInfo(item)"
                    src="@/assets/home/rightIconW.svg"
                    alt=""
                  />
                </div>
              </div>
              <div class="bottomItem">
                <div class="num">
                  <span>空间总数{{ item?.total || "-" }}</span>
                </div>
                <div
                  v-if="item?.id == state.activeIndex"
                  class="action"
                  @click="goToLink(item?.id)"
                >
                  <span>预约</span>
                  <img src="@/assets/home/rightIconPrimary.svg" alt="" />
                </div>
              </div>
            </div>
          </a-col>
        </template>
      </a-row>
      <a-empty v-else />
      <a-row
        v-if="state.activeIndex"
        :gutter="[40, 40]"
        style="margin-top: 50px"
      >
        <a-col
          v-for="item in state.floorList"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
          :xxl="4"
        >
          <div class="quickFloor" @click="onFloor(item)">
            <p class="floorNum">{{ item?.name }}</p>
            <div class="floorTotal">
              <!-- <span>空闲{{ item?.free_num }}</span> -->
              <span>总数{{ item?.total }}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.libraryInfoShow"
      title="馆舍详情"
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
    }
  }
  .librarySlt {
    width: 100%;
    margin: 38px 0 50px 0;
    padding: 0 82px;
    .posBot {
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 14px;
      span {
        &:nth-child(1) {
          flex: 1;
          font-size: 18px;
        }
        &:nth-child(2) {
          cursor: pointer;
        }
      }
      img {
        cursor: pointer;
        margin-left: 2px;
        width: 13px;
        height: 16px;
      }
    }
    .bottomItem {
      padding: 14px 10px 5px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .num {
        font-size: 16px;
        color: #616161;
        span {
          &:nth-child(1) {
            color: #f28800;
          }
        }
      }

      .action {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #1a49c0;
        font-size: 16px;
        img {
          margin-left: 4px;
          width: 13px;
          height: 16px;
        }
      }
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
