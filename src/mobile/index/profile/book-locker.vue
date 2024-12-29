<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Bookcase_Appointment_Record',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getBookLockerList } from "@/request/book-locker";
import { getUserInfo } from "@/utils";
import { message } from "ant-design-vue";

import BookLockerDetails from "@/mobile/index/profile/book-locker-details.vue";

const router = useRouter();
const state = reactive({
  userInfo: getUserInfo(),
  activeKey: "14",
  activeKeyList: [
    { value: "14", label: "日柜" },
    { value: "15", label: "周柜" },
    { value: "16", label: "长期柜" },
  ],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],

  quickMode: 1,
  quickModeList: [
    { value: 1, label: "visitor_Reservation_List" },
    { value: 0, label: "违约记录" },
  ],

  refreshing: false,
  loading: false,
  finished: true,
  showItemDetails: false,
  itemDetails: {},
});

watch(
  () => [state.activeKey, state.quickMode],
  () => {
    state.currentPage = 1;
    fetchGetBookLocker();
  }
);

onMounted(() => {
  fetchGetBookLocker();
});

const fetchGetBookLocker = async () => {
  try {
    let params = {
      type: state.activeKey,
      isOrder: state.quickMode,
      page: state.currentPage,
      size: state.pageSize,
    };
    state.loading = false;
    state.refreshing = false;
    const res = await getBookLockerList(params);
    if (res.code === 1) {
      if (state.currentPage === 1) {
        state.data = res?.data?.list || [];
      } else {
        state.data.push(...res?.data?.list);
      }
      state.total = res?.data?.count || 0;
      state.finished = state.currentPage >= res?.data?.totalPage;
    } else {
      state.data = [];
      state.total = 0;
      state.finished = true;
      message.error(res.msg);
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
    console.log(error);
  }
};

onMounted(() => {
  fetchGetBookLocker();
});

const onRefresh = () => {
  state.currentPage = 1;
  fetchGetBookLocker();
};
const onLoad = () => {
  state.currentPage++;
  fetchGetBookLocker();
};

const onClickItem = (item) => {
  state.showItemDetails = true;

  state.itemDetails = item;
  console.log(state.itemDetails);
};
</script>
<template>
  <div
    class="book-locker"
  >
    <div class="cHeader">
      <div class="quickMode">
        <div
          v-for="item in state.activeKeyList"
          :key="item.label"
          class="item activeBtn"
          :class="{ itemActive: item?.value == state.activeKey }"
          @click="state.activeKey = item?.value"
        >
          {{ $t(item?.label) ? $t(item?.label) : item?.label }}
        </div>
      </div>
    </div>

    <div class="quickBtns" style="width: 220px; margin: 10px 10px">
      <div
        v-for="item in state.quickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        @click="state.quickMode = item?.value"
      >
        {{ $t(item?.label) ? $t(item?.label) : item?.label }}
      </div>
    </div>

    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-if="state.data.length > 0"
        v-model:loading="state.loading"
        :finished="state.finished"
        :finished-text="$t('No_more')"
        @load="onLoad"
      >
        <div
          class="item_list"
          v-for="item in state.data"
          :key="item.id"
          @click="onClickItem(item)"
        >
          <div class="info_item margin_bottom">
            <img
              src="@/assets/my/mobile_lostAndFound_item_location.svg"
              alt="Location"
            />
            <span>{{ item.nameMerge }}</span>
          </div>
          <div class="info_item">
            <img src="@/assets/event/time.svg" alt="Time" />
            <span v-if="state.quickMode == 1"
              >{{ item.beginTime }} - {{ item.endTime }}</span
            >
            <span v-else>{{ item.time }}</span>

            <div v-if="item.statusMsg == '预约成功'">
              <a-button type="primary" shape="round" size="small" block
                >{{ $t("cancel") }}</a-button
              >
            </div>
          </div>

          <div
            class="rightBadge basicsBadge"
            :class="{
              status_success: item.statusMsg === '预约成功',
              status_cancel: item.statusMsg === '已取消',
              status_in_progress: item.statusMsg === '使用中',
              status_end: item.statusMsg === '已结束',
            }"
          >
            {{ item.statusMsg }}
          </div>
        </div>
      </van-list>
      <a-empty v-else />
    </van-pull-refresh>

    <van-popup
      v-model:show="state.showItemDetails"
      position="bottom"
      :style="{ height: '100%' }"
      destroy-on-close
    >
      <div class="libraryPop">
        <BookLockerDetails :data="state.itemDetails" />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.showItemDetails = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            {{ $t("Return") }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.book-locker {
  height: 100%;
  overflow: auto;
  background-color: #fafafa;

  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
  }
  .quickMode {
    display: flex;
    gap: 20px;
    .item {
      padding-bottom: 10px;
      font-size: 15px;
      color: #616161;

      &.itemActive {
        color: #202020;
        border-bottom: 2px solid #1a49c0;
      }
    }
  }
  .item_list {
    position: relative;
    margin: 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    .info_item {
      display: flex;
      align-items: flex-start;

      img {
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
      span {
        flex: 8;
        flex-wrap: wrap;
        font-size: 13px;
        color: rgba(32, 32, 32, 1);
      }
      div {
        align-self: flex-end;

        flex: 2;
      }
    }
    .margin_bottom {
      margin-bottom: 16px;
    }
    .rightBadge {
      position: absolute;
      right: 0;
      top: 0;
    }
    .basicsBadge {
      padding: 3px 8px;
      border-radius: 0px 6px 0px 6px;
      font-size: 10px;
    }
    .status_success {
      background: rgba(238, 250, 239, 1);
      color: rgba(78, 201, 91, 1);
    }
    .status_cancel .status_end {
      background: rgba(243, 243, 243, 1);
      color: rgba(174, 174, 174, 1);
    }
    .status_in_progress {
      background: rgba(233, 239, 252, 1);
      color: rgba(31, 86, 225, 1);
    }
  }
}

.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  :deep(.area-record-details) {
    flex: 1;
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

:deep(.van-pull-refresh) {
  min-height: 90vh !important;
}

:deep(.ant-btn-sm) {
  font-size: 12px !important;
}
</style>
