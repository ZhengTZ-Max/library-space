<template>
  <div class="centerCon bookCase" :class="{ bookCaseM: systemMode != 'pc' }">
    <div class="boxInfo">
      <p class="boxNum">{{ state.boxInfo?.lockerName || "-" }}</p>
      <p class="showNum">
        <span>·总数{{ state.boxInfo?.all || 0 }}</span>
        <span style="color: #5d89f6">·空闲{{ state.boxInfo?.empty || 0 }}</span>
        <span style="color: #ff5d5d"
          >·异常{{ state.boxInfo?.unusually || 0 }}</span
        >
      </p>
    </div>
    <div class="filterCon">
      <a-checkbox
        v-model:checked="state.listConfig.allCheck"
        @change="changeCheckbox"
        >全选</a-checkbox
      >

      <div class="filters" @click="state.popoverShow = true">
        <img src="@/assets/seat/filtersIcon.svg" alt="" />
        筛选
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
              <div class="libiryCon">
                <div class="typeInfo">
                  <p class="lockerNum">
                    {{ item?.name }}
                  </p>
                  <div class="lockerInfo">
                    <p class="lockerTitle">
                      {{ item?.userName }}
                      <span v-if="item?.userId">({{ item?.userId }})</span>
                    </p>
                  </div>
                  <div
                    class="viewInfo"
                    :class="{
                      type1: item?.lockType == 1,
                      type5: item?.lockType == 5,
                    }"
                  >
                    {{ item?.outTxt }}
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
      <van-button class="btn back" plain type="primary" @click="router.go(-1)">
        <img src="@/assets/common/backIcon.png" alt="" />
      </van-button>
      <van-button
        :disabled="clearDisabled"
        class="btn blueBorder"
        plain
        type="primary"
        @click="fetchOpenLocker"
        >{{ currentLang?.Visitor_immediately2 || "开柜" }}</van-button
      >
      <van-button
        :disabled="clearDisabled"
        class="btn"
        type="primary"
        @click="clear"
        >{{ currentLang?.Visitor_immediately || "清柜" }}</van-button
      >
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
        <template v-if="state.boxInfo?.typeCategory == 14">
          <p class="formTit">
            {{ currentLang?.Visitor_Timeout_duration || "超过时间" }}
          </p>
          <div class="form-time">
            <van-field
              class="formtimefield"
              v-model="state.hours"
              :placeholder="'请输入时间'"
              autocomplete="off"
              type="number"
            />
            <span>{{ currentLang?.Visitor_hour || "小时" }}</span>
          </div>
        </template>

        <p class="formTit">{{ currentLang?.type || "状态" }}</p>
        <Tabs
          :list="state.article"
          activeKey="value"
          :active="state.articleActive"
          @onChange="(e) => (state.articleActive = e)"
        />
      </div>
      <div class="formBtn">
        <van-button class="btn_left" @click="resetting"
          >{{ currentLang?.Visitor_Reset || "重置" }}
        </van-button>
        <van-button class="btn_right" @click="queryList"
          >{{ currentLang?.Visitor_query || "查询" }}
        </van-button>
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
  clearBookcaseList,
  clearBookcase,
  openLocker,
} from "@/request/bookcase";

import { filterTreeEn } from "@/utils";

const route = useRoute();
const router = useRouter();
const store = useStore();

const currentLang = store?.state?.lang?.currentLang;
const lang = store?.state?.lang;
const systemMode = computed(() => store.state.systemMode);
const containerRef = ref();

const state = reactive({
  boxInfo: {},
  article: [
    {
      label: "有物锁定",
      value: "5",
    },
    {
      label: "违约次数已满",
      value: "4",
    },
    {
      label: "空闲",
      value: "1",
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
});
const clearDisabled = ref(true);

onMounted(() => {
  getList();
});
const getList = async () => {
  try {
    let params = {
      areaId: route?.query?.id,
      state: "",
      timeOut: "",
      isLocked: "",
    };
    if (state.boxInfo?.typeCategory != 14) {
      params.state = state.articleActive?.value;
    } else {
      params.timeOut = state.hours;
      params.isLocked = state.articleActive?.value == 5 ? 1 : 0;
    }
    const res = await clearBookcaseList(params);
    if (res?.code !== 0) return;

    state.boxInfo = res?.data;
    let { typeCategory } = state.boxInfo;
    if (typeCategory == 14) {
      state.article = state.article?.filter((e) => e?.value == 5);
    }
    state.listConfig.list = filterTreeEn(res?.data?.list);
  } catch (e) {
    console.log(e);
  }
};

const fetchOpenLocker = async () => {
  try {
    let params = {
      boxId: state.listConfig.list?.filter((e) => e?.check)?.map((e) => e?.id),
    };
    const res = await openLocker(params);
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
  state.articleActive = [];
  state.hours = [];
  getList();

  state.popoverShow = false;
};
const clear = async () => {
  let arr = [];
  state.listConfig.list.forEach((item) => {
    if (item.check) arr.push(item.id);
  });
  console.log(arr);
  let res = await clearBookcase({ ids: arr });

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
  // queryList();
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
</script>

<style lang="less">
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
  height: 100%;
}
.bookCaseM {
  height: 100%;
}
.bookCase {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 750px;
  .boxInfo {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    background: #f7f7f7;
    .boxNum {
      font-weight: 600;
      font-size: 16px;
      color: #222222;
      margin-right: 30px;
    }
    .showNum {
      flex: 1;
      font-weight: 400;
      font-size: 12px;
      color: #000000;
      display: flex;
      span {
        margin-right: 30px;
      }
    }
  }
  .filterCon {
    padding: 6px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
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
    padding-bottom: 24px;
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

  .typeInfo {
    padding: 15px 0;
    display: flex;
    .lockerNum {
      font-weight: 500;
      font-size: 16px;
      color: rgba(51, 51, 51, 0.898);
    }
    .lockerStatus {
      margin-right: 15px;
      align-self: center;
    }
    .lockerInfo {
      flex: 1;
      padding: 0 25px 0 15px;
      .lockerTitle {
        font-weight: 400;
        font-size: 14px;
        color: rgba(51, 51, 51, 0.898);
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
      align-self: center;
      font-size: 12px;
      color: #e58100;
      &.type1 {
        color: #979797;
      }
      &.type5 {
        color: #ff5d5d;
      }
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
</style>
