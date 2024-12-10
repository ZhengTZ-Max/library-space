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
    type: Array,
  },
  initSearch: {
    type: Object,
  },
});
const state = reactive({
  filterOptions: [],
  floorList: [],
  typeList: [],

  filterRows: {
    library: "",
    floor: "",
    bookType: [],
  },
});

onMounted(() => {
  state.filterOptions = props?.data || [];
  state.filterRows = props?.initSearch || {};
  filterFloor();
});

watch(
  () => state.filterRows.library,
  () => {
    filterFloor();
  }
);

watch(
  () => state.filterRows.floor,
  () => {
    filterTypes();
  }
);

const filterFloor = () => {
  let floorList = [];

  let libraryIds = state.filterRows?.library;
  let findLibrary = state.filterOptions?.find((e) =>
    libraryIds?.includes(e?.id)
  );
  if (findLibrary?.child?.length) {
    floorList = findLibrary?.child || [];
    state.filterRows.floor = "";
    state.filterRows.bookType = "";
  } else {
    floorList = [];
  }
  state.floorList = floorList;
};

const filterTypes = () => {
  let types = [];

  let floorIds = state.filterRows?.floor;

  let floorInfo = state.floorList?.find((e) => floorIds?.includes(e?.id));
  console.log("floorInfo", floorIds);

  if (floorInfo?.child?.length) {
    types = floorInfo?.child || [];
    state.filterRows.bookType = "";
  } else {
    types = [];
  }
  console.log("types", types);
  state.typeList = types;
};
</script>
<template>
  <div class="filterCon">
    <!-- <a-input
      v-if="props?.showSearch"
      v-model:value="state.filterRows.search"
      placeholder="请输入筛选内容"
      style="margin-bottom: 24px"
    >
      <template #suffix>
        <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input> -->
    <div class="filterScr">
      <div class="filterFilter">馆舍</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.library">
          <a-radio
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-radio
          >
        </a-radio-group>
      </div>
      <template v-if="state.floorList?.length">
        <div class="filterFilter">楼层</div>
        <div class="fiterItem">
          <a-radio-group v-model:value="state.filterRows.floor">
            <a-radio
              :class="{ width_half: systemMode != 'pc' }"
              v-for="item in state.floorList"
              :value="item?.id"
              :key="item?.id"
              >{{ item?.name }}</a-radio
            >
          </a-radio-group>
        </div>
      </template>
      <template v-if="state.typeList?.length">
        <div class="filterFilter">座位类型</div>
        <div class="fiterItem">
          <a-checkbox-group v-model:value="state.filterRows.bookType">
            <a-checkbox
              :class="{ width_half: systemMode != 'pc' }"
              v-for="item in state.typeList"
              :value="item?.id"
              :key="item?.id"
              >{{ item?.name }}</a-checkbox
            >
          </a-checkbox-group>
        </div>
      </template>
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
    &:last-child {
      margin-bottom: 0;
    }
    .width_half {
      width: 40%;
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
