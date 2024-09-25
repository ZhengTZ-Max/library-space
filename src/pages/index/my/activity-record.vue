<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";

const store = useStore();
const onCheckedForLocation = ref(true);

const state = reactive({
  activeKey: "apply",
  isModalVisible: false,
  selectedRecord: "",
});

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
    title: "地点",
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

const data = [
  {
    key: "1",
    image: "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "等待审核",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    time_last: "2023-11-28 17:42",
  },
  {
    key: "2",
    image: "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "进行中", 
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    time_last: "2023-11-28 17:42",
  },
  {
    key: "3",
    image: "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "已结束",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    time_last: "2023-11-28 17:42",
  },
  {
    key: "4",
    image: "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "报名成功",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    time_last: "2023-11-28 17:42",
  },
];
</script>

<template>
  <div class="record">
    <a-tabs v-model:activeKey="state.activeKey" size="middle">
      <a-tab-pane key="apply" tab="申请记录"></a-tab-pane>
      <a-tab-pane key="register" tab="报名记录"></a-tab-pane>
      <a-tab-pane key="draft" tab="草稿箱"></a-tab-pane>
    </a-tabs>

    <div class="table">
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.image || 'default-poster-url.jpg'"
              :width="100"
              :preview="false"
            />
          </template>
          <template v-if="column.key === 'status'">
            <span>
              <a-tag
                class="custom-tag"
                :color="
                  record.status === '报名成功'
                    ? 'success'
                    : record.status === '进行中'
                    ? 'processing'
                    : record.status === '等待审核'
                    ? 'warning'
                    : 'default'
                "
              >
                {{ record.status }}
              </a-tag>
            </span>
          </template>

          <template v-if="column.key === 'action'">
            
            <template v-if="record.status === '等待审核'">
              <span>
                <a class="red" type="primary" @click="onShowModal(record)"
                  >取消</a
                >
                <a-divider type="vertical" />
                <a type="primary" @click="onShowModal(record)">修改</a>
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


    <div class="table">
      <a-table :columns="columnsForDraft" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.image || 'default-poster-url.jpg'"
              :width="100"
              :preview="false"
            />
          </template>
          <template  v-if="column.key === 'action'">
              <span>
                <a type="primary" @click="onShowModal(record)">编辑</a>
              </span>
            </template>

        </template>
      </a-table>
    </div>
  </div>

</template>

<style scoped lang="less">
.record {
  padding-left: 30px;
  position: relative;
}
.custom-tag { 
  border-radius: 12px;
}
.table {
  margin-top: 10px;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
}
.red {
  color: red;
}


</style>
