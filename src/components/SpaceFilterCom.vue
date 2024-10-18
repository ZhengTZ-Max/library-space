<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";

const store = useStore();
const props = defineProps({
  data: {
    type: Object,
  },
  initSearch: {
    type: Object,
  },
});
const state = reactive({
  filterOptions: {},

  filterRows: {
    search: "",
    library: [],
    floor: [],
    seatType: [],
    date: '',
    boutique: [],
  },
});

onMounted(() => {
  state.filterOptions = props?.data || {};
  state.filterRows = props?.initSearch || {};
  filterFloor();
});

watch(
  () => state.filterRows.library,
  (library) => {
    filterFloor();
  }
);

watch(
  () => state.filterRows.library,
  (library) => {
    filterFloor();
  }
);

const filterFloor = () => {
  let storey = state.filterOptions?.storey;
  let libraryIds = state.filterRows?.library;
  storey = storey?.filter((e) => {
    let floorList = e?.list || [];
    floorList = floorList?.filter((f) =>
      libraryIds.find((e) => e == f?.parentId)
    );
    return floorList?.length;
  });
  if (storey?.length) {
    state.filterOptions.filterStorey = storey || [];
  } else {
    state.filterOptions.filterStorey = state.filterOptions.storey || [];
  }
};
</script>
<template>
  <div class="filterCon">
    <a-input
      v-model:value="state.filterRows.search"
      placeholder="请输入筛选内容"
      style="margin-bottom: 24px"
    >
      <template #suffix>
        <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input>
    <div class="filterScr">
      <div class="filterFilter">馆舍</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.library">
          <a-checkbox
            v-for="item in state.filterOptions?.premises"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">楼层</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.floor">
          <a-checkbox
            v-for="item in state.filterOptions?.filterStorey"
            :value="item?.name"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">座位类型</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.seatType">
          <a-checkbox
            v-for="item in state.filterOptions?.category"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">日期</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.date">
          <a-radio
            v-for="item in state.filterOptions?.date"
            :value="item"
            :key="item"
            >{{ item }}</a-radio
          >
        </a-radio-group>
      </div>
      <div class="filterFilter">特征</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.boutique">
          <a-checkbox
            v-for="item in state.filterOptions?.boutique"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .filterScr {
    flex: 1;
    overflow-y: auto;
  }
  .filterFilter {
    margin-bottom: 24px;
    background: rgba(97, 97, 97, 0.05);
    border-radius: 0px 0px 0px 0px;
    padding: 2px 10px;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 40px;
  }

  .ant-checkbox-group {
    column-gap: 36px;
    row-gap: 20px;
  }

  .ant-radio-group {
    display: inline-flex;
    flex-wrap: wrap;
    column-gap: 36px;
    row-gap: 20px;
  }
}
</style>
