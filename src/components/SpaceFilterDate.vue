<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";

const store = useStore();
const props = defineProps({
  date: {
    type: Object,
  },
  initSearch: {
    type: Object,
  },
});
const state = reactive({
  filterDate: [],
  filterDateType: "",

  filterRows: {
    date: "",
    time: "",
  },

  filterTimes: [],
});

onMounted(() => {
  state.filterDate = props?.date?.list || {};
  state.filterDateType = props?.date?.reserveType || {};
  state.filterRows = props?.initSearch || {};
  getTimes();
});

watch(
  () => state.filterRows.date,
  (v) => {
    if (v) getTimes();
  }
);

const getTimes = () => {
  let cDate = state.filterRows?.date;
  let findDateRow = state.filterDate?.find((e) => e?.day == cDate);
  state.filterTimes = findDateRow?.times;
};
</script>
<template>
  <div class="filterCon">
    <div class="filterScr">
      <div class="filterFilter">日期</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.date">
          <a-radio
            v-for="item in state.filterDate"
            :value="item?.day"
            :key="item?.day"
            >{{ item?.day }}</a-radio
          >
        </a-radio-group>
      </div>

      <div class="filterFilter">时间</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.time">
          <a-radio
            v-for="item in state.filterTimes"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.start }} - {{ item?.end }}</a-radio
          >
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  height: 30vh;
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
