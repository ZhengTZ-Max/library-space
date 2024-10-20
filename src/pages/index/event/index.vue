<script setup>
import { reactive, onMounted, watch, ref } from "vue";
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
  eventList: [],
  activeIndex: "",
  eventStatus: "",
  quickMode: 1,
  quickModeList: [
    { value: 1, label: "当前活动" },
    { value: 0, label: "历史活动" },
  ],
  date: moment().format("YYYY-MM-DD"),
  selectDate: null,
  selectType: "",
  selectDateList: [
    { value: "2024-01-02", label: "01-02" },
    { value: "2024-01-03", label: "01-03" },
    { value: "2024-01-04", label: "01-04" },
  ],
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
    };
    let res = await getCurrentEventList(params);

    if (res.code != 0) {
      return false;
    }

    state.eventList =
      res.data?.list && res.data.list.length > 0
        ? res.data.list
        : getDefaultList();
    console.log(state.eventList);
  } catch (e) {}
};

const getDefaultList = () => {
  return [
    {
      id: "74", //区域id
      name: "602研究室", //区域名称
      enname: "602 Room", //英文
      minPerson: "6", //最少人数
      maxPerson: "20", //最多人数
      firstimg: "/home/images/first/area/74/9.jpg", //首图
      storey_name: "六层", //楼层名称
      storey_en_name: "6F", //英文
      top_name: "图书馆", //馆舍名称
      top_en_name: "SKE Library", //英文
      boutiques: [
        {
          id: "4", //特征id
          name: "电视", //特征名称
          icon: null, //特征图标
          enname: "TV", //英文
        },
        {
          id: "5", //特征id
          name: "投影仪", //特征名称
          icon: null, //特征图标
          enname: "projector", //英文
        },
      ], //特征
      categorys: [
        {
          id: "12", //类型id
          name: "活动", //类型名称
          enname: "Activity", //英文
        },
        {
          id: "13", //类型id
          name: "展览", //类型名称
          enname: "put on display", //英文
        },
      ], //类型
    },
    {
      id: "75", //区域id
      name: "602研究室", //区域名称
      enname: "602 Room", //英文
      minPerson: "6", //最少人数
      maxPerson: "20", //最多人数
      firstimg: "/home/images/first/area/74/9.jpg", //首图
      storey_name: "六层", //楼层名称
      storey_en_name: "6F", //英文
      top_name: "图书馆", //馆舍名称
      top_en_name: "SKE Library", //英文
      boutiques: [
        {
          id: "4", //特征id
          name: "电视", //特征名称
          icon: null, //特征图标
          enname: "TV", //英文
        },
        {
          id: "5", //特征id
          name: "投影仪", //特征名称
          icon: null, //特征图标
          enname: "projector", //英文
        },
      ], //特征
      categorys: [
        {
          id: "12", //类型id
          name: "活动", //类型名称
          enname: "Activity", //英文
        },
        {
          id: "13", //类型id
          name: "展览", //类型名称
          enname: "put on display", //英文
        },
      ], //类型
    },
  ];
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
                <img class="cardItemImg" :src="item?.firstImg" alt="" />
                <div
                  class="leftBadge basicsBadge"
                  :class="{ leftBadgeActive: state?.eventStatus }"
                >
                  报名中
                </div>

                <div class="posBot">
                  <span>- {{ filterBoutique(item?.categorys) }} -</span>
                </div>
              </div>
              <div class="bottomItem">
                <span class="event-title">PS入门培训 - 设计与校园海报</span>
                <div class="event-location">
                  <img src="@/assets/event/seat.svg" alt="Location" />
                  <span
                    >{{ item?.top_name }}-{{ item?.storey_en_name }}-{{
                      item?.name
                    }}
                  </span>
                </div>
                <div class="event-time">
                  <img src="@/assets/event/time.svg" alt="Time" />
                  <div class="timeList">
                    <span
                      >2024-02-21 ~ 2024-02-23 13:30~15:30, 16:30~17:30</span
                    >
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
    background: #1a49c0;
    border-radius: 6px 0px 6px 0px;
    font-size: 14px;
    color: #ffffff;
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
