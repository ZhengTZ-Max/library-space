<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Facility_Selection',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import moment from "moment";
import { exchangeDateTime } from "@/utils";
import { getSeminarIndex, getSpaceDetail } from "@/request/space";

const store = useStore();
const router = useRouter();
const containerRef = ref();

const state = reactive({
  libraryList: [],
  refreshing: false,
  loading: false,
  finished: true,

  spaceInfo: {},
  spaceInfoShow: false,
});

onMounted(() => {
  fetchGetSpaceListInfo();
});

const onRefresh = () => {
  fetchGetSpaceListInfo();
};
const onLoad = () => {};

const fetchGetSpaceListInfo = async () => {
  try {
    let params = {
      day: moment().format("YYYY-MM-DD"),
    };
    const res = await getSeminarIndex(params);
    state.refreshing = false;
    state.loading = false;
    state.finished = true;

    if (res.code != 0) {
      state.libraryList = [];
      return false;
    }
    state.libraryList = res.data || [];
  } catch (error) {
    state.refreshing = false;
    state.loading = false;
    state.finished = true;
    state.libraryList = [];
    console.log(error);
  }
};

const goToLink = (item) => {
    router.push({
    path: "/mo/space/space",
    query: { id: item?.id },
  });
};

const handleShowInfo = (item) => {

};
</script>
<template>
  <div class="space_mobile">
    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="librarySlt">
          <a-row v-if="state.libraryList?.length" :gutter="[12, 20]">
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

                      <div class="bottomItem">
                        <div class="num">
                          <span>空间总数{{ item?.total || "-" }}</span>
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
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<style lang="less" scoped>
.space_mobile {
  height: 100%;
  background-color: #fafafa;

  .librarySlt {
    width: 100%;
    margin: 38px 0 50px 0;
    padding: 0 12px;
    // .ant-row {
    //   margin: 0 12px !important;
    // }
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
}

// :deep(.van-pull-refresh) {
//   height: 70% !important;
// }
</style>
