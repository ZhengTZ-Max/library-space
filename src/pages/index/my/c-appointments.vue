<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { showToast, showConfirmDialog, showImagePreview } from "vant";

// import { format, addDays } from "date-fns"; // 引入日期工具
import { message } from "ant-design-vue";
import moment from "moment";
import { exchangeDateTime } from "@/utils";
import {
  getSeatAreaDate,
  getSeatOftenDate,
  getSeatCollectList,
  getSeatOftenList,
  cancelSeatCollect,
  getSeatInfo,
} from "@/request/common";

const onCheckedForLocation = ref(true);
const onCheckedForData = ref(false);
const onCheckedForTime = ref(false);
const store = useStore();
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
  timeSelectStart: "",
  timeSelectEnd: "",

  seatList: [],
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

onMounted(() => {
  fetch();
  fetchSeatInfo();
});

const fetchSeatInfo = async () => {
  let res = await getSeatInfo();
  console.log(res);
};

const fetch = () => {
  console.log(state.activeKey, state.quickMode);
  if (state.activeKey == 1) {
    // 座位
    // 获取开放日期
    fetchSeatDate();
  } else {
    // 空间
  }
};

const fetchSeatDate = async () => {
  try {
    let res = null;
    if (state.quickMode == 1) {
      // 收藏
      res = await getSeatAreaDate();
    } else {
      // 常用
      res = await getSeatOftenDate();
    }

    if (res && res.code == 0 && res.data.length > 0) {
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

      state.times = state.dates.find(
        (item) => item.day == state.dateValue
      ).opentimes;
      state.timesSelectList = state.times.map((item) => {
        return {
          label: item.Times,
          value: item.Times,
          start: item.startTime,
          end: item.endTime,
        };
      });
      state.timeValue = state.timesSelectList[0].value;
      state.timeSelectStart = state.timesSelectList[0].start;
      state.timeSelectEnd = state.timesSelectList[0].end;

      fetchSeatList();
    } else {
      console.log(res);
      state.dates = [];
      state.datesSelectList = [];
      state.dateValue = "";

      state.times = [];
      state.timesSelectList = [];
      state.timeValue = "";
      state.timeSelectStart = "";
      state.timeSelectEnd = "";

      state.seatList = [];
      message.error(res.msg);
    }
  } catch (error) {
    state.dates = [];
    state.datesSelectList = [];
    state.dateValue = "";

    state.times = [];
    state.timesSelectList = [];
    state.timeValue = "";
    state.timeSelectStart = "";
    state.timeSelectEnd = "";
    console.log(error);
  }
};

const fetchSeatList = async () => {
  try {
    let params = {
      day: state.dateValue,
      startTime: state.timeSelectStart,
      endTime: state.timeSelectEnd,
    };

    let res = null;
    if (state.quickMode == 1) {
      // 收藏
      res = await getSeatCollectList(params);
    } else {
      // 常用
      res = await getSeatOftenList(params);
    }

    if (res.code == 0) {
      state.seatList = res.data;
      state.total = state.seatList.length;
    } else {
      state.seatList = [];
      state.total = 0;
      message.error(res.msg);
    }
  } catch (error) {
    state.seatList = [];
    state.total = 0;
    console.log(error);
  }
};

