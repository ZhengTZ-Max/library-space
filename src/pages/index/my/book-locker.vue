<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import PageSizeCom from "@/components/PageSizeCom.vue";
import { message } from "ant-design-vue";

import { getBookLockerList } from "@/request/book-locker";
import { getUserInfo } from "@/utils";

const store = useStore();
const onCheckedForLocation = ref(true);

const state = reactive({
  userInfo: getUserInfo(),
  total: 0,
  currentPage: 1,
  pageSize: 10,

  activeKey: "14",
  isModalVisible: false,
  selectedRecord: "",

  quickMode: 1,
  quickModeList: [
    { value: 1, label: "预约记录" },
    { value: 0, label: "违约记录" },
  ],

  data: [],
});

onMounted(() => {
  fetch();
});

watch(
  () => [state.activeKey, state.quickMode],
  (v) => {
    state.currentPage = 1;
    fetch();
  }
);

const fetch = async () => {
  try {
    let params = {
      type: state.activeKey,
      isOrder: state.quickMode,
      page: state.currentPage,
      size: state.pageSize,
    };
    const res = await getBookLockerList(params);
    if (res.code === 1) {
      state.data = res.data.list;
      state.total = res.data.count;
    } else {
      state.data = [];
      state.total = 0;
      message.error(res.msg);
    }
    console.log(state.data);
  } catch (error) {
    state.data = [];
    state.total = 0;
    console.log(error);
  }
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

const onChangePage = (page, pageSize) => {
  state.currentPage = page;
};

const onCancel = async (record) => {
  try {
    let params = {
      orderId: record.id,
    };
    showConfirmDialog({
      title: `确认取消`,
      message: `地点：${record.nameMerge}\n时间:${record.beginTime} - ${record.endTime}`,
      messageAlign: "left",
    })
      .then(async () => {
        const res = await cancelBookLocker(params);
        if (res.code === 1) {
          message.success(res.msg);
          fetch();
        } else {
          message.error(res.msg);
        }
        // state.apptResult = {
        //   seatInfo: res?.data,
        //   show: true,
        //   title: res?.code == 0 ? "预约成功" : "预约失败",
        //   type: res?.code == 0 ? "success" : "error",
        //   msg: (res?.code != 0 && res?.message) || "",
        // };
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {}
};
</script>

<template>
  <div class="record">
    <a-tabs v-model:activeKey="state.activeKey" size="middle">
      <a-tab-pane key="14" tab="日柜"></a-tab-pane>
      <a-tab-pane key="15" tab="周柜"></a-tab-pane>
      <a-tab-pane key="16" tab="长期柜"></a-tab-pane>
    </a-tabs>
    <div class="quickBtns" style="width: 220px; margin: 10px 10px">
      <div
        v-for="item in state.quickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        @click="state.quickMode = item?.value"
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
            <template v-if="column.key === 'location'">
              {{ record.nameMerge }}
            </template>
            <template v-if="column.key === 'time'">
              <div v-if="state.quickMode == 1">
                {{ record.beginTime }} - {{ record.endTime }}
              </div>
              <div v-else>
                {{ record.time }}
              </div>
            </template>

            <template v-if="column.key === 'status'">
              <span>
                <a-tag
                  class="custom-tag"
                  :color="
                    record.statusMsg === '预约成功'
                      ? 'success'
                      : record.statusMsg === '使用中'
                      ? 'processing'
                      : record.statusMsg === '未签到' ||
                        record.statusMsg === '使用超时'
                      ? 'error'
                      : 'default'
                  "
                >
                  {{ record.statusMsg }}
                </a-tag>
              </span>
            </template>

            <template v-if="column.key === 'action'">
              <template v-if="record.statusMsg === '预约成功'">
                <span>
                  <a class="red" type="primary" @click="onCancel(record)"
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
            state.selectedRecord.statusMsg === '预约成功'
              ? 'status-success'
              : state.selectedRecord.statusMsg === '使用中'
              ? 'status-active'
              : state.selectedRecord.statusMsg === '未签到' ||
                state.selectedRecord.statusMsg === '使用超时'
              ? 'status-nosign'
              : ''
          "
          >{{ state.selectedRecord.statusMsg }}</span
        >
      </p>
      <p>预约用户：{{ state.userInfo.name }}({{ state.userInfo.id }})</p>
      <p>预约时间：{{ state.selectedRecord.createTime }}</p>
      <p>开始时间：{{ state.selectedRecord.startTime }}</p>
      <p>结束时间：{{ state.selectedRecord.endTime }}</p>
      <p>预约地点：{{ state.selectedRecord.nameMerge }}</p>

      <a-divider dashed />

      <div
        class="modal-footer-success"
        v-if="state.selectedRecord.statusMsg === '预约成功'"
      >
        <a-button
          type="primary"
          class="cancel-button-success"
          @click="onCancel(state.selectedRecord)"
          >取消预约</a-button
        >
      </div>
      <p v-else-if="state.selectedRecord.statusMsg === '未签到'">
        违约时间：{{ state.selectedRecord.checkInTime }}
      </p>
      <p v-else-if="state.selectedRecord.statusMsg === '已取消'">
        取消时间：{{ state.selectedRecord.checkInTime }}
      </p>
      <div v-else-if="state.selectedRecord.statusMsg === '已结束'">
        <p>存物时间：{{ state.selectedRecord.startTime }}</p>
        <p>取物时间：{{ state.selectedRecord.endTime }}</p>
      </div>
      <div v-else-if="state.selectedRecord.statusMsg === '使用超时'">
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
  margin-top: 30px;
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
