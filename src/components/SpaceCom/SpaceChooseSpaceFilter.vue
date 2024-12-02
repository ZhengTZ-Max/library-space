<script setup>
import { reactive, onMounted, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";
import { convertMinutesToHHMM } from "@/utils";
const store = useStore();
const systemMode = computed(() => store.state.systemMode);
const sliderPrimary1 = ref();
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
    library: [],
    floor: [],
    category: "",
    date: "",
    num: "",
    boutiqueID: "",
    featureID: "",
    time: [],
  },
});

onMounted(() => {
  state.filterOptions = props?.data || {};
  state.filterRows = props?.initSearch || {};
});

watch(
  () => state.filterRows.library,
  (v) => {
    filterFloor();
  }
);

const filterFloor = () => {
  let storey = state.filterOptions?.storey;
  let libraryIds = state.filterRows?.library;
  storey = storey?.filter((e) => {
    let floorList = e?.list || [];
    floorList = floorList?.filter((f) =>
      libraryIds?.find((e) => e == f?.parentId)
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
    <div class="filterScr">
      <div class="filterFilter">馆舍</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.library">
          <a-checkbox
            :class="{ width_half: systemMode != 'pc' }"
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
            v-for="item in state.filterOptions.filterStorey"
            :class="{ width_half: systemMode != 'pc' }"
            :value="item?.name"
            :key="item?.name"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
      <div class="filterFilter">空间类型</div>
      <div class="fiterItem">
        <a-checkbox-group v-model:value="state.filterRows.category">
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
        <a-radio-group v-model:value="state.filterRows.date">
          <a-radio
            :class="{ width_half: systemMode != 'pc' }"
            v-for="item in state.filterOptions?.date"
            :value="item"
            :key="item"
            >{{ item }}</a-radio
          >
        </a-radio-group>
      </div>
      <div class="filterFilter">时间</div>
      <div class="filterTimes fiterItem">
        <span>{{ state.filterOptions.time?.start_time }}</span>
        <div class="sliderPrimary sliderSmall">
          <a-slider
            :min="state.filterOptions.time?.start_num"
            :max="state.filterOptions.time?.end_num"
            v-model:value="state.filterRows.time"
            step="15"
            range
            :tip-formatter="null"
          />
          <div class="sltText">
            已选时间：{{ convertMinutesToHHMM(state.filterRows.time[0]) }} ~
            {{ convertMinutesToHHMM(state.filterRows.time[1]) }}
          </div>
        </div>
        <span>{{ state.filterOptions.time?.end_time }}</span>
      </div>
      <div class="filterFilter">人数</div>
      <div class="filterTimes fiterItem">
        <span>{{ state.filterOptions.members?.min }}</span>
        <div class="sliderPrimary sliderSmall">
          <a-slider
            :max="state.filterOptions.members?.max"
            v-model:value="state.filterRows.num"
          />
          <div class="sltText">已选人数：0 ~ {{ state.filterRows.num }}</div>
        </div>
        <span>{{ state.filterOptions.members?.max }}</span>
      </div>
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
  .filterTimes {
    display: flex;
    align-items: center;
    .sliderPrimary {
      margin: 0 12px;
      min-width: 300px;
      width: 70%;
      position: relative;
      .sltText {
        position: absolute;
        top: 16px;
        left: 0;
        color: var(--primary-color);
      }
    }
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
