<template>
  <div class="seminar">
    <van-pull-refresh
      v-if="systemMode == 'mobile'"
      v-model="loading"
      @refresh="onRefresh"
    >
      <div class="seminar_bottom">
        <div v-if="state.list.length != 0" class="contract_list">
          <div
            class="item"
            v-for="(item, index) in state.list"
            :key="index"
            @click="handleList(item)"
          >
            <div class="item_left">
              <div class="top">
                <!-- <img src="@/assets/common/horn-icon.svg" alt="" /> -->
                <span class="title_item">{{ item.title }}</span>
              </div>
              <div class="bottom">
                <!-- <van-icon
                  name="clock"
                  style="color: #e2e2e2; margin-right: 5px"
                /> -->
                {{ item.create_time }}
              </div>
            </div>
          </div>
        </div>
        <div style="height: 100%" v-else>
          <a-empty style="padding-top: 15%" />
        </div>
      </div>
    </van-pull-refresh>

    <div v-else class="noticePc">
      <div class="menu">
        <div class="menu-title">公告列表</div>
        <a-menu
          mode="vertical"
          :selectedKeys="[selectedKey]"
          @select="onSelect"
        >
          <template v-for="(item, index) in state.list" :key="item?.id">
            <div>
              <a-menu-item :key="item?.id">
                <div class="menu-item-content">
                  <span>{{ item?.title }}</span>
                  <a-radio
                    :checked="selectedKey === item.id"
                    @click.stop
                  ></a-radio>
                </div>
              </a-menu-item>
            </div>

            <a-menu-divider
              v-if="(index + 1) % 2 === 0 && index !== state.list.length - 1"
            />
          </template>
        </a-menu>
      </div>

      <div class="display-area">
        <template v-if="selectedKey">
          <div class="htmlCon" v-html="state.noticeInfo?.content"></div>
        </template>
        <template v-else>
          <div class="empty-state">
            <!-- <img
              src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
              alt="Empty state illustration"
            /> -->
            <p>请选择左侧"公告列表"</p>
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- :placement="systemMode == 'pc' ? 'right' : 'bottom'" -->

  <a-drawer
    :title="state.noticeInfo?.title"
    placement="bottom"
    :open="state.noticeShow"
    height="100%"
    width="50%"
    @close="state.noticeShow = false"
  >
    <div class="noticeInfo" :style="{ padding: systemMode == 'pc' ? '0' : '' }">
      <div class="htmlCon" v-html="state.noticeInfo?.content"></div>
    </div>
  </a-drawer>
</template>
<script setup>
import { Toast, Dialog } from "vant";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { ref, reactive, onMounted, computed } from "vue";
import { getNotice, getNoticeInfo } from "@/request";

const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const loading = ref(false);
const selectedKey = ref("");

const router = useRouter();
const route = useRoute();
const state = reactive({
  list: [],
  noticeShow: false,
  placement: "bottom",

  noticeInfo: {},
});
const onRefresh = () => {
  noticeList();
};
onMounted(() => {
  noticeList();
});
// 公告通知
const noticeList = async () => {
  try {
    let params = {
      limit: 999,
      page: 1,
    };
    const res = await getNotice(params);
    loading.value = false;
    state.list = res.data.data;

    if (route?.query?.id) {
      selectedKey.value = route?.query?.id;
      fetchNoticeInfo(route?.query?.id);
    }
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

const handleList = async (item) => {
  //   router.push(`/announDetail?id=${item.id}`);
  fetchNoticeInfo(item?.id);
};

const fetchNoticeInfo = async (id) => {
  try {
    let params = {
      id,
    };
    const res = await getNoticeInfo(params);
    state.noticeInfo = res?.data;

    if (systemMode?.value == "mobile") {
      state.noticeShow = true;
    }
  } catch (e) {
    console.log(e);
  }
};

const onSelect = ({ item, key }) => {
  selectedKey.value = key;
  fetchNoticeInfo(key);

  //   state.noticeInfo = state.list?.find((e) => e?.id == key);
  // console.log(item);
};
</script>
<style lang="less" scoped>
::v-deep.van-pull-refresh {
  height: 100%;
  overflow: auto;
}
.seminar {
  width: 100%;
  height: 100%;
  background: #fafafa;
  .item_left {
    .top {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
      color: #333333;
      > img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .title_item {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .seminar_bottom {
    margin: 0 auto;
    max-width: 1200px;
    padding: 15px 20px;
    box-sizing: border-box;
  }
  .seminar_empty {
    height: calc(100% - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.contract_list {
  .item {
    cursor: pointer;
    margin-bottom: 15px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 89px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
    .item_left {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      .top {
        width: 100%;
        height: 21px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-bottom: 10px;
      }
      .bottom {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        white-space: normal;
      }
    }
    .item_right {
      width: 100px;
      flex-shrink: 0;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff5d5d;
      text-align: right;
    }
    .item_right_button {
      min-width: 84px;
      padding: 0 6px;
      height: 32px;
      background: #ff5d5d;
      border-radius: 16px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.noticeInfo {
  padding: 12px;
  height: 100%;
  color: #202020;
}

.noticePc {
  height: 100%;
  display: flex;
  background-color: #fff;
  overflow: hidden;
}

.menu {
  width: 350px;
  border-right: 1px solid #f0f0f0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu-title {
  background-color: #f7f9fb;
  color: #4c687b;
  font-size: 16px;
  font-weight: normal;
  padding: 15px 20px;
  margin: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.menu-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.display-area {
  flex: 1;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .htmlCon {
    height: 100%;
    overflow: auto;
  }
}

.empty-state {
  text-align: center;
}

.empty-state img {
  width: 200px;
  margin-bottom: 20px;
}

.empty-state p {
  color: #999;
}

/* :deep(.ant-menu-item:first-child) {
  margin-top: 8px;
}

:deep(.ant-menu-item:last-child) {
  margin-bottom: 8px;
} */
:deep(.ant-menu) {
  overflow: auto;
}
:deep(.ant-menu-item) {
  height: auto;
  line-height: 1.5;
  padding: 12px 16px;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 14px;
  color: black;
}
:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff !important;
}

:deep(.ant-menu-item:hover) {
  background-color: #f0f0f0;
}

:deep(.ant-radio-wrapper) {
  margin-right: 0;
}
</style>
