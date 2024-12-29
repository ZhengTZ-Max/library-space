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
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import {
  getActivityFilterIndex,
  getApplicationList,
  getActivityDetail,
} from "@/request/activity_application";
import EventFilter from "@/components/EventFilterCom.vue";
import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceRuleConfirm from "@/components/SpaceSeat/SpaceRuleConfirm.vue";

const router = useRouter();
const store = useStore();
const rules = computed(() => store.state.rules);

const state = reactive({
  boutiques: [{ name: "电视" }, { name: "投影仪" }],

  filterShow: false,
  refreshing: false,
  loading: false,
  finished: true,

  filterOptions: {},
  filterSearch: {
    premiseID: [],
    categoryID: [],
    date: [],
  },
  activityInfo: {},
  activityInfoShow: false,
  applicationList: [],

  ruleShow: false,
  ruleInfo: { content: "" },
});

onMounted(() => {
  fetchGetApplicationIndex();
});

const onRefresh = () => {
  fetchGetApplicationList();
};

const fetchGetApplicationIndex = async () => {
  try {
    let res = await getActivityFilterIndex();
    if (res.code != 0) {
      state.filterOptions = {};
      return;
    }
    state.filterOptions = {
      ...res?.data,
      premise: res?.data?.premises || [],
      showDate: false,
    };
    console.log(state.filterOptions);
    fetchGetApplicationList();
  } catch (e) {
    state.filterOptions = {};
    console.log(e);
  }
};

const fetchGetApplicationList = async () => {
  try {
    let params = {
      premises: state.filterSearch.premiseID,
      category: state.filterSearch.categoryID,
    };
    let res = await getApplicationList(params);
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    if (res.code == 0) {
      state.applicationList = res.data?.data;
      // console.log(state.eventImg);
    } else {
      state.applicationList = [];
    }
  } catch (e) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.applicationList = [];
    console.log(e);
  }
};

const fetchInfo = async (id) => {
  try {
    let params = {
      id,
    };
    let res = await getActivityDetail(params);
    if (res.code != 0) {
      state.activityInfo = {};
      return;
    }
    state.activityInfo = { ...res?.data, type: "activity" } || {};
    state.activityInfoShow = true;
    console.log(state.activityInfo);
  } catch (e) {
    console.log(e);
  }
};

const filterCategorys = (list) => {
  let newList = list?.map((e) => e?.name);
  return newList?.join("/") || "";
};
const handleFilter = () => {
  state.filterShow = false;
  console.log(state.filterSearch);
  fetchGetApplicationList();
};
const handleShowInfo = (item) => {
  fetchInfo(item.id);
};

const onApply = (id) => {
  state.activityInfoShow = false;
  router.push({
    path: "/mo/activity_application/apply",
    query: { id },
  });
};

