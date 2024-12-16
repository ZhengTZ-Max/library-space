<template>
  <div class="toggleLight">
    <div class="leftBt">
      <div class="power-wrapper">
        <span class="label">电源:</span>
        <a-switch
          v-if="state.row?.hasRelay == 1"
          v-model:checked="state.toggleRelay"
          @change="onChangeRelay"
        />
      </div>
      <div class="light-wrapper">
        <span class="label">阅览灯:</span>
        <a-switch
          v-if="state.row?.hasLight == 1"
          v-model:checked="state.toggleLight"
          @change="onChange"
        />
      </div>
    </div>
    <div
      v-if="state.toggleLight && state.row?.hasLight == 1"
      class="silderLight"
    >
      <span class="posText">亮度:</span>
      <div class="sliderCon">
        <a-slider
          v-model:value="state.value"
          :tooltip-open="false"
          @change="onChangeSlide"
        />
      </div>
      <span class="sliderValue">{{ state.value }}%</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
const emits = defineEmits(["onChange"]);
const props = defineProps({
  info: {
    type: Object,
    default: {},
  },
  light: {
    type: Boolean,
    default: false,
  },
  lightV: {
    type: [Number, String],
    default: 0,
  },
});

const state = reactive({
  toggleRelay: false,
  toggleLight: false,
  value: "",
});
watch(
  () => props,
  (v) => {
    let { light, lightV, info } = v;
    state.toggleLight = light;
    state.toggleRelay = info?.relayStatus == 1;
    state.value = lightV;
    state.row = info;
  },
  {
    immediate: true,
    deep: true,
  }
);
const onChangeRelay = () => {
  let data = { type: "toggleRelay", value: state.toggleRelay };
  emits("onChange", data);
};

const onChange = () => {
  let data = { type: "toggle", value: state.toggleLight };
  emits("onChange", data);
};

const onChangeSlide = () => {
  let data = { type: "line", value: state.value };
  if (state.value == 0) {
    state.toggleLight = false;
  }
  emits("onChange", data);
};
</script>

<style lang="less" scoped>
.toggleLight {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .leftBt {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;

    .power-wrapper {
      display: flex;
      align-items: center;
      margin-right: 24px;
      .label {
        margin-right: 12px;
        text-align: left;
        font-weight: 600;
      }
    }

    .light-wrapper {
      display: flex;
      align-items: center;

      .label {
        text-align: left;
        margin-right: 12px;
        font-weight: 600;
      }
    }
  }

  .silderLight {
    margin-top: 10px;
    position: relative;
    display: flex;
    align-items: center;

    .posText {
      margin-right: 12px;
    }
    .sliderCon {
      flex: 1;
    }
    .sliderValue {
      margin-left: 12px;
      color: #f89d27;
    }
  }
  :deep(.ant-slider) {
    .ant-slider-step {
      display: none;
    }

    .ant-slider-rail {
      background-color: #e0e0e0 !important;
    }
    .ant-slider-track {
      z-index: 9;
      background-color: #f8c17b !important;
    }
    .ant-slider-rail,
    .ant-slider-track {
      border-radius: 4px;
      height: 8px !important;
    }
    .ant-slider-handle {
      z-index: 9;
      top: 2px;
      &::after {
        box-shadow: 0 0 0 2px #f8c17b;
      }
    }
  }
}
</style>
