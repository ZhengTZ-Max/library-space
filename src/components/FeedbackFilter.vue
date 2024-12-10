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
    ilkAreaID: "",
    ilkFloorID: "",
    ilkSpaceID: "",
  },

  showFloorList: [],
  showSpaceList: [],
});

onMounted(() => {
  state.filterOptions = props?.data || {};
  state.filterRows = props?.initSearch || {};

  if (!state.filterRows?.ilkAreaID?.length) {
    state.filterRows.ilkAreaID = state.filterOptions?.ilkAreaList[0]?.id;
  }

  state.showFloorList = state.filterOptions?.ilkFloorList.filter(
    (e) => e?.parentId == state.filterRows?.ilkAreaID
  );

  if (!state.filterRows?.ilkFloorID?.length) {
    state.filterRows.ilkFloorID = state.showFloorList[0]?.id;
  }

  state.showSpaceList = state.filterOptions?.ilkSpaceList.filter(
    (e) => e?.parentId == state.filterRows?.ilkFloorID
  );

  if (!state.filterRows?.ilkSpaceID?.length) {
    state.filterRows.ilkSpaceID = state.showSpaceList[0]?.id;
  }
});

const handleAreaChange = (e) => {
  state.showFloorList = state.filterOptions?.ilkFloorList.filter(
    (e) => e?.parentId == state.filterRows.ilkAreaID
  );
  state.filterRows.ilkFloorID = state.showFloorList[0]?.id;
  state.showSpaceList = state.filterOptions?.ilkSpaceList.filter(
    (e) => e?.parentId == state.filterRows?.ilkFloorID
  );
  state.filterRows.ilkSpaceID = state.showSpaceList[0]?.id;
};

const handleFloorChange = (e) => {
  state.showSpaceList = state.filterOptions?.ilkSpaceList.filter(
    (e) => e?.parentId == state.filterRows?.ilkFloorID
  );
  state.filterRows.ilkSpaceID = state.showSpaceList[0]?.id;
};
</script>
<template>
  <div
    class="filterCon"

  >
    <div class="filterScr">
      <div class="filterFilter">馆舍</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.ilkAreaID" @change="handleAreaChange">
          <a-radio
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions?.ilkAreaList"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-radio
          >
        </a-radio-group>
      </div>
      <div class="filterFilter">楼层</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.ilkFloorID" @change="handleFloorChange">
          <a-radio
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.showFloorList"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-radio
          >
        </a-radio-group>
      </div>
      <div class="filterFilter">区域</div>
      <div class="fiterItem">
        <a-radio-group v-model:value="state.filterRows.ilkSpaceID">
          <a-radio
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.showSpaceList"
            :value="item?.id"
            :key="item?.id"
            >{{ item?.name }}</a-radio
          >
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  height: 50vh;
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

</style>
