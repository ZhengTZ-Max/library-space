<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import { showToast } from "vant";

import { fetchCleanLocker, getLostlockerList } from "@/request/collection";

const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const clearColumns = [
  {
    title: "物品招领柜",
    dataIndex: "name",
  },
  {
    title: "最长收取时间",
    dataIndex: "outTxt",
  },
  {
    title: "类型",
    dataIndex: "type",
  },
];

const props = defineProps({
  clearSelected: {
    type: Array,
  },
  selectedAll: {
    type: Boolean,
  },
});

const emits = defineEmits(["update:clearSelected", "update:selectedAll"]);

const state = reactive({
  clearSearch: {
    library: null,
    type: null,
    hour: "",
  },
  premisesList: [],
  clearList: [],
  selected: [],

  refresh: false,

  longTimeShow: false,
  longTime: "",
});

onMounted(() => {
  fetchList();
  state.selected = props?.clearSelected || [];
});

watch(
  () => props.clearSelected,
  (v) => {
    state.selected = v;
  }
);

watch(
  () => state.selected,
  (v) => {
    state.clearList?.length &&
      emits("update:selectedAll", v?.length == state.clearList?.length);
  },
  {
    deep: true,
  }
);

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    state.selected = selectedRows || [];
    console.log(selectedRows);
    emits("update:clearSelected", selectedRows);
  },
};

const fetchList = async () => {
  try {
    // let res = await getAllArea();
    let params = {
      premisesId: state.clearSearch.library || "",
      isLocked: state.clearSearch.type || "",
      hours: state.clearSearch.hour || "",
    };
    let res = await getLostlockerList(params);
    state.refresh = false;
    state.clearList = res?.data?.list || [];
    state.premisesList = res?.data?.premises || [];
  } catch (e) {
    console.log(e);
  }
};

const onClearList = async () => {
  try {
    let params = {
      ids: state.selected?.map((e) => e?.id),
    };
    const res = await fetchCleanLocker(params);
    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res?.message || res?.msg,
      });
      return false;
    }
    showToast({
      message: res?.message || res?.msg,
    });
    state.selected = [];
    fetchList();
  } catch (e) {
    console.log(e);
  }
};

const onShowArea = () => {};

// 处理选中/取消选中的逻辑
const onSelected = (item) => {
  let selectedList = state.selected || [];
  const index = selectedList.indexOf(item.id);
  if (index === -1) {
    // 如果没有选中该项，添加到选中列表
    selectedList.push(item.id);
  } else {
    // 如果已经选中该项，移除选中列表
    selectedList.splice(index, 1);
  }
  state.selected = selectedList;
};

const onRefresh = () => {
  fetchList();
};
const getClearList = () => {
  return state?.clearList;
};

