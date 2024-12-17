<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";
import { exchangeDateTime, initSltTime } from "@/utils";
import moment from "moment";
const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const emits = defineEmits(["update:initSearch"]);
const props = defineProps({
  options: {
    type: Object,
  },
  initSearch: {
    type: Object,
  },
});
const state = reactive({
  filterDate: [],
  filterRows: {},
});

onMounted(() => {
  state.filterDate = props?.options || [];

  state.filterRows = props?.initSearch || {};
});
</script>
<template>
  <div class="filterCon" :class="{ filterConMo: systemMode != 'pc' }">
    <div class="filterScr">
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.date">
          <a-radio
            v-for="(item, i) in state.filterDate"
            :value="item?.id"
            :key="item?.id"
            :disabled="item?.isvalid != 1"
            >{{ `${item?.startDay} ~ ${item?.endDay}` }}
            <span style="margin: 0 12px">{{
              i == 0 ? "(本期)" : "(下期)"
            }}</span>
            <span v-if="item?.isvalid != 1" style="color: #1a49c0"
              >无预约权限</span
            ></a-radio
          >
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  height: 30vh !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &.filterConMo {
    height: auto !important;
  }
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
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
    }
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
  .timePickerMo {
    display: flex;
    align-items: center;
    .timeItem {
      position: relative;
      min-width: 160px;
      padding: 8px 14px;
      border-radius: 18px;
      border: 1px solid #eaeaea;
      text-align: center;
      .posIcon {
        position: absolute;
        right: 12px;
        top: 12px;
      }
    }
    span {
      margin: 0 10px;
      font-size: 14px;
      color: #868686;
    }
  }
}
</style>
