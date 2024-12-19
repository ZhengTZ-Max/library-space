<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { showToast, showConfirmDialog, showImagePreview } from "vant";

// import { format, addDays } from "date-fns"; // 引入日期工具
import { message } from "ant-design-vue";
import moment from "moment";
import { exchangeDateTime } from "@/utils";
import {
  cancelSeatCollect,
  getOftenTime,
  getOftenTableList,
  getCollectTime,
  getCollectTableList,
} from "@/request/common";
import { getSpaceConfirm } from "@/request/seat.js";

import PageSizeCom from "@/components/PageSizeCom.vue";
import ShowInfoToast from "@/components/ShowInfoToast.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,

  isModalVisible: false,
  selectLocationName: "",
  activeKey: "1",

  quickMode: 1,
  quickModeList: [
    { value: 1, label: "收藏" },
    { value: 2, label: "常用" },
  ],

  dates: [],
  datesSelectList: [],
  dateValue: "",

  times: [],
  timesSelectList: [],
  timeValue: "",

  seatList: [],

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },
});

const columns = [
  {
    title: "地点",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "座位",
    dataIndex: "seating",
    key: "seating",
  },
  {
    title: "操作",
    key: "action",
  },
];
const columnsForSpace = [
  {
    title: "地点",
    dataIndex: "location",
    key: "location",
  },

  {
    title: "操作",
    key: "action",
  },
];

onMounted(() => {
  fetch();
});

watch(
  () => [state.activeKey, state.quickMode],
  () => {
    fetch();
  }
);

watch(
  () => state.dateValue,
  (v) => {
    let findDate = state.dates.find((item) => item.day == state.dateValue);
    if (findDate) {
      state.times = findDate.times;
      state.timesSelectList = state.times.map((item) => {
        return {
          label: item.show_time,
          value: item.show_time,
          start: item.start,
          end: item.end,
        };
      });
      state.timeValue = state.timesSelectList[0].value;
    }
  }
);

const fetch = () => {
  initTime();
  console.log(state.activeKey, state.quickMode);
  if (state.activeKey == 1) {
    // 座位
    // 获取开放日期
    fetchTimeList();
  } else {
    // 空间
    fetchTableList();
  }
};

const initTime = () => {
  state.dates = [];
  state.datesSelectList = [];
  state.dateValue = "";

  state.times = [];
  state.timesSelectList = [];
  state.timeValue = "";

  state.seatList = [];
  state.total = 0;
};

const fetchTimeList = async () => {
  try {
    let params = {
      type: state.activeKey,
    };
    let res = null;
    if (state.quickMode == 1) {
      // 收藏
      res = await getCollectTime(params);
    } else {
      // 常用
      res = await getOftenTime(params);
    }
    console.log(res);
    dealwitchTime(res);
  } catch (error) {
    console.log(error);
  }
};

const dealwitchTime = (res) => {
  if (res && res.code == 0) {
    if (res.data.length > 0) {
      state.dates = res.data;

      state.datesSelectList = res.data.map((item) => {
        let label = "";
        if (moment().format("YYYY-MM-DD") == item.day) {
          label = "今天";
        } else if (
          exchangeDateTime(new Date(), 25).format("YYYY-MM-DD") == item.day
        ) {
          label = "明天";
        } else if (moment().add(2, "days").format("YYYY-MM-DD") == item.day) {
          label = "后天";
        } else {
          label = exchangeDateTime(item.day, 4);
        }
        return {
          label,
          value: moment(item.day).format("YYYY-MM-DD"),
        };
      });
      console.log(state.datesSelectList);
      state.dateValue = state.datesSelectList[0].value;
      setTimeout(() => {
        fetchTableList();
      }, 1);
    } else {
      initTime();
    }
  } else {
    console.log(res);
    initTime();
    message.error(res.message);
  }
};

