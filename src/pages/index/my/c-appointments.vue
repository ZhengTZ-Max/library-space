<script setup>
import { ref, reactive } from "vue";

const onCheckedForLocation = ref(true);
const onCheckedForData = ref(false);
const onCheckedForTime = ref(false);

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
  tiemValue: "15:00~19:00",
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
</script>

<template>
  <div class="table">
    <a-tabs v-model:activeKey="activeKey" size='middle'>
      <a-tab-pane key="seat" tab="常用座位"></a-tab-pane>
      <a-tab-pane key="seminar" tab="常用研讨室"></a-tab-pane>
    </a-tabs>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a type="primary" @click="onShowModal(record)">预约</a>
          </span>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal
    v-model:open="state.isModalVisible"
    title="快速预约"
    @ok="onHideModal"
  >
    <template #footer>
      <a-button key="cancel" @click="onHideModal">取消</a-button>
      <a-button key="submit" type="primary" @click="onHideModal">确认</a-button>
    </template>
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
    </div>
  </a-modal>
</template>

<style scoped lang="less">
.table {
  padding-left: 30px;
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
</style>