const onShowRule = () => {
  state.ruleShow = true;
  let { activity_rule, activity_rule_en } = rules?.value;
  state.ruleInfo.content = activity_rule;
};
</script>
<template>
  <div class="activity_application_mobile">
    <div class="top_tabs">
      <div class="left_title" @click="onShowRule">查看申请须知 ></div>
      <div @click="state.filterShow = true">
        <img src="@/assets/event/mobile_event_filter.svg" alt="filter" />
      </div>
    </div>

    <div class="refreshCon">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-if="state.applicationList.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="$t('No_more')"
          @load="onLoad"
        >
          <div
            v-if="state.applicationList.length"
            v-for="item in state.applicationList"
            :key="item?.id"
            class="item"
          >
            <van-row>
              <van-col span="9" class="img_col">
                <a-image
                  style="width: 100px; height: 100px; border-radius: 10px"
                  :src="item?.firstImg"
                  :preview="false"
                />
                <div class="basicsBadge" :class="{ greenBadge: false }">
                  {{ item?.top_name }}
                </div>
                <div class="posBot">
                  - {{ filterCategorys(item?.categorys) }} -
                </div>
              </van-col>
              <van-col span="15" class="right_info">
                <div class="title">
                  <span>{{ item?.name }}</span>
                  <span>{{ item?.storey_name }}</span>
                </div>

                <a-flex class="vertical_scroll">
                  <div
                    class="boutiqueList"
                    v-for="bout in item?.boutiques"
                    :key="bout?.id"
                  >
                    {{ bout.name }}
                  </div>
                </a-flex>
                <div class="num">
                  <span>{{ $t('Capacity_Capacity') }}</span>
                  <span>{{ item?.minPerson }} ~ {{ item?.maxPerson }} {{ $t('People') }}</span>
                </div>

                <div class="action">
                  <span @click="handleShowInfo(item)">{{ $t('V4_view_details') }} ></span>

                  <van-button
                    plain
                    type="primary"
                    color="#1a49c0"
                    round
                    size="mini"
                    style="padding: 4px 15px; font-size: 12px"
                    @click="onApply(item?.id)"
                    >{{ $t('V4_apply') }}</van-button
                  >
                </div>
              </van-col>
            </van-row>
          </div>
          <a-empty class="empty" v-else />
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>

    <van-popup
      v-model:show="state.filterShow"
      position="bottom"
      :style="{ height: '50%' }"
      destroy-on-close
    >
      <div class="drawerCon">
        <EventFilter
          style="flex: 1"
          v-if="state.filterOptions?.premise?.length"
          :data="state.filterOptions"
          :initSearch="state.filterSearch"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.filterShow = false"
          >
            {{ $t('cancel') }}
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >{{ $t('visitor_Confirm') }}</van-button
          >
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model:show="state.activityInfoShow"
      position="bottom"
      :style="{ height: '100%' }"
      destroy-on-close
    >
      <div class="libraryPop">
        <LibraryInfo v-if="state.activityInfo?.id" :data="state.activityInfo" />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.activityInfoShow = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            {{ $t('Return') }}
          </van-button>
          <van-button
            round
            block
            type="primary"
            @click="onApply(state.activityInfo?.id)"
            >{{ $t('visitor_Reservation') }}</van-button
          >
        </div>
      </div>
    </van-popup>

    <SpaceRuleConfirm
      v-if="state.ruleShow"
      v-model:open="state.ruleShow"
      :content="state.ruleInfo?.content"
      title="预约规则"
      @onConfirm="state.ruleShow = false"
      :review="true"
    >
    </SpaceRuleConfirm>
  </div>
</template>
<style lang="less" scoped>
.activity_application_mobile {
  height: 100%;
  background-color: #fafafa;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .top_tabs {
    padding: 15px 16px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left_title {
      font-size: 15px;
      color: rgba(26, 73, 192, 1);
      // font-family: AliHeavy !important;
      font-weight: bold;
    }
  }

  .empty {
    padding-top: 100px;
  }

  .item {
    margin-left: 16px;
    margin-right: 16px;
    background-color: #fff;
    padding: 16px;
    margin-top: 10px;
    border-radius: 10px;
    .img_col {
      height: 100px;
      position: relative;
      .basicsBadge {
        position: absolute;
        top: 0;
        left: 0;
        padding: 3px 8px;
        background: #1a49c0;
        border-radius: 6px 0px 6px 0px;
        font-size: 12px;
        color: #ffffff;
      }

      .posBot {
        position: absolute;
        bottom: 10px;
        left: 0;
        display: flex;
        width: 90%;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 1);
        font-size: 12px;
      }
    }
    .right_info {
      padding: 0 0 5px 0;

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
        font-size: 12px;
        color: rgba(97, 97, 97, 1);
        display: flex;
        align-items: center;
        span {
          &:nth-child(2) {
            font-size: 14px;
            color: rgba(32, 32, 32, 1);
          }
        }
      }
      .vertical_scroll {
        overflow-x: auto;
        white-space: nowrap;
        margin-top: 10px;
        /* 设置滚动条样式 */
        &::-webkit-scrollbar {
          height: 4px; /* 设置滚动条的高度 */
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(97, 97, 97, 0.05); /* 设置滚动条的颜色 */
          border-radius: 10px; /* 设置滚动条的圆角 */
        }

        &::-webkit-scrollbar-track {
          background: transparent; /* 设置滚动条轨道的颜色 */
        }

        /* Firefox 的滚动条样式 */
        scrollbar-width: thin; /* 滚动条的宽度 */
        scrollbar-color: rgba(97, 97, 97, 0.05) transparent; /* 滚动条的颜色和轨道的颜色 */
        .boutiqueList {
          border: 1px solid #f28800;
          font-size: 10px;
          color: rgba(242, 136, 0, 1);
          padding: 1px 4px;
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
      .action {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 12px;
          color: rgba(134, 134, 134, 1);
        }
      }
    }
  }

  .filterDrawer {
    padding: 22px;
  }
}
.drawerCon {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bottomAct {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  & button {
    &:nth-child(1) {
      margin-right: 12px;
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

.refreshCon {
  flex: 1;
  .van-pull-refresh {
    height: 100%;
  }
}
</style>
