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
    area: "图书馆-2F-外文特藏阅览室: 016",
    time: "2023-12-01 16:00~18:00",
    result_info: "预约待确认",
    user: "VIP080 (202307080)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
  },
  {
    key: "2",
    area: "图书馆-2F-外文特藏阅览室: 015",
    time: "2023-12-01 16:00~18:00",
    result_info: "预约成功",
    user: "VIP081 (202307081)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
  },
  {
    key: "3",
    area: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "使用中",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
  },
  {
    key: "4",
    area: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已取消",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
  },
  {
    key: "5",
    area: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已结束",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
  },
  {
    key: "6",
    area: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已关闭",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
  },
  {
    key: "7",
    area: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "未签到",
    user: "VIP083 (202307083)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    info: "xxx研究课题讨论",
    members: [
      { id: 1, name: "VIP080 (202307080)", statusClass: "status-agreed" ,isMySelf:true},
      { id: 2, name: "VIP078 (202307078)", statusClass: "status-pending" ,isMySelf:false},
      { id: 3, name: "VIP076 (202307076)", statusClass: "status-pending" ,isMySelf:false},
      { id: 4, name: "VIP079 (202307079)", statusClass: "status-pending" ,isMySelf:false},
      { id: 5, name: "VIP077 (202307077)", statusClass: "status-pending" ,isMySelf:false},
      { id: 6, name: "VIP075 (202307075)", statusClass: "status-rejected" ,isMySelf:false},
    ],
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
</script>
<template>
  <div class="record">
    <a-tabs v-model:activeKey="activeKey" size="middle">
      <a-tab-pane key="seat" tab="普通空间"></a-tab-pane>
      <a-tab-pane key="study" tab="大型空间"></a-tab-pane>
    </a-tabs>
    <div
      class="toggleLang"
      :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
    >
      <div class="langItem langActive activeBtn">预约记录</div>
      <div class="langItem activeBtn">违约记录</div>
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
                    : record.result_info === '预约待确认'
                    ? 'warning'
                    : 'default'
                "
              >
                {{ record.result_info }}
              </a-tag>
            </span>
          </template>

          <template v-if="column.key === 'action'">
            <template
              v-if="
                record.result_info === '预约待确认' ||
                record.result_info === '预约成功'
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

  .toggleLang {
    position: absolute;
    top: 36px;
    left: 30px;
    width: 240px;
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
    color:#ff4d4f;
  }

  .status-agreed {
    color: #52c41a; 
  }

  .status-pending {
    color: #d9d9d9; 
  }
}
</style>
