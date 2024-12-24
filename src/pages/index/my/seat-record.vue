<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getSeatRecordList, getSeatRenegeList } from "@/request/sear-record";
import MySeatRecordCom from "@/components/MySeatRecordCom.vue";
import PageSizeCom from "@/components/PageSizeCom.vue";
import { getUserInfo, exchangeDateTime } from "@/utils";

const store = useStore();
const state = reactive({
  activeKey: "1",
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],
  quickMode: 1,
  quickModeList: [
    { value: 1, label: "预约记录" },
    { value: 2, label: "违约记录" },
    { value: 3, label: "权限查询" },
  ],
  isModalVisible: false,
  isModalVisibleForQuery: false,
  selectLocationName: "",
  selectedRecord: {},
  queryResult: {
    location: "基础馆-1F-自修A区(研习)",
    currentPeriod: {
      period: "2024-01-22至2024-01-28",
      status: "已获得",
    },
    nextPeriod: {
      period: "2024-01-29至2024-02-04",
      status: "未获得",
    },
  },
});

const columns = [
  {
    title: "区域",
    dataIndex: "seat_space",
    key: "seat_space",
    width: 400,
  },
  {
    title: "座位号",
    dataIndex: "seat",
    key: "seat",
    width: 200,
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 300,
  },
  {
    title: "状态",
    dataIndex: "status_name",
    key: "status_name",
  },
  {
    title: "操作",
    key: "action",

    width: 100,
  },
];

const onShowModal = (record) => {
  state.selectedRecord.activeKey = state.activeKey;
  state.selectedRecord = record;
  state.isModalVisible = true;
};
const onHideModal = () => {
  state.isModalVisible = false;
  state.isModalVisibleForQuery = false;
  state.selectedRecord = "";
};

const onQuery = () => {
  state.isModalVisibleForQuery = true;
};

const onChangeQMode = (row) => {
  if (state.activeKey == "1") {
    // 普通座位 下 不能点击 权限查询
    if (row?.value == "3") return;
  }
  state.quickMode = row?.value;
  fetch();
};

// 计算属性，根据 activeKey 动态返回 quickModeList
const filteredQuickModeList = computed(() => {
  if (state.activeKey === "1") {
    // 如果 activeKey 为 1，返回前两条数据
    return state.quickModeList.slice(0, 2);
  }
  // 否则返回全部数据
  return state.quickModeList;
});

onMounted(() => {
  fetch();
});
watch(
  () => state.selectedRecord.clickCancelReservation,
  (val) => {
    if (val) {
      console.log("取消预约");
      onHideModal();
    }
  }
);

const fetch = () => {
  if (state.quickMode === 1) {
    // 预约记录
    fetchSeatRecordList();
  } else if (state.quickMode === 2) {
    // 违约记录
    fetchSeatRenegeList();
  } else if (state.quickMode === 3) {
    // 权限查询
  }
};

