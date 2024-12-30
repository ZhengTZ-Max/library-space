<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { exchangeDateTime, checkOverlap, convertMinutesToHHMM } from "@/utils";

const store = useStore();
const sliderRef = ref();
const systemMode = computed(() => store.state.systemMode);

const emits = defineEmits(["update:value"]);
const props = defineProps({
  options: {
    type: Object,
    default: {},
  },
  value: Array,
});

const state = reactive({
  opt: {
    previousValue: [],
    marksList: [],
    startTime: 0,
    endTime: 60,
    step: 15,
    minRange: 60,
    maxRange: 240,
    disabledArr: [],
    disabledHtml: "",
  },
  value: [],
});

watch(
  () => state.value,
  (v) => {
    emits("update:value", v);
  }
);

watch(
  () => state.opt,
  (v) => {
    // initDisabledArr();
  }
);

onMounted(() => {
  state.opt = props?.options;
  initMarks();
  initDisabledArr();
});

const onChangeSlider = (v) => {
  console.log(v);
  const [prevStart, prevEnd] = state.opt.previousValue;
  const [newStart, newEnd] = v;

  let action = "";
  // 判断滑动方向
  if (newStart < prevStart) {
    console.log("左滑块向左滑动");
    action = "left";
  } else if (newStart > prevStart) {
    console.log("左滑块向右滑动");
  }

  if (newEnd < prevEnd) {
    action = "left";
  } else if (newEnd > prevEnd) {
    action = "right";
  }

  // 更新上一次的值
  state.opt.previousValue = [...v];

  // 处理滑块的边界逻辑
  adjustSliderValue(v, action);
};

const initMarks = () => {
  let { startTime, endTime } = state.opt;

  let step = 15;
  let showNum = (endTime - startTime) / step;

  // 生成标记对象
  let marks = {};

  // 循环生成标记
  for (let i = 0; i <= showNum; i++) {
    let value = i * step; // 每个标记的值
    value += startTime;
    let isLine = value % 60 == 0;
    marks[value] = isLine ? "line" : "short"; // 使用下标作为 key，值为对应的数值
  }
  state.opt.marksList = marks;
};

// 调整滑块的值，确保范围限制
const adjustSliderValue = ([start, end], type) => {
  let { minRange, maxRange } = state.opt;

  // 判断范围是否超出限制
  if (end - start > maxRange) {
    console.log("超出最大范围");
    // 如果超出最大范围，调整 `start`
    if (type == "left") {
      end = start + maxRange;
    } else {
      start = end - maxRange;
    }
  } else if (end - start < minRange) {
    // 如果小于最小范围，调整 `end`
    if (type == "left") {
      start = end - minRange;
    } else {
      end = start + minRange;
    }
  }

  // 边界检查
  if (start < state.opt.startTime) {
    // 如果 `start` 小于滑块最小值，固定 `end` 并调整 `start`
    start = state.opt.startTime;
    end = Math.min(start + minRange, state.opt.endTime); // 保持范围
  }

  if (end > state.opt.endTime) {
    // 如果 `end` 大于滑块最大值，固定 `start` 并调整 `end`
    end = state.opt.endTime;
    start = Math.max(end - minRange, state.opt.startTime); // 保持范围
  }

  // 更新滑块值
  state.value = [start, end];
};

const initDisabledArr = () => {
  setTimeout(() => {
    if (state.opt.disabledArr?.length) {
      state.opt.disabledArr = mergeTimeRanges(
        state.opt.disabledArr,
        state.opt.minRange
      );
      let minRange = state.opt?.minRange;
      let startTime = state.opt?.disabledArr[0][1];

      let initEndTime = startTime + minRange;
      if (initEndTime > state.opt.endTime) {
        initEndTime = state.opt.endTime;
      }

      if (state.opt?.endTime - startTime < minRange) {
        state.value = [state.opt?.endTime - minRange, state.opt?.endTime];
      } else {
        state.value = [startTime, initEndTime];
      }
    } else {
      state.value = [
        state.opt.startTime,
        state.opt.startTime + state.opt.minRange,
      ];
    }

    console.log(state.opt);
    let { disabledArr, minRange } = state.opt;

    let htmlStr = "";
    if (sliderRef?.value?.clientWidth > 0) {
      disabledArr?.map((item, index) => {
        console.log("disableArr ---- item", item[0], item[1]);

        htmlStr += `<div class="disabled_time" style="${disabledCss(
          item
        )}"></div>`;
      });
      state.opt.disabledHtml = htmlStr;
    }
  }, 200);
};

