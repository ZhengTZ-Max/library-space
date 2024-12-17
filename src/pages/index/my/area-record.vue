<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";

import { getAreaRecordList, getRenegesRecordList } from "@/request/area-record";
import PageSizeCom from "@/components/PageSizeCom.vue";
import { getUserInfo } from "@/utils";

const store = useStore();
const state = reactive({
  activeKey: "1",
  UserInfo: getUserInfo(),
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
  console.log(state.selectedRecord);
};
const onHideModal = () => {
  state.isModalVisible = false;
  state.selectedRecord = "";
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
    fetchRenegesRecordList();
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

const fetchRenegesRecordList = async () => {
  try {
    let params = {
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getRenegesRecordList(params);
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

const onChangeQMode = (row) => {
  state.quickMode = row?.value;
  state.currentPage = 1;
  fetch();
};

const pagination = computed(() => ({
  total: state.total,
  current: state.currentPage,
  showSizeChanger: false,
}));

const onChangePage = (page, pageSize) => {
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
      <PageSizeCom v-if="state.data?.length > 0">
        <a-table
          :columns="columns"
          :data-source="state.data"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
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
                      : record.status_name === '预约待审核'
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
      </PageSizeCom>
      <a-empty v-else />
    </div>
    <div class="cPagination" v-if="state.data?.length > 0">
      <a-pagination
        v-model:current="state.currentPage"
        :total="state.total"
        @change="onChangePage"
        show-less-items
      />
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
              state.selectedRecord.status_name === '预约待审核'
                ? 'status-wait'
                : state.selectedRecord.status_name === '预约成功'
                ? 'status-success'
                : state.selectedRecord.status_name === '使用中'
                ? 'status-active'
                : state.selectedRecord.status_name === '未签到'
                ? 'status-nosign'
                : ''
            "
            >{{ state.selectedRecord.status_name }}</span
          >
        </p>
        <p>
          预约用户：{{ state.selectedRecord.member_name }}({{
            state.selectedRecord.member_id
          }})
        </p>
        <p>预约时间：{{ state.selectedRecord.create_time }}</p>
        <p>开始时间：{{ state.selectedRecord.begin_time }}</p>
        <p>结束时间：{{ state.selectedRecord.end_time }}</p>
        <p>预约地点：{{ state.selectedRecord.nameMerge }}</p>
        <p>预约信息：{{ state.selectedRecord.title }}</p>
        <div class="members-row">
          <span>全部成员：</span>
          <div class="members">
            <div
              v-for="member in state.selectedRecord.teams"
              :key="member.member_id"
              class="member"
            >
              <span
                :class="{ isMySelf: member.member_id === state.UserInfo.id }"
                >{{ member.member_name }} ({{ member.member_id }})
              </span>
              <span
                :class="{
                  statusPending: member.isAuthorized === '0',
                  statusAgreed: member.isAuthorized === '1',
                  statusRejected: member.isAuthorized === '2',
                }"
                class="memberStatus"
                >{{
                  member.isAuthorized === "0"
                    ? "待确认"
                    : member.isAuthorized === "1"
                    ? "同意邀请"
                    : member.isAuthorized === "2"
                    ? "拒绝邀请"
                    : ""
                }}
              </span>
            </div>
          </div>
        </div>
        <a-divider dashed />
        <div class="modal-footer-success">
          <a-button
            type="primary"
            v-if="state.selectedRecord.status != '21'"
            class="cancel-button-success"
            @click="onHideModal"
            >确定</a-button
          >
        </div>
        <!-- <div
          class="modal-footer"
          v-if="state.selectedRecord.status_name === '预约待确认'"
        >
          <a-button class="cancel-button" @click="onHideModal">拒绝</a-button>
          <a-button type="primary" class="confirm-button" @click="onHideModal"
            >接受</a-button
          >
        </div>
        <div
          class="modal-footer-success"
          v-else-if="
            state.selectedRecord.status_name === '预约成功' ||
            state.selectedRecord.status_name === '预约待审核'
          "
        >
          <a-button
            type="primary"
            :disabled="
              state.selectedRecord.cancel_ok === '1'
                ? false
                : true
            "
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
        <p v-else>签到时间：{{ state.selectedRecord.checkInTime }}</p> -->
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
}

.red {
  color: red;
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

  .memberStatus {
    margin-left: 3px;
  }

  .statusRejected {
    color: #ff4d4f;
  }

  .statusAgreed {
    color: #52c41a;
  }

  .statusPending {
    color: #d9d9d9;
  }
}
.ant-tag-default {
  color: rgba(97, 97, 97, 0.5);
}
</style>
