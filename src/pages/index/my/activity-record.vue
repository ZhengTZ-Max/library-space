<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import {
  getActivityRecordList,
  getActivityDetail,
  saveComments,
} from "@/request/activity-record";

import PageSizeCom from "@/components/PageSizeCom.vue";
import MyActivityRecordDetailDrawer from "@/components/MyActivityRecordDetailDrawer.vue";

const store = useStore();
const onCheckedForLocation = ref(true);

const state = reactive({
  activeKey: "1",
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],
  isShowDrawer: false,

  drawerDetailsInfo: {
    activeKey: "",

    selectedDetails: {},

    selectedDate: "",
    selectedTimeList: [],
    appointmentTime: "",
    isShowTextArea: false,
    comments: "",
  },
});

const columns = [
  {
    title: "活动海报",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "活动名称",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "地点",
    dataIndex: "nameMerge",
    key: "nameMerge",
  },
  {
    title: "时间",
    dataIndex: "show_date",
    key: "show_date",
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

const columnsForDraft = [
  {
    title: "活动海报",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "活动名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "上次编辑时间",
    dataIndex: "time_last",
    key: "time_last",
  },
  {
    title: "操作",
    key: "action",
  },
];

const onShowDrawer = (record) => {
  state.drawerDetailsInfo.activeKey = state.activeKey;
  // state.drawerDetailsInfo.selectedRecord = record;
  fetchGetActivityDetail(record.id);
};
const onHideDrawer = () => {
  state.isShowDrawer = false;
  // state.drawerDetailsInfo.selectedRecord = {};
  state.drawerDetailsInfo.selectedDetails = {};
};

const statusClass = computed(() => {
  switch (state.selectedRecord.status_name) {
    case "报名中":
      return "status-ongoing";
    case "已结束":
      return "status-ended";
    case "等待审核":
      return "status-pending";
    case "报名成功":
      return "status-success";
    default:
      return "status-default";
  }
});

const dates = ["2024-02-19", "2024-02-20", "2024-02-21", "2024-02-22"];
const times = ["08:00~10:00", "10:00~12:00", "13:00~15:00"];

onMounted(() => {
  fetch();
});

const fetch = async () => {
  try {
    let params = {
      ilk: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getActivityRecordList(params);
    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total || 0;
    } else {
      state.data = [];
      state.total = 0;
    }
  } catch (error) {
    state.data = [];
    state.total = 0;
    console.log(error);
  }
};

const fetchGetActivityDetail = async (id) => {
  try {
    initDrawerDetailsInfo();
    let params = {
      ilk: state.activeKey,
      id,
    };
    const res = await getActivityDetail(params);
    if (res?.code === 0) {
      state.drawerDetailsInfo.selectedDetails = res?.data;
      if (state.activeKey === "1") { 
        state.isShowDrawer = true;
      } else {
        onDealWithDate();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const initDrawerDetailsInfo = () => {
  state.drawerDetailsInfo.selectedDate = "";
  state.drawerDetailsInfo.selectedTimeList = [];
  state.drawerDetailsInfo.appointmentTime = "";
};

const fetchSaveComments = async () => {
  try {
    let params = {
      id: state.selectedRecord.id,
      comments: state.comments,
    };
    const res = await saveComments(params);
    if (res?.code === 0) {
    }
  } catch (error) {
    console.log(error);
  }
};

// tab 切换
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

const onChangePage = (page, pageSize) => {
  state.currentPage = page;
  fetch();
};


const onSaveComments = () => {
  fetchSaveComments();
};

const onDealWithDate = () => {

  state.drawerDetailsInfo.selectedDetails.time.forEach((dateItem) => {
    // 检查当前日期的 time 数组
    const hasSubscribed = dateItem.time.some((timeItem) => {
      let isSelected = false;
      if (timeItem.is_subscribe === 1) {
        isSelected = true;
        state.drawerDetailsInfo.appointmentTime = timeItem.id;
      }
      return isSelected;
    });

    // 根据是否有 is_subscribe = 1 来设置 isSelected
    dateItem.isAppointment = hasSubscribed;
    if (hasSubscribed && state.drawerDetailsInfo.selectedDate === "") {
      
      state.drawerDetailsInfo.selectedDate = dateItem.date;
    }

    if (dateItem.date === state.drawerDetailsInfo.selectedDate) {
      state.drawerDetailsInfo.selectedTimeList = dateItem.time;
    }
  });
  state.isShowDrawer = true;
  // console.log(state.selectedDate);
  // console.log(state.appointmentTime);
  // console.log(state.selectedDetails.time);
};


</script>

<template>
  <div class="record">
    <a-tabs
      v-model:activeKey="state.activeKey"
      size="middle"
      @change="onChangeTab"
    >
      <a-tab-pane key="1" tab="申请记录"></a-tab-pane>
      <a-tab-pane key="2" tab="报名记录"></a-tab-pane>
      <a-tab-pane key="3" tab="草稿箱"></a-tab-pane>
    </a-tabs>

    <div class="table" v-if="state.activeKey !== '3'">
      <PageSizeCom v-if="state.data?.length > 0">
        <a-table
          :columns="columns"
          :data-source="state.data"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-image
                :src="record.poster[0].file_path"
                :width="100"
                :preview="false"
              />
            </template>
            <template v-if="column.key === 'status_name'">
              <span>
                <a-tag
                  class="custom-tag"
                  :color="
                    record.status_name === '报名成功'
                      ? 'success'
                      : record.status_name === '报名中'
                      ? 'processing'
                      : record.status_name === '等待审核'
                      ? 'warning'
                      : 'default'
                  "
                >
                  {{ record.status_name }}
                </a-tag>
              </span>
            </template>

            <template v-if="column.key === 'action'">
              <template v-if="record.status_name === '等待审核'">
                <span>
                  <a class="red" type="primary" @click="onShowDrawer(record)"
                    >取消</a
                  >
                  <a-divider type="vertical" />
                  <a type="primary" @click="onShowDrawer(record)">修改</a>
                </span>
              </template>
              <template v-else>
                <span>
                  <a type="primary" @click="onShowDrawer(record)">查看</a>
                </span>
              </template>
            </template>
          </template>
        </a-table>
      </PageSizeCom>
      <a-empty v-else />
    </div>

    <div class="table" v-if="state.activeKey === '3'">
      <PageSizeCom v-if="state.data?.length > 0">
        <a-table
          :columns="columnsForDraft"
          :data-source="state.data"
          :pagination="false"
          @change="onChangePage"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-image
                :src="record.image || 'default-poster-url.jpg'"
                :width="100"
                :preview="false"
              />
            </template>
            <template v-if="column.key === 'action'">
              <span>
                <a type="primary" @click="onShowModal(record)">编辑</a>
              </span>
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

    <a-drawer
      :open="state.isShowDrawer"
      @close="onHideDrawer"
      :closable="false"
      :footer="null"
      width="800px"
      destroyOnClose
    >
      <div class="drawer-title">
        <div class="title-text">
          <div class="indicator_title"></div>
          <span class="text">活动详情</span>
        </div>
        <img src="@/assets/close.svg" alt="" />
      </div>
      <a-divider />
      <MyActivityRecordDetailDrawer :data="state.drawerDetailsInfo" />
    </a-drawer>
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
.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 10px;
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

.drawer-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.title-text {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.indicator_title {
  width: 4px;
  height: 16px;
  background-color: #1890ff;
  margin-right: 8px;
  border-radius: 10px;
}

.text {
  color: #333; /* 文字颜色，可以根据需要调整 */
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;

  .nav-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .indicators {
    display: flex;
    gap: 8px;
    margin: 0 16px;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ccc;
  }

  .indicator.active {
    background-color: #007bff;
  }
}

.ant-divider-horizontal {
  margin: 0 !important;
  margin-bottom: 15px !important;
}
</style>