const fetchSeatRecordList = async () => {
  try {
    let params = {
      type: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getSeatRecordList(params);
    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchSeatRenegeList = async () => {
  try {
    let params = {
      type: state.activeKey,
    };
    const res = await getSeatRenegeList(params);
    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total;
    }
  } catch (error) {}
};

// 座位 tab 切换
const onChangeTab = (key) => {
  state.activeKey = key;
  if (state.quickMode == "3") {
    state.quickMode = "1";
  }
  state.currentPage = 1;
  fetch();
  console.log(key);
};

const pagination = computed(() => ({
  total: state.total,
  current: state.currentPage,
  showSizeChanger: false,
}));

const onChangePage = (page, pageSize) => {
  // pagination : {current: 2, pageSize: 10, total: 132, showSizeChanger: false}
  state.currentPage = page;
  fetch();
};
</script>
<template>
  <div class="record">
    <a-tabs
      v-model:activeKey="state.activeKey"
      size="middle"
      @change="onChangeTab"
    >
      <a-tab-pane key="1" tab="普通座位"></a-tab-pane>
      <a-tab-pane key="3" tab="研习座位"></a-tab-pane>
      <a-tab-pane key="4" tab="考研座位"></a-tab-pane>
    </a-tabs>
    <div
      class="quickBtns"
      :class="{
        width_230: state.activeKey == '1',
        width_380: state.activeKey != '1',
      }"
    >
      <div
        v-for="item in filteredQuickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        @click="onChangeQMode(item)"
      >
        {{ item?.label }}
      </div>
    </div>
    <div v-if="state.quickMode != 3" class="table">
      <PageSizeCom v-if="state.data?.length > 0">
        <a-table
          :columns="columns"
          :data-source="state.data"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'seat_space'">
              <span>{{ record.nameMerge }}</span>
            </template>
            <template v-if="column.key === 'seat'">
              <span v-if="state.activeKey == '1'"> {{ record.name }}</span>
              <span v-else> {{ record.spacename }}</span>
            </template>
            <template v-if="column.key === 'time'">
              <span v-if="state.activeKey == '1'">
                <!-- 普通座位  日期不会跨天 -->
                {{ exchangeDateTime(record.beginTime, 3) }} ~
                {{ exchangeDateTime(record.endTime, 8) }}</span
              >
              <span v-else>
                <!-- 研习/考研座位 日期会跨天 -->
                {{ exchangeDateTime(record.beginTime, 2) }} ~
                {{ exchangeDateTime(record.endTime, 40) }}
              </span>
            </template>
            <template v-if="column.key === 'status_name'">
              <span>
                <!--记得使用status状态码判断  -->
                <!-- 
                  预约成功			2、9
                  预约待审核		1、32	
                  待邀			    21
                  草稿			    31
                  使用中			  3、11、33
                  已结束			  4、8、12、34、35
                  已取消			  6
                  状态异常			其它
                -->
                <a-tag
                  class="custom-tag"
                  :color="
                    record.status === '2' || record.status === '9'
                      ? 'success'
                      : record.status === '3' || record.status === '11' || record.status === '33'
                      ? 'processing'
                      : record.status == '1' || record.status == '32'
                      ? 'warning'
                      : record.status_name === '未签到'
                      ? 'error'
                      : record.status_name === '状态异常'
                      ? 'warning'
                      : 'default'
                  "
                >
                  {{ record.status_name }}
                </a-tag>
              </span>
            </template>

            <template v-if="column.key === 'action'">
              <template v-if="record.status_name === '预约成功'">
                <span>
                  <a class="red" type="primary" @click="onShowModal(record)"
                    >取消</a
                  >
                  <a-divider type="vertical" />
                  <a type="primary" @click="onShowModal(record)">查看</a>
                </span>
              </template>
              <template v-else>
                <span>
                  <a type="primary" @click="onShowModal(record)">查看</a>
                </span>
                <!-- <template
                  v-if="
                    record.status_name === '已超时' ||
                    record.status_name === '审核未通过'
                  "
                >
                  <span>
                    <a type="primary" @click="onShowModal(record)">查看</a>
                  </span>
                </template> -->
              </template>
            </template>
          </template>
        </a-table>
      </PageSizeCom>
      <a-empty v-else />
    </div>
    <div class="cPagination" v-if="state.data?.length > 0">
      <a-pagination
        v-model:current="state.currentPage"
        :total="state.total"
        @change="onChangePage"
        show-less-items
        :showSizeChanger="false"
      />
    </div>
    <a-modal
      class="result-modal"
      v-model:visible="state.isModalVisible"
      title="预约详情"
      :footer="null"
      @ok="onHideModal"
      destroyOnClose
    >
      <MySeatRecordCom :data="state.selectedRecord" :userName="userName" />
    </a-modal>

    <a-card v-if="state.quickMode === 3" class="query-result-card">
      <div class="query-result-header">
        查询结果 <span class="query-result-subtitle">(请点击立即查询)</span>
      </div>
      <div class="query-result-content">
        <p>
          查询位置：<span class="text-default">{{
            state.queryResult.location
          }}</span>
        </p>
        <p>
          本期（{{ state.queryResult.currentPeriod.period }}）预约权限：<span
            class="status-success"
            >{{ state.queryResult.currentPeriod.status }}</span
          >
        </p>
        <p>
          下期（{{ state.queryResult.nextPeriod.period }}）预约权限：<span
            class="text-default"
            >{{ state.queryResult.nextPeriod.status }}</span
          >
        </p>
      </div>
      <div class="query-result-footer">
        <a-button type="primary" class="query-button" @click="onQuery"
          ><SearchOutlined /> 查询</a-button
        >
      </div>
    </a-card>

    <a-modal
      class="query-modal"
      v-model:open="state.isModalVisibleForQuery"
      title="权限查询"
      :footer="null"
      @ok="onHideModal"
    >
      <a-divider />
      <div>
        <div class="dialog-title">馆舍</div>
        <div class="checkboxItem">
          <a-radio-group v-model:value="state.roomValue">
            <template v-for="item in state.room" :key="state.room.value">
              <a-radio :value="item.value">{{ item.label }}</a-radio>
            </template>
          </a-radio-group>
        </div>
      </div>
      <div>
        <div class="dialog-title">楼层</div>
        <div class="checkboxItem">
          <!-- <a-checkbox-group v-model:value="state.dateValue" :options="state.dates" /> -->
          <a-radio-group v-model:value="state.floorValue">
            <template v-for="item in state.floor" :key="state.floor.value">
              <a-radio :value="item.value">{{ item.label }}</a-radio>
            </template>
          </a-radio-group>
        </div>
      </div>
      <div>
        <div class="dialog-title">区域</div>
        <div class="checkboxItem">
          <!-- <a-checkbox-group v-model:value="state.dateValue" :options="state.dates" /> -->
          <a-radio-group v-model:value="state.areaValue">
            <template v-for="item in state.area" :key="state.area.value">
              <a-radio :value="item.value">{{ item.label }}</a-radio>
            </template>
          </a-radio-group>
        </div>

        <a-divider />
        <div class="modal-footer">
          <a-button class="cancel-button" @click="onHideModal">取消</a-button>
          <a-button type="primary" class="confirm-button" @click="onHideModal"
            >确认</a-button
          >
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.record {
  padding-left: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .toggleLangPc {
    top: 65px;
    left: 30px;
  }
  .width_380 {
    width: 380px;
  }
  .width_230 {
    width: 230px;
  }
}

.red {
  color: orange;
}

.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 30px;
  flex: 1;
  overflow: auto;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
}

