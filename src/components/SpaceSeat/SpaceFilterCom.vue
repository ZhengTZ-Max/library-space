<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";

const store = useStore();
const systemMode = computed(() => store.state.systemMode);
const props = defineProps({
  showSearch: {
    type: Boolean,
    default: false,
  },
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
    date: "",
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

const filterFloor = () => {
  let storey = state.filterOptions?.storey;
  let libraryIds = state.filterRows?.library;
  if (!Array.isArray(libraryIds)) {
    libraryIds = [state.filterRows?.library];
  }
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
      v-if="props?.showSearch"
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
        <a-checkbox-group
          v-if="systemMode != 'pc'"
          v-model:value="state.filterRows.library"
        >
          <a-checkbox
            :class="{
              width_half: systemMode != 'pc',
            }"
            v-for="item in state.filterOptions?.premises"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>

        <a-radio-group v-else v-model:value="state.filterRows.library">
          <a-radio
            :class="{
              width_half: systemMode != 'pc',
            }"
            v-for="item in state.filterOptions?.premises"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-radio
          >
        </a-radio-group>
      </div>
      <div class="filterFilter">楼层</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.floor">
          <a-checkbox
            :class="{
              width_half: systemMode != 'pc',
            }"
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
            :class="{
              width_half: systemMode != 'pc',
            }"
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
            :class="{
              width_half: systemMode != 'pc',
            }"
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
            :class="{
              width_half: systemMode != 'pc',
            }"
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
    color: #616161;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
      .ant-radio-wrapper,
      .ant-checkbox-wrapper {
        width: 29%;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .width_half {
      width: 42% !important;
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
