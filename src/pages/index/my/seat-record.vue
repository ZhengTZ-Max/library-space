<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";

const store = useStore();
const state = reactive({
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
    dataIndex: "result_info",
    key: "result_info",
  },
  {
    title: "操作",
    key: "action",
  },
];

const data = [
  {
    key: "1",
    seat: "图书馆-2F-外文特藏阅览室: 016",
    time: "2023-12-01 16:00~18:00",
    result_info: "预约成功",
    user: "VIP080 (202307080)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "2",
    seat: "图书馆-2F-外文特藏阅览室: 015",
    time: "2023-12-01 16:00~18:00",
    result_info: "使用中",
    user: "VIP081 (202307081)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "3",
    seat: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已结束",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "4",
    seat: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已取消",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "5",
    seat: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "未签到",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "6",
    seat: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "状态异常",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
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
</script>
<template>
  <div class="record">
    <a-tabs v-model:activeKey="activeKey" size="middle">
      <a-tab-pane key="seat" tab="普通座位"></a-tab-pane>
      <a-tab-pane key="study" tab="研习座位"></a-tab-pane>
      <a-tab-pane key="seminar" tab="考研座位"></a-tab-pane>
    </a-tabs>
    <div
      class="toggleLang"
      :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
    >
      <div class="langItem langActive activeBtn">预约记录</div>
      <div class="langItem activeBtn">违约记录</div>
      <div class="langItem activeBtn">权限查询</div>
    </div>

    <div class="table">
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'result_info'">
            <span>
              <a-tag
                class="custom-tag"
                :color="
                  record.result_info === '预约成功'
                    ? 'success'
                    : record.result_info === '使用中'
                    ? 'processing'
                    : record.result_info === '未签到'
                    ? 'error'
                    : record.result_info === '状态异常'
                    ? 'warning'
                    : 'default'
                "
              >
                {{ record.result_info }}
              </a-tag>
            </span>
          </template>

          <template v-if="column.key === 'action'">
            <template v-if="record.key === '1'">
              <span>
                <a class="red" type="primary" @click="onShowModal(record)"
                  >取消</a
                >
                <a-divider type="vertical" />
                <a type="primary" @click="onShowModal(record)">预约</a>
              </span>
            </template>
            <template v-else>
              <template
                v-if="
                  record.result_info === '未签到' ||
                  record.result_info === '状态异常'
                "
              >
                <span>
                  <a type="primary" @click="onShowModal(record)">查看</a>
                </span>
              </template>
              <template v-else>
                <span>
                  <a type="primary" @click="onShowModal(record)">预约</a>
                </span>
              </template>
            </template>
          </template>
        </template>
      </a-table>
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

    <a-card class="query-result-card">
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
          >查询</a-button
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
      <div >
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

  .toggleLang {
    position: absolute;
    top: 36px;
    left: 30px;
    width: 386px;
    height: 36px;
    padding: 4px;
    background: #f1f1f1;
    border-radius: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .langItem {
      color: #868686;
      padding: 2px 16px;
      min-width: 60px;
      height: 28px;
    }
    .langActive {
      background: #ffffff;
      box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
      border-radius: 17px 17px 17px 17px;
      font-weight: bold;
      font-size: 14px;
      color: #1f56e1;
    }
  }
  .toggleLangPc {
    top: 65px;
    left: 30px;
  }
}

.red {
  color: red;
}
.segmented {
  width: 386px;
  height: 36px;
}
.ant-segmented {
  border-radius: 21px;
}
.ant-segmented {
  background-color: #f3f4f8;
}
:root {
  --antd-segmented-selected-color: #ffffff;
}
.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 60px;
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
</style>
