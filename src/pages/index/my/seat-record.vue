<script setup>
import { ref, reactive } from "vue";

const state = reactive({
  activeKey: "seat",
  segmentedInfo: ["预约记录", "违约记录", "权限查询"],
});

const segmentedValue = ref(state.segmentedInfo[0]);

const columns = [
  {
    title: "座位",
    dataIndex: "seat",
    key: "seat",
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
    seat: "图书馆-2F-外文特藏阅览室: 016",
    time: "2023-12-01 16:00~18:00",
    result_info: "预约成功",
  },
  {
    key: "2",
    seat: "图书馆-2F-外文特藏阅览室: 015",
    time: "2023-12-01 16:00~18:00",
    result_info: "使用中",
  },
  {
    key: "3",
    seat: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已结束",
  },
  {
    key: "4",
    seat: "图书馆-2F-外文特藏阅览室: 014",
    time: "2023-12-01 16:00~18:00",
    result_info: "已取消",
  },
];
</script>
<template>
  <div class="record">
    <a-tabs v-model:activeKey="activeKey" size="middle">
      <a-tab-pane key="seat" tab="普通座位"></a-tab-pane>
      <a-tab-pane key="study" tab="研习座位"></a-tab-pane>
      <a-tab-pane key="seminar" tab="考研座位"></a-tab-pane>
    </a-tabs>

    <div class="segmented">
      <a-segmented
        v-model:value="segmentedValue"
        block
        :options="state.segmentedInfo"
      />
    </div>
    <div class="table">
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'result_info'">
            <span>
              <a-tag class="custom-tag"
                :color="
                  record.result_info === '预约成功'
                    ? 'success'
                    : record.result_info === '使用中'
                    ? 'processing'
                    : 'default'
                "
              >
                {{ record.result_info }}
              </a-tag>
            </span>
          </template>

          <template v-if="column.key === 'action'">
            <template v-if="record.key === '1'">
              <span>
                <a class="red" type="primary" @click="onShowModal(record)"
                  >取消</a
                >
                <a-divider type="vertical" />
                <a type="primary" @click="onShowModal(record)">预约</a>
              </span>
            </template>
            <template v-else>
              <span>
                <a type="primary" @click="onShowModal(record)">预约</a>
              </span>
            </template>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped lang="less">
.record {
  padding-left: 30px;
}


.red {
  color: red;
}
.segmented {
  width: 386px;
  height: 36px;
}
.ant-segmented {
  border-radius: 21px;
}
.ant-segmented {
  background-color: #f3f4f8;
}
:root {
  --antd-segmented-selected-color: #ffffff;
}
.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 30px;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
}
</style>
