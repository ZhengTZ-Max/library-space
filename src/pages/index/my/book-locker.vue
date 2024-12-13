<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import PageSizeCom from "@/components/PageSizeCom.vue";

const store = useStore();
const onCheckedForLocation = ref(true);

const state = reactive({
  total: 0,
  currentPage: 1,

  activeKey: "day",
  isModalVisible: false,
  selectedRecord: "",

  quickMode: 1,
  quickModeList: [
    { value: 1, label: "预约记录" },
    { value: 2, label: "违约记录" },
  ],
});

const onChangeQMode = (row) => {
  state.quickMode = row?.value;
};

const onShowModal = (record) => {
  state.isModalVisible = true;
  state.selectedRecord = record;
};
const onHideModal = () => {
  state.isModalVisible = false;
  state.selectedRecord = "";
};

const columns = [
  {
    title: "存书柜",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "操作",
    key: "action",
  },
];

const data = [
  {
    key: "1",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "预约成功",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "2",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "使用中",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "3",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "已取消",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "4",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "已结束",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "5",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "未签到",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
  {
    key: "6",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "使用超时",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
  },
];

const onChangePage = (page, pageSize) => {
  state.currentPage = page;
};
</script>

<template>
  <div class="record">
    <a-tabs v-model:activeKey="state.activeKey" size="middle">
      <a-tab-pane key="day" tab="日柜"></a-tab-pane>
      <a-tab-pane key="week" tab="周柜"></a-tab-pane>
      <a-tab-pane key="long" tab="长期柜"></a-tab-pane>
    </a-tabs>
    <div class="quickBtns" style="width: 220px; margin: 10px 10px">
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

    <div class="table">
      <PageSizeCom v-if="data?.length > 0">
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <span>
                <a-tag
                  class="custom-tag"
                  :color="
                    record.status === '预约成功'
                      ? 'success'
                      : record.status === '使用中'
                      ? 'processing'
                      : record.status === '未签到' ||
                        record.result_info === '使用超时'
                      ? 'error'
                      : 'default'
                  "
                >
                  {{ record.status }}
                </a-tag>
              </span>
            </template>

            <template v-if="column.key === 'action'">
              <template v-if="record.status === '预约成功'">
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
              </template>
            </template>
          </template>
        </a-table>
      </PageSizeCom>
      <a-empty v-else />
    </div>
    <div class="cPagination" v-if="data?.length > 0">
      <a-pagination
        v-model:current="state.currentPage"
        :total="state.total"
        @change="onChangePage"
        :default-page-size="10"
        show-less-items
      />
    </div>
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
            state.selectedRecord.status === '预约成功'
              ? 'status-success'
              : state.selectedRecord.status === '使用中'
              ? 'status-active'
              : state.selectedRecord.status === '未签到' ||
                state.selectedRecord.status === '使用超时'
              ? 'status-nosign'
              : ''
          "
          >{{ state.selectedRecord.status }}</span
        >
      </p>
      <p>预约用户：{{ state.selectedRecord.user }}</p>
      <p>预约时间：{{ state.selectedRecord.reservationTime }}</p>
      <p>开始时间：{{ state.selectedRecord.startTime }}</p>
      <p>结束时间：{{ state.selectedRecord.endTime }}</p>
      <p>预约地点：{{ state.selectedRecord.location }}</p>

      <a-divider dashed />

      <div
        class="modal-footer-success"
        v-if="state.selectedRecord.status === '预约成功'"
      >
        <a-button
          type="primary"
          class="cancel-button-success"
          @click="onHideModal"
          >取消预约</a-button
        >
      </div>
      <p v-else-if="state.selectedRecord.status === '未签到'">
        违约时间：{{ state.selectedRecord.checkInTime }}
      </p>
      <p v-else-if="state.selectedRecord.status === '已取消'">
        取消时间：{{ state.selectedRecord.checkInTime }}
      </p>
      <div v-else-if="state.selectedRecord.status === '已结束'">
        <p>存物时间：{{ state.selectedRecord.startTime }}</p>
        <p>取物时间：{{ state.selectedRecord.endTime }}</p>
      </div>
      <div v-else-if="state.selectedRecord.status === '使用超时'">
        <p>存物时间：{{ state.selectedRecord.startTime }}</p>
        <p>取物时间：{{ state.selectedRecord.endTime }}</p>
        <p>超时时间：<span class="red">152分钟</span></p>
      </div>
      <p v-else>存物时间：{{ state.selectedRecord.checkInTime }}</p>
    </div>
  </a-modal>
</template>

<style scoped lang="less">
.record {
  padding-left: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 60px;
  flex: 1;
  overflow: auto;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
}
.red {
  color: red;
}

.result-modal {
  .modal-content {
    font-size: 14px;
    line-height: 1.5;
    color: #333;

    p {
      margin: 19px 0;
    }

    .status-wait {
      color: #ea9e4c;
    }
    .status-active {
      color: #1890ff;
    }
    .status-nosign {
      color: #ff4d4f;
    }
    .status-success {
      color: #70bc89;
    }
  }
  .modal-footer-success {
    text-align: center;
    margin-top: 20px;
  }

  .cancel-button-success {
    width: 120px;
  }
}
</style>
