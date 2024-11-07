<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { exchangeDateTime } from "@/utils";
import { getCurrentEventList, getEventFilterIndex } from "@/request/event";
import EventFilter from "@/components/EventFilterCom.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const state = reactive({
  eventFilterShow: false,
  filterOptions: {},
  filterSearch: {
    premiseID: "",
    categoryID: "",
    date: "",
  },
  eventImg: "",
  activeIndex: "",
  eventStatus: "",
  quickMode: 1,
  quickModeList: [
    { value: 1, label: "当前活动" },
    { value: 0, label: "历史活动" },
  ],
  date: moment().format("YYYY-MM-DD"),
  // date: "2024-10-30",
  selectDate: null,
  selectType: "",
  selectDateList: [
    { value: "2024-01-02", label: "01-02" },
    { value: "2024-01-03", label: "01-03" },
    { value: "2024-01-04", label: "01-04" },
  ],
  eventList: [],
});

onMounted(() => {
  fetchGetEventIndex();
});

const onChangeAct = (i) => {
  state.activeIndex = i.id;
};
const filterBoutique = (list) => {
  let newList = list?.map((e) => e?.name);
  return newList?.join("·") || "";
};
const onChangeQDate = (row) => {
  state.quickMode = row?.value;
  fetchCurrentEventList();
};
const handleFilter = () => {
  state.eventFilterShow = false;
  fetchCurrentEventList();
};

const goToLink = (id) => {
  router.push({
    path: "/event/details",
    query: { id },
  });
};
const fetchGetEventIndex = async () => {
  try {
    let res = await getEventFilterIndex();
    state.filterOptions = res?.data;
    fetchCurrentEventList();
  } catch (e) {}
};

const fetchCurrentEventList = async () => {
  try {
    let params = {
      ilk: state.quickMode,
      date: state.date,
      premises: state.filterSearch.premiseID,
      category: state.filterSearch.categoryID,
    };
    let res = await getCurrentEventList(params);

    if (res.code == 0) {
      state.eventList = res.data?.data;
      // console.log(state.eventImg);
    }
  } catch (e) {}
};
</script>
<template>
  <div class="eventLibrary">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item
              >选择活动<img src="@/assets/seat/titRightIcon.svg" alt=""
            /></a-breadcrumb-item>
            <!-- <a-breadcrumb-item>1</a-breadcrumb-item> -->
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="quickMode">
            <div class="quickBtns" style="margin-right: 0px">
              <div
                v-for="item in state.quickModeList"
                :key="item.label"
                class="item activeBtn"
                :class="{ itemActive: item?.value == state.quickMode }"
                @click="onChangeQDate(item)"
              >
                {{ item?.label }}
              </div>
            </div>
          </div>

          <div class="select_radius">
            <a-select v-model:value="state.selectDate" placeholder="选择日期">
              <template v-for="item in state.selectDateList" :key="item?.value">
                <a-select-option value="item?.value">{{
                  item?.value
                }}</a-select-option>
              </template>
            </a-select>
          </div>
          <div class="select_radius marginLeft">
            <a-select
              v-model:value="state.selectDate"
              placeholder="名称/活动类型"
            >
              <template v-for="item in state.selectDateList" :key="item?.value">
                <a-select-option value="item?.value">{{
                  item?.value
                }}</a-select-option>
              </template>
            </a-select>
          </div>

          <div class="filters activeBtn" @click="state.eventFilterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            筛选
          </div>
        </div>
      </div>
    </a-affix>

    <div class="librarySlt">
      <a-row v-if="state.eventList?.length" :gutter="[40, 40]">
        <template v-for="item in state.eventList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="6">
            <div
              class="libraryItem cardItem"
              :class="{ activeItem: item?.id == state.activeIndex }"
              @click="onChangeAct(item)"
            >
              <div class="cardItemImgCon">
                <img
                  class="cardItemImg"
                  :src="item?.poster[0]?.file_path"
                  alt=""
                />
                <div
                  class="leftBadge basicsBadge"
                  :class="{
                    status_not_started: item?.status_name === '未开始',
                    status_in_registration: item?.status_name === '报名中',
                    status_in_progress: item?.status_name === '进行中',
                  }"
                >
                  {{ item?.status_name }}
                </div>

                <div class="posBot">
                  <span>- {{ item?.cate_name }} -</span>
                </div>
              </div>
              <div class="bottomItem">
                <span class="event-title">{{ item?.title }}</span>
                <div class="event-location">
                  <img src="@/assets/event/seat.svg" alt="Location" />
                  <span>{{ item?.nameMerge }}</span>
                </div>
                <div class="event-time">
                  <img src="@/assets/event/time.svg" alt="Time" />
                  <div class="timeList">
                    <span>{{ item?.show_time }}</span>
                  </div>
                </div>
              </div>
              <div
                v-if="item?.id == state.activeIndex"
                class="action clickBoxT"
                @click="goToLink(item?.id)"
              >
                立即报名
              </div>
            </div>
          </a-col>
        </template>
      </a-row>
      <a-empty v-else />
    </div>

    <a-modal
      width="50%"
      v-model:open="state.eventFilterShow"
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
      <EventFilter
        v-if="state.filterOptions?.premise?.length"
        :data="state.filterOptions"
        :initSearch="state.filterSearch"
      />
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.eventLibrary {
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
      .marginLeft {
        margin-left: 10px;
      }
      .select_radius {
        width: 180px;
        padding: 0px 9px;
        background: rgba(243, 239, 239, 0.2);
        border-radius: 21px;
        border: 1px solid #d9d9d9;
        :deep(.ant-select) {
          display: block;
          .ant-select-selector {
            background-color: transparent !important;
            border: none;
            .ant-select-selection-item {
              color: #fff;
              display: flex;
              align-items: center;
            }
          }
          .ant-select-arrow {
            color: #afaaaa;
          }
        }
      }
      .quickMode {
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
}
.librarySlt {
  width: 100%;
  margin: 38px 0 50px 0;
  padding: 0 82px;

  .basicsBadge {
    padding: 3px 8px;
    // background: #1a49c0;
    border-radius: 6px 0px 6px 0px;
    font-size: 14px;
    color: #ffffff;
  }
  .status_not_started {
    background: rgba(174, 174, 174, 1);
  }
  .status_in_registration {
    background: rgba(86, 187, 70, 1);
  }
  .status_in_progress {
    background: rgba(26, 73, 192, 1);
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

    .boutiqueList {
      font-size: 14px;
      color: #868686;
    }
  }

  .event-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .event-location,
  .event-time {
    display: flex;
    align-items: flex-start;

    margin-bottom: 8px;
    margin-top: 4px;
    color: #868686;
    font-size: 13px;
    .timeList {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .event-location img,
  .event-time img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .action {
    position: absolute;
    left: 20px;
    width: calc(100% - 40px);
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
</style>
