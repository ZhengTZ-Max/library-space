<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";

const store = useStore();
const systemMode = computed(() => store.state.systemMode);
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
  <div
    class="filterCon"
    :class="{
      height_35vh: state.filterOptions?.showDate && systemMode == 'pc',
      height_25vh: !state.filterOptions?.showDate && systemMode == 'pc',
    }"
  >
    <div class="filterScr">
      <div class="filterFilter">{{ $t("Library") }}</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.premiseID">
          <a-checkbox
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions?.premise"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">{{ $t("ActivityType") }}</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.categoryID">
          <a-checkbox
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions?.category"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter" v-if="state.filterOptions?.showDate">
        {{ $t("user_activitytime") }}
      </div>
      <div class="fiterItem" v-if="state.filterOptions?.showDate">
        <a-checkbox-group v-model:value="state.filterRows.date">
          <a-checkbox
            :class="{ width_half: systemMode != 'pc' }"
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
    width: 100%;
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
.height_35vh {
  height: 35vh;
}
.height_25vh {
  height: 25vh;
}
</style>
