<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import PageSizeCom from "@/components/PageSizeCom.vue";
import { getLostAndFoundList } from "@/request/lostandfound";

const store = useStore();
const onCheckedForLocation = ref(true);

const state = reactive({
  total: 0,
  currentPage: 1,
  activeKey: "apply",
  isModalVisible: false,
  selectedRecord: "",
  data: [],
});

onMounted(() => {
  fetch();
});

const fetch = async () => {
  try {
    const res = await getLostAndFoundList();
    if (res.code == 0) {
      state.data = res.data.list;
    } else {
      state.data = [];
    }
  } catch (error) {
    state.data = [];
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

const onChangePage = (page, pageSize) => {
  state.currentPage = page;
};

const columns = [
  {
    title: "物品图片",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "物品招领柜",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "违约时间",
    dataIndex: "time",
    key: "time",
  },
];

// const data = [
//   {
//     key: "1",
//     image:
//       "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
//     location: "基础馆-1F-1号柜:08格",
//     time: "2024-06-01 09:57:00",
//   },
// ];
</script>

<template>
  <div class="record">
    <div class="my-appointment">
      <div class="indicator"></div>
      <span class="text">我的违约</span>
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
            <template v-if="column.key === 'image'">
              <a-image
                :src="record.image || 'default-poster-url.jpg'"
                :width="100"
                :preview="false"
              />
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
.my-appointment {
  margin-top: 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.indicator {
  width: 4px;
  height: 16px;
  background-color: #1890ff; /* 蓝色，可以根据需要调整 */
  margin-right: 8px;
  border-radius: 10px;
}

.text {
  color: #333; /* 文字颜色，可以根据需要调整 */
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
</style>