const fetchTableList = async () => {
  try {
    let params = null;
    if (state.activeKey == 1) {
      // 座位
      let findTimeRow = state.times?.find(
        (e) => e?.show_time == state.timeValue
      );
      params = {
        type: state.activeKey,
        day: state.dateValue,
        begin_time: findTimeRow?.start,
        end_time: findTimeRow?.end,
      };
    } else {
      // 空间
      params = {
        type: state.activeKey,
      };
    }
    let res = null;
    if (state.quickMode == 1) {
      // 收藏
      res = await getCollectTableList(params);
    } else {
      // 常用
      res = await getOftenTableList(params);
    }

    if (res.code == 0) {
      state.seatList = res.data;
      state.total = state.seatList.length;
    } else {
      state.seatList = [];
      state.total = 0;
      if (res && res.msg) {
        message.error(res.msg);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const onCancelCollect = async (record) => {
  showConfirmDialog({
    title: $t("V4_remove_from_favorites"),
    message: `${record.name_merge}:${record.space_name}`,
  }).then(async () => {
    try {
      let params = {
        space_id: record.space_id,
      };
      let res = await cancelSeatCollect(params);
      if (res.code == 0) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
      fetchTableList();
    } catch (error) {
      console.log(error);
    }
  });
};

const onApplyOrJumpDetail = (record) => {
  if (state.activeKey == 1) {
    // 座位
    // 只有reserve_type=1的可以直接调用预约接口，等于其他值的跳转到座位详情
    if (record.reserve_type == 1) {
      // 预约
      onSeatAppt(record);
    } else {
      // 跳转到座位详情
      router.push({
        path: "/seat/appointment",
        query: {
          id: record?.area_id,
          date: state.dateValue,
        },
      });
    }
  } else {
    // 空间
    // 跳转到空间详情
    router.push({
      path: "/space/apply",
      query: {
        id: record?.area_id,
      },
    });
  }
};

const onSeatAppt = async (record) => {
  try {
    let findTimeRow = state.times?.find((e) => e?.show_time == state.timeValue);
    let params = {
      seat_id: record?.space_id,
      segment: record?.segment,
      day: state.dateValue,
      startTime: findTimeRow?.start,
      endTime: findTimeRow?.end,
    };
    showConfirmDialog({
      title: `确认预约`,
      message: `地点：${record.name_merge}\n座位:${record.space_name}\n时间:${params.day} ${findTimeRow?.show_time}`,
      messageAlign: "left",
    })
      .then(async () => {
        const res = await getSpaceConfirm(params);

        // showToast({
        //   duration: 1500,
        //   message: res.message,
        //   forbidClick: true,
        // });

        state.apptResult = {
          seatInfo: res?.data,
          show: true,
          title: res?.code == 0 ? "预约成功" : "预约失败",
          type: res?.code == 0 ? "success" : "error",
          msg: (res?.code != 0 && res?.message) || "",
        };
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {}
};

const onChangeDateOrTime = (e) => {
  if (state.activeKey == 1) {
    // 座位 模块  其实此层if可以去掉，因为时间选择模块 只有在座位模块下才显示
    fetchTableList();
  }
  // 空间 模块下没有时间选择
};

const pagination = computed(() => ({
  total: state.total,
  current: state.currentPage,
  showSizeChanger: false,
}));

const onChangePage = (page, pageSize) => {
  // pagination : {current: 2, pageSize: 10, total: 132, showSizeChanger: false}
  // let { current } = pagination;

  console.log(page, pageSize);
  state.currentPage = page;
  fetch();
};

const handleShow = (v) => {
  state.apptResult.show = v;
};
</script>

<template>
  <div class="table">
    <a-tabs v-model:activeKey="state.activeKey" size="middle">
      <a-tab-pane key="1" tab="座位"></a-tab-pane>
      <a-tab-pane key="2" tab="空间"></a-tab-pane>
    </a-tabs>
    <div class="header">
      <div class="quickBtns">
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

      <div
        v-if="state.activeKey == 1 && state.dates.length > 0"
        class="date-time-selector"
      >
        <div class="date-selector">
          <span>日期：</span>
          <a-radio-group
            v-model:value="state.dateValue"
            @change="onChangeDateOrTime"
            style="flex: 1"
          >
            <a-radio
              style="width: 150px"
              v-for="item in state.datesSelectList"
              :key="item.value"
              :value="item.value"
              >{{ item.value }}({{ item.label }})</a-radio
            >
          </a-radio-group>
        </div>
        <div class="time-selector">
          <span>时间：</span>
          <a-radio-group
            v-model:value="state.timeValue"
            @change="onChangeDateOrTime"
            style="flex: 1"
          >
            <a-radio
              style="width: 150px"
              v-for="item in state.timesSelectList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</a-radio
            >
          </a-radio-group>
        </div>
      </div>
    </div>

    <div class="table_content" v-if="state.seatList.length > 0">
      <PageSizeCom>
        <a-table
          v-if="state.activeKey === '1'"
          :columns="columns"
          :data-source="state.seatList"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'location'">
              {{ record.name_merge }}
            </template>
            <template v-if="column.key === 'seating'">
              {{ record.space_name }}
            </template>
            <template v-if="column.key === 'action'">
              <span>
                <a
                  v-if="state.quickMode == 1"
                  class="red"
                  type="primary"
                  @click="onCancelCollect(record)"
                  >取消收藏</a
                >
                <a-divider v-if="state.quickMode == 1" type="vertical" />
                <a type="primary" @click="onApplyOrJumpDetail(record)">预约</a>
              </span>
            </template>
          </template>
        </a-table>
        <a-table
          v-if="state.activeKey === '2'"
          :columns="columnsForSpace"
          :data-source="state.seatList"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'location'">
              {{ record.name_merge }}
            </template>

            <template v-if="column.key === 'action'">
              <span>
                <a
                  v-if="state.quickMode == 1"
                  class="red"
                  type="primary"
                  @click="onCancelCollect(record)"
                  >取消收藏</a
                >
                <a-divider v-if="state.quickMode == 1" type="vertical" />
                <a type="primary" @click="onApplyOrJumpDetail(record)">预约</a>
              </span>
            </template>
          </template>
        </a-table>
      </PageSizeCom>
    </div>
    <a-empty v-else class="empty" />
    <div class="cPagination" v-if="state.seatList.length > 0">
      <a-pagination
        v-model:current="state.currentPage"
        :total="state.total"
        @change="onChangePage"
        :default-page-size="10"
        show-less-items
      />
    </div>
  </div>
  <ShowInfoToast
    v-if="state.apptResult.show"
    :isShow="state.apptResult.show"
    :type="state.apptResult.type"
    :title="state.apptResult.title"
    @handleShow="handleShow"
  >
    <template v-slot:content>
      <div class="toastItem">
        <span>时间：</span>
        <span>{{ state.apptResult?.seatInfo?.time }}</span>
      </div>
      <div class="toastItem">
        <span>地点：</span>
        <span>{{ state.apptResult?.seatInfo?.seat }}</span>
      </div>
      <div class="toastItem">
        <span>座位：</span>
        <span>{{ state.apptResult?.seatInfo?.no }}</span>
      </div>
      <div v-if="state.apptResult?.msg" class="toastItem">
        <span>提醒：</span>
        <span>{{ state.apptResult?.msg }}</span>
      </div>
    </template>
  </ShowInfoToast>
</template>

<style scoped lang="less">
.table {
  padding-left: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .red {
    color: red;
  }
  .header {
    display: flex;

    .date-time-selector {
      margin-left: 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .date-selector,
      .time-selector {
        display: flex;
        margin-left: 20px; /* 添加左侧间距 */
        margin-top: 10px;
      }
    }
  }
}
.table_content {
  margin-top: 60px;
  flex: 1;
  overflow: auto;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
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

.empty {
  margin-top: 20px;
}
</style>
