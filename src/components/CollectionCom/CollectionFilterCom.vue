<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import moment from "moment";
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
  minDate: {
    type: String,
  },
  type: {
    type: String,
  },
});
const state = reactive({
  filterOptions: [],
  floorList: [],
  typeList: [],

  filterRows: {
    date: "",
    library: "",
    floor: "",
    areaId: [],
  },
});

onMounted(() => {
  state.filterOptions = props?.data || [];
  state.filterRows = props?.initSearch || {};
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
    state.filterRows.areaId = "";
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
    state.filterRows.areaId = "";
  } else {
    types = [];
  }
  console.log("types", types);
  state.typeList = types;
};

const filterDisabledDate = (current) => {
  // return current && current > moment().endOf("day")
  return (
    (props?.minDate && moment(props?.minDate) > current) ||
    (current && current > moment().endOf("day"))
  );
  // if (!()) {
  //   return false;
  // } else if (props?.minDate && moment(props?.minDate) < current) {
  //   return false;
  // }
  // return true;
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
      <template v-if="props?.type != 'area'">
        <div class="filterFilter">{{ $t("Date") }}</div>
        <div class="filterItem" style="margin-bottom: 24px">
          <a-date-picker
            :disabled-date="filterDisabledDate"
            size="middle"
            v-model:value="state.filterRows.date"
          />
        </div>
      </template>
      <div class="filterFilter">
        {{ $t("Library") }}
      </div>
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
        <div class="filterFilter">{{ $t("Floor") }}</div>
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
        <div class="filterFilter">{{ $t("V4_reading_room") }}</div>
        <div class="fiterItem">
          <a-radio-group v-model:value="state.filterRows.areaId">
            <a-radio
              :class="{ width_half: systemMode != 'pc' }"
              v-for="item in state.typeList"
              :value="item?.id"
              :key="item?.id"
              >{{ item?.name }}</a-radio
            >
          </a-radio-group>

          <!-- <a-checkbox-group v-model:value="state.filterRows.bookType">
            <a-checkbox
              :class="{ width_half: systemMode != 'pc' }"
              v-for="item in state.typeList"
              :value="item?.id"
              :key="item?.id"
              >{{ item?.name }}</a-checkbox
            >
          </a-checkbox-group> -->
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  max-height: 65vh;
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