function mergeTimeRanges(timeRanges, minTimeRange = 30) {
  // 首先，按开始时间对区间进行排序
  timeRanges.sort((a, b) => a[0] - b[0]);

  const result = [];

  let currentStart = timeRanges[0][0];
  let currentEnd = timeRanges[0][1];

  for (let i = 1; i < timeRanges.length; i++) {
    const [nextStart, nextEnd] = timeRanges[i];

    // 判断当前区间的结束时间与下一个区间的开始时间差距是否小于最小时间范围
    if (nextStart - currentEnd <= minTimeRange) {
      // 如果满足条件，则进行合并
      currentEnd = Math.max(currentEnd, nextEnd);
    } else {
      // 如果不满足条件，则将当前区间加入结果
      result.push([currentStart, currentEnd]);
      currentStart = nextStart;
      currentEnd = nextEnd;
    }
  }

  // 最后将最后一个区间加入结果
  result.push([currentStart, currentEnd]);

  return result;
}
const disabledCss = (arr) => {
  if (!arr.length) return "display:none";
  let sliderWidth = sliderRef?.value?.clientWidth;
  let { startTime, endTime } = state.opt;
  if (sliderWidth > 0) {
    console.log("sliderWidth", sliderWidth);
    let pix = sliderWidth / (endTime - startTime);
    let leftPix = (arr[0] - startTime) * pix;
    let RightPix = (arr[1] - startTime) * pix;
    let eleWidth = RightPix - leftPix;
    return `width:${eleWidth}px;left:${leftPix}px`;
  }
  return "display:none";
};

const showErrTimes = () => {
  let errArr = checkOverlap(state.value, state?.opt?.disabledArr);
  console.log(errArr);
  let str = "";
  if (errArr?.length) {
    let [start, end] = errArr[0];
    str = `${convertMinutesToHHMM(start)} ~ ${convertMinutesToHHMM(end)}`;
  }

  return str;
};
</script>

<template>
  <div
    class="sliderCom"
    :class="{
      errorSlider: checkOverlap(state.value, state?.opt?.disabledArr)?.length,
    }"
  >
    <div class="sliderSlt">
      <div>
        已选时间：<span class="sltText">{{
          `${convertMinutesToHHMM(state.value[0])} ~ ${convertMinutesToHHMM(
            state.value[1]
          )}`
        }}</span>
        <span
          v-if="
            checkOverlap(state.value, state?.opt?.disabledArr)?.length &&
            systemMode == 'pc'
          "
          class="sltText"
          style="margin-left: 4px"
          >(时段被占用：{{ showErrTimes() }})</span
        >
      </div>
      <div class="sltDot">
        <span class="selectable">{{ $t("V4_available") }}</span>
        <span class="noselectable">{{ $t("V4_unavailable") }}</span>
      </div>
    </div>
    <div
      v-if="
        checkOverlap(state.value, state?.opt?.disabledArr)?.length &&
        systemMode == 'mobile'
      "
      class="moSltText sltText"
    >
      (时段被占用：{{ showErrTimes() }})
    </div>

    <div class="sliderCon" ref="sliderRef">
      <div class="showLine" v-html="state.opt.disabledHtml"></div>
      <a-slider
        v-model:value="state.value"
        range
        :tip-formatter="null"
        :marks="state.opt.marksList"
        :min="state.opt?.startTime"
        :max="state.opt?.endTime"
        :step="state.opt?.step"
        @change="onChangeSlider"
      >
        <template #mark="{ label, point }">
          <span v-if="label == 'line'" class="longLine">{{
            convertMinutesToHHMM(point, 1)
          }}</span>
          <span v-if="label == 'short'" class="shortLine"></span>
        </template>
      </a-slider>
    </div>
  </div>
</template>
<style lang="less" scoped>
.sliderCom {
  margin-top: 8px;
  .moSltText {
    font-size: 14px;
  }
  .sliderSlt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #616161;
    font-size: 14px;
    .sltText {
      color: var(--primary-color);
    }
    .sltDot {
      span {
        position: relative;
        &::after {
          content: "";
          width: 10px;
          height: 8px;
          background: #e0e0e0;
          position: absolute;
          left: -15px;
          top: 50%;
          transform: translateY(-50%);
        }

        &:first-child {
          margin-right: 44px;
        }

        &.noselectable {
          &::after {
            background: #6f6f6f;
          }
        }
      }
    }
  }
  .sliderCon {
    position: relative;
    .showLine {
      position: absolute;
      left: 0;
      top: 4px;
      width: 100%;
      height: 14px;
      z-index: 1;
      border-radius: 2px;
      overflow: hidden;
      :deep(.disabled_time) {
        position: absolute;
        height: 100%;
        background-color: #6f6f6f;
      }
    }
  }
}
.errorSlider {
  .sltText {
    color: #f37400 !important;
  }
  :deep(.ant-slider) {
    .ant-slider-track {
      z-index: 9;
      background-color: #f37400 !important;
    }
  }
}

:deep(.ant-slider) {
  margin: 8px 0 36px 0;
  .ant-slider-step {
    display: none;
  }
  .ant-slider-mark {
    top: 20px;
  }
  .ant-slider-rail {
    background-color: #e0e0e0 !important;
  }
  .ant-slider-track {
    z-index: 9;
    background-color: var(--primary-color) !important;
  }
  .ant-slider-rail,
  .ant-slider-track {
    height: 14px !important;
  }
  .ant-slider-handle {
    z-index: 9;
    width: 12px !important;
    height: 20px !important;
    background-image: url("@/assets/common/sliderBtn.png");
    background-size: 100%;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
  }
  .ant-slider-mark-text {
    padding-top: 12px;
    > span {
      padding-top: 12px;
    }
  }
  .shortLine {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: -12px;
      left: 0;
      width: 1px;
      height: 6px;
      border-right: 1px solid #e7e7e7;
    }
  }
  .longLine {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 8px;
      width: 1px;
      height: 10px;
      border-right: 1px solid #e7e7e7;
      // background-color: #202020;
    }
  }
}
</style>
