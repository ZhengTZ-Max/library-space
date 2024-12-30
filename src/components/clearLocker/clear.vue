<template>
  <div class="centerCon bookCase" :class="{ bookCaseM: systemMode != 'pc' }">
    <a-affix
      v-if="systemMode == 'pc'"
      offset-top="0"
      :target="() => containerRef"
    >
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="() => router.replace('/clearLocker')"
              >{{ $t("visitor_Select_Library") }}</a-breadcrumb-item
            >
            <a-breadcrumb-item>选择机柜</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="filters activeBtn" @click="state.popoverShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            {{$t("Screen")}}
          </div>
        </div>
      </div>
    </a-affix>
    <div class="clearList">
      <div class="filterCon" :class="{ filterConM: systemMode == 'mobile' }">
        <a-checkbox
          v-model:checked="state.listConfig.allCheck"
          @change="changeCheckbox"
          >{{ $t("Visitor_Select_All") }}</a-checkbox
        >

        <div
          v-if="systemMode == 'mobile'"
          class="filters"
          @click="state.popoverShow = true"
        >
          <img src="@/assets/seat/filtersIcon.svg" alt="" />
          {{ $t("Screen") }}
        </div>
      </div>
      <div class="refresh-wrap">
        <van-pull-refresh v-model="state.refresh" @refresh="onRefresh">
          <van-list
            v-model="state.listConfig.loading"
            :finished="state.listConfig.list?.length == state.listConfig.total"
            :offset="40"
            :finish-text="lang == 'zh' ? '没有更多了' : 'No More'"
            @load="onLoad"
          >
            <template #finished>
              <p>
                {{ lang == "zh" ? "没有更多了" : "No More" }}
              </p>
            </template>
            <div class="caseList" v-if="state.listConfig.list?.length">
              <div
                class="caseItem"
                v-for="item in state.listConfig.list"
                :key="item.id"
              >
                <a-checkbox
                  style="margin-right: 15px"
                  v-model:checked="item.check"
                ></a-checkbox>

                <div class="libiryCon" @click="item.check = !item.check">
                  <div class="typeInfo">
                    <div
                      class="lockerStatus"
                      :class="{
                        dayCon: item?.typeCategory == 14,
                        weekCon: item?.typeCategory == 15,
                        longCon: item?.typeCategory == 16,
                      }"
                    >
                      <span v-if="item?.typeCategory == 14">日</span>
                      <span v-if="item?.typeCategory == 15">周</span>
                      <span v-if="item?.typeCategory == 16">长</span>
                    </div>
                    <div class="lockerInfo">
                      <p class="lockerTitle">{{ item?.nameMerge }}</p>
                      <p class="showNum">
                        <span>·{{ $t("Tot") }}{{ item?.all }}</span>
                        <span style="color: #5d89f6"
                          >·{{ $t("Avl") }}{{ item?.empty }}</span
                        >
                        <span style="color: #ff5d5d"
                          >·异常{{ item?.unusually }}</span
                        >
                      </p>
                    </div>
                    <div class="viewInfo clickBox" @click.stop="details(item?.id)">
                      {{ $t("Visitor_details") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a-empty description="无超时使用和有物锁定柜" v-else />
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="btn-bottom">
        <van-button class="btn back" plain type="primary" @click="goBack">
          <img src="@/assets/common/backIcon.png" alt="" />
        </van-button>
        <van-button
          :disabled="clearDisabled"
          class="btn blueBorder"
          plain
          type="primary"
          @click="fetchOpenLocker"
          >开柜</van-button
        >
        <van-button
          :disabled="clearDisabled"
          class="btn"
          type="primary"
          @click="fetchCleanLocker"
          >{{ $t("V4_clear_cabinet") }}</van-button
        >
      </div>
    </div>
  </div>

  <van-popup
    :class="systemMode === 'pc' ? 'bookCasePopup' : ''"
    v-model:show="state.popoverShow"
    closeable
    round
    position="bottom"
  >
    <div class="popupCon">
      <div class="formBox">
        <p class="formTit">{{ $t("Library") }}</p>

        <Tabs
          multiple
          :list="state.floorList"
          activeKey="id"
          activeLabel="name"
          :active="state.floorActive"
          @onChange="onChangeFloor"
        />

        <p class="formTit">{{ $t("type") }}</p>
        <Tabs
          :list="state.typeCategoryList"
          activeKey="id"
          activeLabel="name"
          :active="state.typeCategoryActive"
          @onChange="(e) => (state.typeCategoryActive = e)"
        />
      </div>
      <div class="formBtn">
        <van-button class="btn_left" @click="resetting">{{ $t("Visitor_Reset") }} </van-button>
        <van-button class="btn_right" @click="queryList">{{ $t("Visitor_query") }} </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { showToast, Dialog } from "vant";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import _ from "lodash";
import Tabs from "./Tabs.vue";
import {
  // clearBookcaseList,
  // clearBookcase,
  getLockManageFilterConditions,
  oneClickOpenLocker,
  oneClickCleanLocker,
} from "@/request/bookcase";
// import Empty from "@/components/Empty.vue";
import { filterTreeEn } from "@/utils";

const route = useRoute();
const router = useRouter();
const store = useStore();

const lang = store?.state?.lang;
const systemMode = computed(() => store.state.systemMode);
const containerRef = ref();

const state = reactive({
  premisesList: [],
  premisesActive: {},
  article: [
    {
      label: "有物锁定",
      value: "1",
    },
    {
      label: "无物锁定",
      value: "0",
    },
  ],
  articleActive: {},
  hours: "",
  popoverShow: false,
  refresh: false,
  allCheck: false,
  listConfig: {
    loading: false,
    list: [],
    page: 1,
    limit: 10,
    total: 0,
  },

  typeCategoryList: [],
  typeCategoryActive: { id: route?.query?.typeId },
  floorList: [],
  floorActive: [],
});
const clearDisabled = ref(true);

onMounted(() => {
  getList();
});
const getList = async () => {
  try {
    let params = {
      premisesId: route?.query?.id,
      typeCategory: state.typeCategoryActive?.id,
      storeyId: state.floorActive,
    };
    const res = await getLockManageFilterConditions(params);
    if (res?.code !== 0) return;
    state.floorList = filterTreeEn(res?.data?.storeyList);
    state.typeCategoryList = filterTreeEn(res?.data?.typeCategoryList);
    state.listConfig.list = filterTreeEn(res?.data?.list);
  } catch (e) {
    console.log(e);
  }
};
const onChangeFloor = (v) => {
  let findRow = state.floorActive.find((e) => e == v?.id);
  if (findRow) {
    state.floorActive = state.floorActive.filter((e) => e != v?.id);
  } else {
    state.floorActive = [...state.floorActive, v?.id];
  }
  console.log(state.floorActive);
};

const fetchCleanLocker = async () => {
  try {
    let params = {
      areaId: state.listConfig.list?.filter((e) => e?.check)?.map((e) => e?.id),
    };
    const res = await oneClickCleanLocker(params);
    if (res?.code != 0) {
      showToast({ message: res.msg });
      return false;
    }

    showToast({
      duration: 3000,
      message: res.msg,
    });
    setTimeout(() => {
      getList();
    }, 3000);
  } catch (e) {
    console.log(e);
  }
};

const fetchOpenLocker = async () => {
  try {
    let params = {
      areaId: state.listConfig.list?.filter((e) => e?.check)?.map((e) => e?.id),
    };
    const res = await oneClickOpenLocker(params);
    if (res?.code != 0) {
      showToast({
        message: res.msg,
      });
      return false;
    }

    showToast({
      duration: 3000,
      message: res.msg,
    });
    setTimeout(() => {
      getList();
    }, 3000);
  } catch (e) {
    console.log(e);
  }
};

const changeCheckbox = () => {
  state.listConfig.list.forEach((item) => {
    item.check = state.listConfig.allCheck;
  });
};
const queryList = () => {
  // getClearlist(true);
  getList();
  state.popoverShow = false;
};
const resetting = () => {
  state.floorActive = [];
  state.typeCategoryActive = { id: route?.query?.typeId };
  getList();

  state.popoverShow = false;
};

const onLoad = _.debounce(() => {
  if (
    !state.listConfig.loading &&
    state.listConfig.list?.length < state.listConfig.total
  ) {
    let pageNext = state.listConfig.page + 1;
    state.listConfig.page = pageNext;
    addClearlist();
  }
}, 300);
const onRefresh = () => {
  state.listConfig.page = 1;
  resetting();
  state.refresh = false;
};

const details = (id) => {
  let path = "/clearLocker/boxList";
  if (systemMode?.value == "mobile") {
    path = `/mo${path}`;
  }
  router.push({
    path,
    query: {
      id: id,
    },
  });
};

watch(
  () => state.listConfig.list,
  () => {
    let len = state.listConfig.list.length;
    let newLen = 0;
    if (len > 0) {
      state.listConfig.list.forEach((item) => {
        if (item.check) newLen += 1;
      });
      newLen == len
        ? (state.listConfig.allCheck = true)
        : (state.listConfig.allCheck = false);
      newLen > 0 ? (clearDisabled.value = false) : (clearDisabled.value = true);
    }
  },
  {
    deep: true,
  }
);
const goBack = () => {
  router.go(-1);
};
</script>

<style lang="less">
.formtimefield {
  .van-field__control {
    background: #f2f2f2 !important;
  }
}
.bookCasePopup {
  width: 750px;
  left: calc(50% - (750px / 2));
}
</style>
<style lang="less" scoped>
::v-deep.van-pull-refresh {
  flex: 1;
  overflow: auto;
  background-color: #fff;
  height: 100% !important;
}
.bookCaseM {
  height: 100%;
}
.bookCase {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  .clearList {
    margin: 0 auto;
    max-width: 750px;
    display: flex;
    flex-direction: column;
  }
  .filterCon {
    padding: 0 18px 20px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    &.filterConM {
      padding: 12px 20px;
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
  .refresh-wrap {
    height: calc(100vh - 78px - 46px);
    overflow: auto;
  }
  .caseList {
    margin: 0 14px 0 19px;
    .caseItem {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #f2f2f2;
      .index {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        background: #139f12;
        border: 3px solid #212121;
        font-size: 21px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
        margin: 0 10px;
      }
      .info {
        flex: 1;
        font-family: PingFangSC-Medium, PingFang SC;
        p:nth-of-type(1) {
          display: flex;
          justify-content: flex-start;
          font-size: 15px;
          font-weight: 500;
          color: #222222;
        }
        p:nth-of-type(2) {
          display: flex;
          justify-content: space-between;
          span {
            font-size: 12px;
            font-weight: 400;
          }
          span:first-child {
            color: #676767;
          }
          span:last-child {
            color: #e58100;
          }
        }
      }
    }
  }
  .btn-bottom {
    position: fixed;
    bottom: 0;
    max-width: 750px;
    padding: 18px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    .btn {
      font-size: 17px;
      margin-right: 18px;
      flex: 1;
      border-radius: 6px;
      &:last-child {
        margin-right: 0;
      }
    }
    .blueBorder {
      border: 1px solid #35539e;
    }
    .back {
      flex: 0;
      border: 1px solid #35539e;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.popupCon {
  min-height: 300px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  .formTit {
    margin-bottom: 12px;
  }
  .form-time {
    height: 37px;
    background: #f2f2f2;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    margin-bottom: 12px;
    .formtimefield {
      flex: 0.85;
    }
    .van-cell {
      margin: 0;
      padding: 0;
    }
    span:last-child {
      flex: 0.15;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 18px;
      text-align: center;
    }
  }
  .formBox {
    flex: 1;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
  }
  .formBtn {
    margin-top: 12px;
    display: flex;
    .btn_left {
      flex: 1;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      background: #48b0d5;
      border: 1px solid #48b0d5;
      border-radius: 22px 0px 0px 22px;
    }
    .btn_right {
      flex: 1;

      color: #fff;
      font-size: 13px;
      font-weight: 500;
      background: #35539e;
      border: 1px solid #35539e;
      border-radius: 0px 22px 22px 0px;
    }
  }
}
.libiryCon {
  flex: 1;
  font-size: 12px;
  cursor: pointer;

  .typeInfo {
    padding: 15px 0;
    display: flex;
    .lockerStatus {
      margin-right: 15px;
      align-self: center;
    }
    .lockerInfo {
      flex: 1;
      border-left: 1px solid #dddddd;
      padding: 0 25px 0 15px;
      .lockerTitle {
        font-weight: 500;
        font-size: 15px;
        color: #222222;
        margin-bottom: 10px;
      }
      .showNum {
        &:nth-child(1) {
          margin-bottom: 9px;
        }
        display: flex;
        span {
          width: 50%;
        }
      }
    }
    .viewInfo {
      background: rgba(53, 83, 158, 0.1);
      border-radius: 4px;
      padding: 4px 10px;
      color: #35539e;
      align-self: center;
      font-size: 12px;
    }
  }
  .lockerStatus {
    border-radius: 2px;
    color: #fff !important;
    padding: 1px 2px;
    align-self: center;
    &.dayCon {
      background: linear-gradient(146deg, #35539e 0%, #6d8cd9 100%) !important;
    }
    &.weekCon {
      background: linear-gradient(146deg, #6a9e35 0%, #88d96d 100%) !important;
    }
    &.longCon {
      background: linear-gradient(146deg, #e58100 0%, #ffbf6d 99%) !important;
    }
  }
}
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
</style>
