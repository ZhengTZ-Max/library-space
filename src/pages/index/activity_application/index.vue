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

const router = useRouter();
const state = reactive({
  activeIndex: "",
  spaceList: [
    {
      id: "1",
      name: "空间1",
      typeName: "图书馆",
      boutique: [
        { name: "投影仪", id: "1" },
        { name: "电脑", id: "2" },
        { name: "WIFI开放", id: "3" },
      ],
      firstImg:
        "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    },
    {
      id: "2",
      name: "空间2",
      typeName: "图书馆",
      boutique: [
        { name: "投影仪", id: "1" },
        { name: "电脑", id: "2" },
        { name: "WIFI开放", id: "3" },
      ],
      firstImg:
        "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    },
    {
      id: "3",
      name: "空间3",
      typeName: "图书馆",
      boutique: [
        { name: "投影仪", id: "1" },
        { name: "电脑", id: "2" },
        { name: "WIFI开放", id: "3" },
      ],
      firstImg:
        "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    },
    {
      id: "4",
      name: "空间4",
      typeName: "图书馆",
      boutique: [
        { name: "投影仪", id: "1" },
        { name: "电脑", id: "2" },
        { name: "WIFI开放", id: "3" },
      ],
      firstImg:
        "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    },
    {
      id: "5",
      name: "空间5",
      typeName: "图书馆",
      boutique: [
        { name: "投影仪", id: "1" },
        { name: "电脑", id: "2" },
        { name: "WIFI开放", id: "3" },
      ],
      firstImg:
        "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    },
    {
      id: "6",
      name: "空间6",
      typeName: "图书馆",
      boutique: [
        { name: "投影仪", id: "1" },
        { name: "电脑", id: "2" },
        { name: "WIFI开放", id: "3" },
      ],
      firstImg:
        "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    },
  ],

  filterOptions: {},
  filterSearch: {
    premiseID: [],
    categoryID: [],
    date: [],
  },
  nodeShow: false,
  filterShow: false,
  applicationList: [],
  activityInfo: {},
  activityInfoShow: false,
});

const onChangeAct = (i) => {
  state.activeIndex = i.id;
};

onMounted(() => {
  fetchGetApplicationIndex();
});

const handleFilter = () => {
  state.filterShow = false;
};

const fetchGetApplicationIndex = async () => {
  try {
    let res = await getActivityFilterIndex();
    if (res.code != 0) return;
    state.filterOptions = {
      ...res?.data,
      premise: res?.data?.premises || [],
      showDate: false,
    };
    console.log(state.filterOptions);
    fetchGetApplicationList();
  } catch (e) {}
};
const fetchGetApplicationList = async () => {
  try {
    let params = {
      premises: state.filterSearch.premiseID,
      category: state.filterSearch.categoryID,
    };
    let res = await getApplicationList(params);

    if (res.code == 0) {
      state.applicationList = res.data?.data;
      // console.log(state.eventImg);
    }
  } catch (e) {}
};

const fetchInfo = async (id) => {
  try {
    let params = {
      id,
    };
    let res = await getActivityDetail(params);
    if (res.code != 0) return;
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
const handleShowInfo = (item) => {
  fetchInfo(item.id);
};

const handleAppt = (row) => {
  router.push({
    path: "/activity_application/apply",
    query: {
      id: row?.id,
    },
  });
  console.log(row);
};


</script>
<template>
  <div class="activity-application">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item
              >选择空间<img src="@/assets/seat/titRightIcon.svg" alt=""
            /></a-breadcrumb-item>
            <!-- <a-breadcrumb-item>1</a-breadcrumb-item> -->
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="filters activeBtn" @click="state.nodeShow = true">
            <img src="@/assets/activity_application/node.svg" alt="" />
            申请须知
          </div>
          <div class="filters activeBtn" @click="state.filterShow = true">
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            筛选
          </div>
        </div>
      </div>
    </a-affix>
    <div class="content">
      <a-row v-if="state.applicationList?.length" :gutter="[40, 80]">
        <template v-for="item in state.applicationList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
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
                <div class="leftBadge basicsBadge">{{ item?.top_name }}</div>
                <div
                  class="rightBadge viewMore clickBox"
                  @click.stop="handleShowInfo(item)"
                >
                  <span> 查看详情 </span>
                  <img src="@/assets/home/rightIconW.svg" alt="" />
                </div>
                <div class="posBot">
                  <span>- {{ filterCategorys(item?.categorys) }} -</span>
                </div>
              </div>
              <div class="bottomItem">
                <div class="title">
                  <span>{{ item?.name }}</span>
                  <span>{{ item?.storey_name }}</span>
                </div>
                <div class="num">
                  <span>可容纳人数</span>
                  <span>{{ item?.minPerson }} ~ {{ item?.maxPerson }} 人</span>
                </div>
                <div class="boutique">
                  <div class="boutiqueList" v-for="bout in item?.boutiques">
                    {{ bout.name }}
                  </div>
                </div>
              </div>
              <div
                v-if="item?.id == state.activeIndex"
                class="action clickBoxT"
                @click="handleAppt(item)"
              >
                立即申请
              </div>
            </div>
          </a-col>
        </template>
      </a-row>
    </div>

    <a-modal
      width="50%"
      v-model:open="state.filterShow"
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

    <a-modal
      width="40%"
      v-model:open="state.activityInfoShow"
      title="空间详情"
      @ok="handleAppt(state.activityInfo)"
      destroyOnClose
      okText="申请"
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
      <LibraryInfo v-if="state.activityInfo?.id" :data="state.activityInfo" />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.activity-application {
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
  .content {
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
        margin-bottom: 12px;
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
        color: rgba(97, 97, 97, 1);
        display: flex;
        align-items: center;
        span {
          &:nth-child(2) {
            font-size: 16px;
            color: rgba(32, 32, 32, 1);
          }
        }
      }
      .boutique {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        .boutiqueList {
          border: 1px solid #f28800;
          font-size: 12px;
          color: rgba(242, 136, 0, 1);
          padding: 2px 6px;
          margin-right: 10px;
          margin-bottom: 10px;
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
</style>
