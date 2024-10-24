<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getSeatRecordList } from "@/request/sear-record";

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
  selectedRecord: "",
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

  room: [
    {
      label: "图书馆",
      value: "图书馆",
    },
    {
      label: "基础馆",
      value: "基础馆",
    },
    {
      label: "玉泉馆",
      value: "玉泉馆",
    },
    {
      label: "老馆",
      value: "老馆",
    },
  ],
  roomValue: "基础馆",

  floor: [
    {
      label: "1F",
      value: "1F",
    },
    {
      label: "2F",
      value: "2F",
    },
    {
      label: "3F",
      value: "3F",
    },
    {
      label: "4F",
      value: "4F",
    },
    {
      label: "5F",
      value: "5F",
    },
    {
      label: "6F",
      value: "6F",
    },
  ],
  floorValue: "1F",
  area: [
    {
      label: "自修A区",
      value: "自修A区",
    },
    {
      label: "自习B区",
      value: "自习B区",
    },
    {
      label: "自习C区",
      value: "自习C区",
    },
  ],
  areaValue: "自修A区",
});

const columns = [
  {
    title: "座位",
    dataIndex: "seat",
    key: "seat",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "状态",
    dataIndex: "status_name",
    key: "status_name",
  },
  {
    title: "操作",
    key: "action",
  },
];


const onShowModal = (record) => {
  state.isModalVisible = true;
  state.selectedRecord = record;
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
  state.quickMode = row?.value;
};

onMounted(() => {
  fetch();
});

const fetch = () => {
  if (state.quickMode === 1) {
    // 预约记录
    fetchSeatRecordList();
  } else if (state.quickMode === 2) {
    // 违约记录
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

// 座位 tab 切换
const onChangeTab = (key) => {
  state.activeKey = key;
  state.currentPage = 1;
  fetch();
  console.log(key);
};

const pagination = computed(() => ({
  total: state.total,
  current: state.currentPage,
  showSizeChanger: false,
}));

const onChangePage = (pagination) => {
  // pagination : {current: 2, pageSize: 10, total: 132, showSizeChanger: false}
  let { current } = pagination;
  state.currentPage = current;
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
    <div class="quickBtns" style="width: 380px">
      <div
        v-for="item in state.quickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        @click="onChangeQMode(item)"
      >
        {{ item?.label }}
      </div>
    </div>
    <div v-if="state.quickMode != 3" class="table">
      <a-table
        v-if="state.data?.length"
        :columns="columns"
        :data-source="state.data"
        :pagination="pagination"
        @change="onChangePage"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'seat'">
            <span>{{ record.nameMerge }} : {{ record.name }}</span>
          </template>
          <template v-if="column.key === 'time'">
            <span>{{ record.beginTime }}</span>
          </template>
          <template v-if="column.key === 'status_name'">
            <span>
              <a-tag
                class="custom-tag"
                :color="
                  record.status_name === '预约成功'
                    ? 'success'
                    : record.status_name === '使用中'
                    ? 'processing'
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
                <a type="primary" @click="onShowModal(record)">预约</a>
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
      <a-empty v-else />
    </div>
    <a-modal
      class="result-modal"
      v-model:visible="state.isModalVisible"
      title="预约详情"
      :footer="null"
      @ok="onHideModal"
    >
      <a-divider />
      <div v-if="state.selectedRecord" class="modal-content">
        <p>
          预约状态：<span
            :class="
              state.selectedRecord.result_info === '使用中'
                ? 'status-active'
                : state.selectedRecord.result_info === '未签到' ||
                  state.selectedRecord.result_info === '状态异常'
                ? 'status-nosign'
                : ''
            "
            >{{ state.selectedRecord.result_info }}</span
          >
        </p>
        <p>预约用户：{{ state.selectedRecord.user }}</p>
        <p>预约时间：{{ state.selectedRecord.reservationTime }}</p>
        <p>开始时间：{{ state.selectedRecord.startTime }}</p>
        <p>结束时间：{{ state.selectedRecord.endTime }}</p>
        <p>预约地点：{{ state.selectedRecord.seat }}</p>
        <a-divider dashed />
        <p v-if="state.selectedRecord.result_info !== '预约成功'">
          签到时间：{{ state.selectedRecord.checkInTime }}
        </p>
        <div
          class="modal-footer"
          v-if="state.selectedRecord.result_info === '预约成功'"
        >
          <a-button type="primary" class="cancel-button" @click="onHideModal"
            >取消预约</a-button
          >
        </div>
      </div>
    </a-modal>

    <a-card v-if="state.quickMode === 3" class="query-result-card">
      <div class="query-result-header">
        查询结果 <span class="query-result-subtitle">(请点击立即查询)</span>
      </div>
      <div class="query-result-content">
        <p>
          查詢位置：<span class="text-default">{{
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

  .toggleLangPc {
    top: 65px;
    left: 30px;
  }
}

.red {
  color: red;
}

.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 30px;
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
