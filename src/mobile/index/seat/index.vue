<route>
  {
    meta: {
      showHead: true,
      showLeftBack:true,
      title:'Facility_Selection',
      showTabbar:false
    }
  }
  </route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import moment from "moment";

import { exchangeDateTime } from "@/utils";
import { getPcTopFor, getSpaceDetail } from "@/request/seat";

import LibraryInfo from "@/components/LibraryInfo.vue";
const store = useStore();
const router = useRouter();
const containerRef = ref();

const state = reactive({
  libraryInfoShow: false,
  libraryInfo: {},
  quickDate: "",
  quickDateList: [],
  libraryList: [],

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
  goToLink();
};

const fetchLibrary = async () => {
  try {
    let params = {
      day: state.quickDate,
    };
    let res = await getPcTopFor(params);

    if (res.code != 0) {
      return false;
    }

    state.libraryList = res.data?.list || [];
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

const goToLink = (row) => {
  router.push({
    path: "/mo/seat/space",
    query: { id: row?.id, date: state.quickDate },
  });
};
</script>
<template>
  <div class="seatLibrary" ref="containerRef">
    <!-- <div class="header">
      <div class="leftTit">
        <a-breadcrumb>
          <template #separator
            ><img src="@/assets/seat/titRightIcon.svg" alt=""
          /></template>
          <a-breadcrumb-item
            >选择馆舍<img src="@/assets/seat/titRightIcon.svg" alt=""
          /></a-breadcrumb-item>
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
    </div> -->
    <div class="librarySlt">
      <a-row v-if="state.libraryList?.length" :gutter="[40, 40]">
        <template v-for="item in state.libraryList" :key="item?.id">
          <a-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="libraryItem cardItem">
              <div class="cardItemImgCon">
                <div
                  class="rightBadge viewMore clickBox"
                  @click.stop="handleShowInfo(item)"
                >
                  <span> 查看详情 </span>
                  <img src="@/assets/home/rightIconW.svg" alt="" />
                </div>
                <img class="cardItemImg" :src="item?.firstImg" alt="" />
                <div class="posBot">
                  <p>{{ item?.name }}</p>
                  <!-- <span @click.stop="handleShowInfo(item)">查看详情</span> -->
                  <!-- <img
                    @click.stop="handleShowInfo(item)"
                    src="@/assets/home/rightIconW.svg"
                    alt=""
                  /> -->
                  <div class="bottomItem">
                    <div class="num">
                      <span>空闲{{ item?.free_num || "-" }}</span>
                      <span>/总数{{ item?.total_num || "-" }}</span>
                    </div>
                    <div class="action" @click="goToLink(item)">
                      <span>预约</span>
                      <img src="@/assets/home/rightIconW.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </template>
      </a-row>
      <a-empty v-else />
    </div>

    <van-popup
      v-model:show="state.libraryInfoShow"
      position="bottom"
      :style="{ height: '100%' }"
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
            返回
          </van-button>
          <van-button round block type="primary" @click="goToLink"
            >预约</van-button
          >
        </div>
      </div>
    </van-popup>
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
    padding: 0 12px;
    .libraryItem {
      padding: 12px;
    }
    .viewMore {
      left: 0;
      right: unset;
      display: flex;
      align-items: center;
      padding: 7px 10px 7px 12px;
      background: linear-gradient(
        254deg,
        rgba(18, 47, 122, 0) 0%,
        rgba(18, 47, 122, 0.3) 31%,
        #122f7a 100%
      );
      border-radius: 6px 0px 6px 0px;
      font-size: 14px;
      color: #ffffff;
      img {
        margin-left: 2px;
        width: 10px;
        height: 12px;
      }
    }
    .posBot {
      color: #ffffff;
      font-size: 12px;
      p {
        font-size: 14px;
      }
      img {
        cursor: pointer;
        margin-left: 2px;
        width: 13px;
        height: 16px;
      }
    }
    .bottomItem {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .num {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
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
        color: #fff;
        font-size: 12px;
        img {
          margin-left: 3px;
          width: 9px;
          height: 13px;
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
