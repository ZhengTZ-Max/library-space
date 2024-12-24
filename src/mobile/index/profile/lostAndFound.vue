<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'user_myrenege',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const state = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],

  refreshing: false,
  loading: false,
  finished: true,
});

onMounted(() => {
  fetch();
});

const onRefresh = () => {
  state.currentPage = 1;
  fetch();
};
const onLoad = () => {
  state.currentPage++;
  fetch();
};

const fetch = async () => {
  try {
    state.loading = false;
    state.refreshing = false;

    state.total = 0;
    state.data = [];
    state.finished = true;
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
    console.log(error);
  }
};
const onClickItem = (item) => {
  console.log(item.id);
};
</script>
<template>
  <div class="lostAndFound">
    <div class="item">
      <van-image
        class="img"
        radius="6px"
        src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
        alt="Empty state illustration"
      />
      <div class="info">
        <div class="info_item">
          <img
            src="@/assets/my/mobile_lostAndFound_item_location.svg"
            alt="Location"
          />
          <span>失物招领</span>
        </div>
        <div class="info_item">
          <img src="@/assets/event/time.svg" alt="Time" />
          <span>2024-02-05 09:57:00</span>
        </div>
      </div>
    </div>
    <div class="refreshCon">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-if="state.data.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="item"
            v-for="item in state.data"
            :key="item?.id"
            @click="onClickItem(item)"
          >
            <van-image
              class="img"
              radius="6px"
              src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
              alt="Empty state illustration"
            />
            <div class="info">
              <div class="info_item">
                <img
                  src="@/assets/my/mobile_lostAndFound_item_location.svg"
                  alt="Location"
                />
                <span>失物招领</span>
              </div>
              <div class="info_item">
                <img src="@/assets/event/time.svg" alt="Time" />
                <span>2024-02-05 09:57:00</span>
              </div>
            </div>
          </div>
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<style lang="less" scoped>
.lostAndFound {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: rgba(250, 250, 250, 1);
  overflow: auto;
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    width: 100%;
    padding: 16px;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 16px;
    .img {
      flex: 1;
    }
    .info {
      flex: 2;
      padding-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .info_item {
        display: flex;
        align-items: center;
        img {
          margin-right: 8px;
          width: 16px;
          height: 16px;
        }
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