const onSelectedHour = () => {
  state.clearSearch.hour = state.longTime;
  state.longTimeShow = false;
  fetchList();
};
// 使用 defineExpose 导出方法
defineExpose({
  onClearList,
  getClearList,
});
</script>
<template>
  <div class="clearCon" :class="{ clearConM: systemMode == 'mobile' }">
    <template v-if="systemMode == 'pc'">
      <div class="clearHead">
        <a-select
          size="m"
          v-model:value="state.clearSearch.library"
          style="width: 200px"
          placeholder="馆舍"
          allowClear
        >
          <a-select-option
            v-for="item in state.premisesList"
            :value="item?.id"
            >{{ item?.name }}</a-select-option
          >
        </a-select>
        <a-select
          size="m"
          v-model:value="state.clearSearch.type"
          style="width: 200px; margin: 0 20px"
          placeholder="类型"
          allowClear
        >
          <a-select-option value="1">有物锁定</a-select-option>
          <a-select-option value="0">存放时长</a-select-option>
        </a-select>
        <a-input
          style="width: 200px; border-radius: 20px"
          size="m"
          v-model:value="state.clearSearch.hour"
          suffix="小时"
          placeholder="超时时长"
          type="number"
          allow-clear
        />

        <a-button shape="round" size="m" class="clearBtn" @click="fetchList">
          <template #icon>
            <img src="@/assets/collection/clearSearch.svg" alt="" />
          </template>
          搜索</a-button
        >
      </div>

      <div class="clearTable">
        <a-table
          :row-selection="rowSelection"
          :columns="clearColumns"
          :data-source="state.clearList"
          :pagination="false"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="boxName">
                <div class="boxBg">{{ record?.sort }}</div>
                <span>{{ text }}</span>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </template>
    <template v-else>
      <div class="clearHead">
        <a-select
          size="m"
          v-model:value="state.clearSearch.library"
          style="width: 42%"
          placeholder="馆舍"
          allowClear
          @change="fetchList"
        >
          <a-select-option
            v-for="item in state.premisesList"
            :value="item?.id"
            >{{ item?.name }}</a-select-option
          >
        </a-select>
        <a-select
          size="m"
          v-model:value="state.clearSearch.type"
          style="width: 42%; margin: 0 20px"
          placeholder="类型"
          allowClear
          @change="fetchList"
        >
          <a-select-option value="1">有物锁定</a-select-option>
          <a-select-option value="0">存放时长</a-select-option>
        </a-select>
        <img
          @click="state.longTimeShow = true"
          src="@/assets/collection/clearTime.svg"
          alt=""
        />
      </div>

      <van-pull-refresh v-model="state.refresh" @refresh="onRefresh">
        <div v-if="state.clearList?.length" class="clearList">
          <div
            v-for="item in state.clearList"
            class="clearItem"
            :key="item?.id"
            @click="onSelected(item)"
          >
            <!-- 根据是否选中来切换图标 -->

            <img
              v-if="!state.selected.includes(item.id)"
              src="@/assets/collection/radioSlt.svg"
              alt=""
            />
            <img v-else src="@/assets/collection/radioSlted.svg" alt="" />

            <div class="boxName">
              <div class="boxBg">2</div>
            </div>
            <div class="boxInfo">
              <p class="boxTitle">基础馆-1F-2号柜：04格</p>
              <p class="locker">有物锁定</p>
              <!-- <p class="longTime">最长收取 <span>1487.09小时</span></p> -->
            </div>
          </div>
        </div>

        <a-empty description="暂无数据" v-else style="padding-top: 15%" />
      </van-pull-refresh>
    </template>

    <van-popup
      v-model:show="state.longTimeShow"
      position="bottom"
      :style="{ height: '40%' }"
      destroy-on-close
    >
      <div class="drawerCon">
        <div class="filterTime">
          <div class="filterFilter">超时时长</div>
          <div class="filterItem">
            <a-input
              style="border-radius: 20px"
              v-model:value="state.longTime"
              suffix="小时"
              placeholder="超时时长"
              type="number"
              allow-clear
            />
          </div>
        </div>
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.longTimeShow = false"
          >
            {{ $t("cancel") }}
          </van-button>
          <van-button round block type="primary" @click="onSelectedHour">{{
            $t("visitor_Confirm")
          }}</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.clearCon {
  &.clearConM {
    height: 100%;
    display: flex;
    flex-direction: column;
    .clearHead {
      padding: 10px 14px;
      background-color: #ffffff;
    }
    .clearList {
      padding: 0 12px;
      .clearItem {
        padding: 14px 10px;
        display: flex;
        align-items: center;
        background: #ffffff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
        border-radius: 10px;
        margin-top: 12px;

        .boxName {
          margin: 0 12px;
          .boxBg {
            width: 50px;
            height: 50px;
            line-height: 50px;
            margin-right: 0;
          }
        }
        .boxInfo {
          font-size: 14px;
          color: #202020;
          .boxTitle {
            margin-bottom: 10px;
          }
          .locker {
            font-size: 13px;
            color: #df1f1f;
          }
          .longTime {
            font-size: 13px;
            color: #616161;
            span {
              margin-left: 2px;
              color: #f28800;
            }
          }
        }
      }
    }
    .van-pull-refresh {
      flex: 1;
    }
  }
  .clearHead {
    display: flex;
    align-items: center;
    .clearBtn {
      width: 82px;
      margin-left: 20px;
      background: rgba(26, 73, 192, 0.07);
      border: 1px solid rgba(26, 73, 192, 0.14);
      font-size: 14px;
      color: #1a49c0;
      img {
        width: 12px;
        height: 12px;
        margin-right: 4px;
        transform: translateY(-2px);
      }
    }

    :deep(.ant-select-selector) {
      border-radius: 20px;
    }
    .selector {
      width: 200px;
      border: 1px solid #d9d9d9;
      padding: 4px 11px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      color: #d9d9d9;

      span {
        color: rgba(0, 0, 0, 0.25);
      }
      &:hover {
        border-color: var(--primary-color);
      }
    }
  }
  .clearTable {
    margin-top: 12px;
  }
  .boxName {
    display: flex;
    align-items: center;
    .boxBg {
      width: 34px;
      height: 34px;
      background-image: url("@/assets/collection/clearBoxBG.png");
      background-size: 100%;
      text-align: center;
      line-height: 34px;
      font-size: 16px;
      color: #fff;
      margin-right: 14px;
    }
  }
}

.drawerCon {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filterTime {
    flex: 1;
    padding: 20px 12px;
  }
  .filterFilter {
    margin-bottom: 24px;
    background: rgba(97, 97, 97, 0.05);
    border-radius: 0px 0px 0px 0px;
    padding: 2px 10px;
    color: #616161;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
      .ant-radio-wrapper,
      .ant-checkbox-wrapper {
        width: 29%;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .bottomAct {
    background-color: #fff;
    padding: 12px 12px 28px 12px;
    display: flex;
    justify-content: space-between;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }

    .toggleAll {
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #616161;
      img {
        margin-right: 6px;
      }
    }
  }
}
</style>