.modal-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  p {
    margin: 19px 0;
  }

  .status-active {
    color: #1890ff;
  }
  .status-nosign {
    color: #ff4d4f;
  }
}
.result-modal {
  .modal-footer {
    text-align: center;
    margin-top: 20px;
  }

  .cancel-button {
    width: 120px;
  }
}

/* 查询结果卡片样式 */
.query-result-card {
  margin-top: 30px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.query-result-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.query-result-subtitle {
  font-size: 12px;
  color: #999;
}

.query-result-content {
  background-color: #fafafa;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #666666;

  p {
    margin: 10px 0;
  }
}

.query-result-footer {
  text-align: center;
}

.query-button {
  width: 200px;
  border-radius: 40px;
}

.status-success {
  color: #52c41a;
}

.status-failed {
  color: #ff4d4f;
}
.text-default {
  color: #242424;
}

.dialog-title {
  padding-left: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: #f7f7f7;
  font-size: 14px;
  color: #202020;
}
.checkboxItem {
  padding: 20px;
}
.query-modal {
  .modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding: 0 20px;

    .cancel-button,
    .confirm-button {
      width: 120px;
      border-radius: 4px;
    }

    .cancel-button {
      margin-right: 10px;
      background-color: #f0f0f0;
      border-color: #d9d9d9;
      color: #9fa0a7;
    }

    .confirm-button {
      margin-left: 10px;
    }
  }
}
.ant-tag-default {
  color: rgba(97, 97, 97, 0.5);
}
</style>
