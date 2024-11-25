<script setup>
import { reactive, onMounted, computed, watch } from "vue";
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
    floorID: "",
    categoryID: "",
    date: "",
    time: "",
    num: "",
    boutiqueID: "",
    featureID: "",
  },
  floors: [],
  
});

onMounted(() => {
  state.filterOptions = props?.data || {};
  state.filterRows = props?.initSearch || {};
});

watch(
  () => state.filterRows.premiseID,
  (v) => {
    if (!v) return;
    const matchedStorey = state.filterOptions.storey.find((storey) =>
      storey.list.some((item) => item.parentId === state.filterRows.premiseID)
    );

    state.floors.push(matchedStorey);
    console.log(state.floors);
  }
);
</script>
<template>
  <div class="filterCon">
    <div class="filterScr">
      <div class="filterFilter">馆舍</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.premiseID">
          <a-radio
            v-for="item in state.filterOptions?.premises"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-radio
          >
        </a-radio-group>
      </div>
      <div v-if="state.floors?.length" class="filterFilter">楼层</div>
      <div v-if="state.floors?.length" class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.floorID">
          <a-checkbox
            v-for="item in state.floors"
            :value="item?.name"
            :key="item?.name"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">空间类型</div>
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
      <div class="filterFilter">日期</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.date">
          <a-checkbox
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions?.date"
            :value="item"
            :key="item"
            >{{ item }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">时间</div>
      <div>1</div>
      <div class="filterFilter">人数</div>
      <div>1</div>
      <div class="filterFilter">特征</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.boutiqueID">
          <a-checkbox
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions?.boutique"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <br />
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  height: 550px;
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
.height_35vh {
  height: 35vh;
}
.height_25vh {
  height: 25vh;
}
</style>
