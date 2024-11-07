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
    premiseID: "",
    categoryID: "", 
    date: "",
  },
});

onMounted(() => {
  state.filterOptions = props?.data || {};
  state.filterRows = props?.initSearch || {};
});


</script>
<template>
  <div class="filterCon">
    <div class="filterScr">
      <div class="filterFilter">馆舍</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.premiseID">
          <a-checkbox
            v-for="item in state.filterOptions?.premise"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">活动类型</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.categoryID">
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
        <a-checkbox-group v-model:value="state.filterRows.date">
          <a-checkbox
            v-for="item in state.filterOptions?.date"
            :value="item?.date"
            :key="item"
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
  height: 59vh;
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
    color: rgba(97, 97, 97, 1);
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
