<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";

import { getAreaRecordList } from "@/request/area-record";

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
    title: "空间",
    dataIndex: "area",
    key: "area",
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
  state.selectedRecord = "";
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
    fetchAreaRecordList();
  } else if (state.quickMode === 2) {
    // 违约记录
  }
};
const fetchAreaRecordList = async () => {
  try {
    let params = {
      type: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getAreaRecordList(params);
    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total;
    }
  } catch (error) {
    console.log(error);
  }
};

// 空间 tab 切换
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
      <a-tab-pane key="1" tab="普通空间"></a-tab-pane>
      <a-tab-pane key="2" tab="大型空间"></a-tab-pane>
    </a-tabs>
    <div class="quickBtns" style="width: 200px">
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
      <a-table
        v-if="state.data?.length"
        :columns="columns"
        :data-source="state.data"
        :pagination="pagination"
        @change="onChangePage"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'area'">
            <span>{{ record.nameMerge }}</span>
          </template>
          <template v-if="column.key === 'time'">
            <span>{{ record.begin_time }}</span>
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
            <template
              v-if="
                record.status_name === '预约待确认' ||
                record.status_name === '预约成功'
              "
            >
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
              state.selectedRecord.result_info === '预约待确认'
                ? 'status-wait'
                : state.selectedRecord.result_info === '预约成功'
                ? 'status-success'
                : state.selectedRecord.result_info === '使用中'
                ? 'status-active'
                : state.selectedRecord.result_info === '未签到'
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
        <p>预约地点：{{ state.selectedRecord.area }}</p>
        <p>预约信息：{{ state.selectedRecord.info }}</p>
        <div class="members-row">
          <span>全部成员：</span>
          <div class="members">
            <div
              v-for="member in state.selectedRecord.members"
              :key="member.id"
              class="member"
            >
              <span :class="{ isMySelf: member.isMySelf }"
                >{{ member.name }}
              </span>
              <span :class="member.statusClass" class="member-status"
                >{{
                  member.statusClass === "status-pending"
                    ? "待确认"
                    : member.statusClass === "status-agreed"
                    ? "同意邀请"
                    : member.statusClass === "status-rejected"
                    ? "拒绝邀请"
                    : ""
                }}
              </span>
            </div>
          </div>
        </div>
        <a-divider dashed />

        <div
          class="modal-footer"
          v-if="state.selectedRecord.result_info === '预约待确认'"
        >
          <a-button class="cancel-button" @click="onHideModal">拒绝</a-button>
          <a-button type="primary" class="confirm-button" @click="onHideModal"
            >接受</a-button
          >
        </div>
        <div
          class="modal-footer-success"
          v-else-if="state.selectedRecord.result_info === '预约成功'"
        >
          <a-button
            type="primary"
            class="cancel-button-success"
            @click="onHideModal"
            >取消预约</a-button
          >
        </div>
        <p v-else-if="state.selectedRecord.result_info === '未签到'">
          违约时间：{{ state.selectedRecord.checkInTime }}
        </p>
        <p v-else-if="state.selectedRecord.result_info === '已取消'">
          取消时间：{{ state.selectedRecord.checkInTime }}
        </p>
        <p v-else>签到时间：{{ state.selectedRecord.checkInTime }}</p>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.record {
  padding-left: 30px;
  position: relative;
}

.red {
  color: red;
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
  .members-row {
    display: flex;
    align-items: top;
    margin-top: 8px;
  }

  .members {
    display: flex;
    flex-wrap: wrap;
    margin-left: 8px;
    flex: 1;
  }

  .member {
    width: 50%;
    margin-bottom: 8px;
  }
  .modal-footer-success {
    text-align: center;
    margin-top: 20px;
  }

  .cancel-button-success {
    width: 120px;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding: 0 20px;
  }

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

  .isMySelf {
    color: #1f56e1;
  }

  .member-status {
    margin-left: 10px;
  }

  .status-rejected {
    color: #ff4d4f;
  }

  .status-agreed {
    color: #52c41a;
  }

  .status-pending {
    color: #d9d9d9;
  }
}
.ant-tag-default {
  color: rgba(97, 97, 97, 0.5);
}
</style>