const onCancelCollect = async (record) => {
  showConfirmDialog({
    title: $t("V4_remove_from_favorites"),
    message: `${record.nameMerge}:${record.spacename}`,
  }).then(async () => {
    try {
      let params = {
        spaceId: record.spaceId,
      };
      let res = await cancelSeatCollect(params);
      if (res.code == 0) {
        message.success(res.msg);
        if (state.activeKey == 1) {
          // 座位
          fetchSeatList();
        }
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const onShowModal = (record) => {
  state.isModalVisible = true;
  state.selectLocationName = record.location;
};
const onHideModal = () => {
  state.isModalVisible = false;
  state.selectLocationName = "";
};

const onChangeTab = (key) => {
  state.activeKey = key;
  fetch();
};

const onChangeQMode = (item) => {
  state.quickMode = item.value;
  fetch();
};

const onChangeDate = (e) => {
  state.times = state.dates.find(
    (item) => item.day == state.dateValue
  ).opentimes;
  state.timesSelectList = state.times.map((item) => {
    return {
      label: item.Times,
      value: item.Times,
      start: item.startTime,
      end: item.endTime,
    };
  });
  state.timeValue = state.timesSelectList[0].value;
  state.timeSelectStart = state.timesSelectList[0].start;
  state.timeSelectEnd = state.timesSelectList[0].end;

  if (state.activeKey == 1) {
    fetchSeatList();
  }
};

const onChangeTime = (e) => {
  let item = state.timesSelectList.find((item) => item.value == e.target.value);
  state.timeSelectStart = item.start;
  state.timeSelectEnd = item.end;

  console.log(state.timeSelectStart, state.timeSelectEnd);
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
  <div class="table">
    <a-tabs
      v-model:activeKey="state.activeKey"
      size="middle"
      @change="onChangeTab"
    >
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
          @click="onChangeQMode(item)"
        >
          {{ item?.label }}
        </div>
      </div>

      <div class="date-time-selector">
        <div class="date-selector">
          <span>日期：</span>
          <a-radio-group v-model:value="state.dateValue" @change="onChangeDate">
            <a-radio
              style="width: 150px;"
              v-for="item in state.datesSelectList"
              :key="item.value"
              :value="item.value"
              >{{ item.value }}({{ item.label }})</a-radio
            >
          </a-radio-group>
        </div>
        <div class="time-selector">
          <span>时间：</span>
          <a-radio-group v-model:value="state.timeValue" @change="onChangeTime">
            <a-radio
              style="width: 150px;"
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
      <a-table
        :columns="columns"
        :data-source="state.seatList"
        :pagination="pagination"
        @change="onChangePage"
        :scroll="{ y: 500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'location'">
            {{ record.nameMerge }}
          </template>
          <template v-if="column.key === 'seating'">
            {{ record.spacename }}
          </template>
          <template v-if="column.key === 'action'">
            <span>
              <a class="red" type="primary" @click="onCancelCollect(record)"
                >取消收藏</a
              >
              <a-divider type="vertical" />
              <a-button
                type="link"
                :disabled="record.isValid != '1'"
                @click="onShowModal(record)"
                >预约</a-button
              >
            </span>
          </template>
        </template>
      </a-table>
    </div>
    <a-empty v-else class="empty" />
  </div>
  <a-modal
    v-model:open="state.isModalVisible"
    title="快速预约"
    :footer="null"
    @ok="onHideModal"
  >
    <!-- <template #footer>
      <a-button key="cancel" @click="onHideModal">取消</a-button>
      <a-button key="submit" type="primary" @click="onHideModal">确认</a-button>
    </template> -->
    <a-divider />
    <div>
      <div class="dialog-title">地点</div>
      <div class="checkboxItem">
        <a-radio v-model:checked="onCheckedForLocation">{{
          state.selectLocationName
        }}</a-radio>
      </div>
    </div>
    <div>
      <div class="dialog-title">日期</div>
      <div class="checkboxItem">
        <!-- <a-checkbox-group v-model:value="state.dateValue" :options="state.dates" /> -->
        <a-radio-group v-model:value="state.dateValue">
          <template v-for="item in state.dates" :key="state.dates.value">
            <a-radio :value="item.value">{{ item.label }}</a-radio>
          </template>
        </a-radio-group>
      </div>
    </div>
    <div>
      <div class="dialog-title">时间</div>
      <div class="checkboxItem">
        <!-- <a-checkbox-group v-model:value="state.dateValue" :options="state.dates" /> -->
        <a-radio-group v-model:value="state.tiemValue">
          <template v-for="item in state.times" :key="state.times.value">
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
</template>

<style scoped lang="less">
.table {
  padding-left: 30px;
  position: relative;

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
        margin-left: 20px; /* 添加左侧间距 */
        margin-top: 10px;
      }
    }
  }
}
.table_content {
  margin-top: 60px;
  height: 50vh;
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
