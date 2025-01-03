<route>
    {
      meta: {
        showHead: false,
        showLeftBack:false,
        title:'menu_home',
        showTabbar:true
      }
    }
</route>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import { getHelpList } from "@/request/my";
import RightArrowIcon from "@/assets/mobile_help_arrow_right.svg";

const state = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  menuItems: [],

  refreshing: false,
  loading: false,
  finished: true,
  showItemDetails: false,
  itemDetails: "",
});

onMounted(() => {
  onRefresh();
});

const fetchHelpList = async () => {
  try {
    let params = {
      limit: state.pageSize,
      page: state.page,
    };
    const res = await getHelpList(params);
    state.loading = false;
    state.refreshing = false;
    if (res.code === 0) {
      if (state.page === 1) {
        state.menuItems = res.data?.data || [];
      } else {
        state.menuItems.push(...res.data?.data);
      }
      state.total = res.data?.total || 0;
      state.finished = res.data?.current_page >= res.data?.last_page || true;
    } else {
      state.menuItems = [];
      state.total = 0;
      state.finished = true;
    }
  } catch (e) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.menuItems = [];
    state.total = 0;
    console.log(e);
  }
};

const onRefresh = () => {
  state.page = 1;
  fetchHelpList();
};

const onLoad = () => {
  state.page++;
  fetchHelpList();
};

const onItemClick = (item) => {
  state.showItemDetails = true;
  state.itemDetails = item?.content;
};
</script>
<template>
  <div class="help">
    <div class="refreshCon">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-if="state.menuItems.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="$t('No_more')"
          @load="onLoad"
        >
          <div
            v-for="item in state.menuItems"
            :key="item.id"
            @click="onItemClick(item)"
          >
            <a-flex vertical>
              <a-flex justify="space-between" align="center" class="item">
                <span>{{ item.title }}</span>
                <van-image :src="RightArrowIcon" alt="" />
              </a-flex>
              <a-divider />
            </a-flex>
          </div>
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>

    <van-popup
      v-model:show="state.showItemDetails"
      position="bottom"
      :style="{ height: '100%' }"
      destroy-on-close
    >
      <div class="libraryPop">
        <div class="htmlCon" v-html="state.itemDetails"></div>
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
.help {
  height: 100%;
  background-color: #fafafa;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .refreshCon {
    flex: 1;
    .van-pull-refresh {
      height: 100%;
    }
  }

  .item {
    background-color: #fff;
    padding: 10px 16px;
  }
}

.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  .htmlCon {
    height: 100%;
    overflow: auto;
  }
  .bottomAction {
    flex: 1;
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
:deep(.ant-divider-horizontal) {
  margin: 0 !important;
}
</style>
