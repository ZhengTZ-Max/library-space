<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
// import { format, addDays } from "date-fns"; // 引入日期工具

const onCheckedForLocation = ref(true);
const onCheckedForData = ref(false);
const onCheckedForTime = ref(false);
const store = useStore();
const state = reactive({
  isModalVisible: false,
  selectLocationName: "",
  activeKey: "seat",
  dates: [
    {
      // 使用date utils
      label: "2023-11-28 (今天)",
      value: "2023-11-28 (今天)",
    },
    {
      // 使用date utils
      label: "2023-11-29 (明天)",
      value: "2023-11-29 (明天)",
    },
    {
      // 使用date utils
      label: "2023-11-30 (后天)",
      value: "2023-11-30 (后天)",
    },
  ],
  dateValue: "2023-11-28 (今天)",

  times: [
    {
      // 使用date utils
      label: "10:00~14:00",
      value: "10:00~14:00",
    },
    {
      // 使用date utils
      label: "15:00~19:00",
      value: "15:00~19:00",
    },
  ],
  timeValue: "15:00~19:00",
});

const onShowModal = (record) => {
  state.isModalVisible = true;
  state.selectLocationName = record.location;
};
const onHideModal = () => {
  state.isModalVisible = false;
  state.selectLocationName = "";
};

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

const data = [
  {
    key: "1",
    location: "图书馆-2F-外文特藏阅览室",
    seating: "015",
  },
  {
    key: "2",
    location: "图书馆-2F-外文特藏阅览室",
    seating: "015",
  },
  {
    key: "3",
    location: "图书馆-2F-外文特藏阅览室",
    seating: "015",
  },
];

// 生成日期和时间选项
// const generateDateAndTimeOptions = () => {
//   const today = new Date();
//   for (let i = 0; i < 3; i++) {
//     const date = addDays(today, i);
//     state.dates.push({
//       label: format(date, 'yyyy-MM-dd (E)'),
//       value: format(date, 'yyyy-MM-dd (E)'),
//     });
//     state.times.push({
//       label: `${format(date, 'HH:mm')}~${format(date, 'HH:mm', { addHours: 8 })}`, // 假设时间范围
//       value: `${format(date, 'HH:mm')}~${format(date, 'HH:mm', { addHours: 8 })}`,
//     });
//   }
// };

// generateDateAndTimeOptions(); // 生成选项
</script>

<template>
  <div class="table">
    <a-tabs v-model:activeKey="activeKey" size="middle">
      <a-tab-pane key="seat" tab="座位"></a-tab-pane>
      <a-tab-pane key="seminar" tab="空间"></a-tab-pane>
    </a-tabs>
    <div class="header">
      <div
        class="toggleLang"
        :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
      >
        <div class="langItem langActive activeBtn">收藏</div>
        <div class="langItem activeBtn">常用</div>
      </div>

      <div class="date-time-selector">
        <div class="date-selector">
          <span>日期：</span>
          <a-radio-group v-model:value="state.dateValue">
            <template v-for="item in state.dates" :key="item.value">
              <a-radio :value="item.value">{{ item.label }}</a-radio>
            </template>
          </a-radio-group>
        </div>
        <div class="time-selector">
          <span>时间：</span>
          <a-radio-group v-model:value="state.timeValue">
            <template v-for="item in state.times" :key="item.value">
              <a-radio :value="item.value">{{ item.label }}</a-radio>
            </template>
          </a-radio-group>
        </div>
      </div>
    </div>

    <div class="table_content">
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span>
              <a class="red" type="primary" @click="onShowModal(record)"
                >取消收藏</a
              >
              <a-divider type="vertical" />
              <a type="primary" @click="onShowModal(record)">预约</a>
            </span>
          </template>
        </template>
      </a-table>
    </div>
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
      margin-left: 240px;
      display: flex;
      margin-top: 10px;

      .date-selector,
      .time-selector {
        margin-left: 20px; /* 添加左侧间距 */
      }
    }

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
        padding: 2px 34px;
        min-width: 100px;
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
}
.table_content {
  margin-top: 60px;
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
</style>
