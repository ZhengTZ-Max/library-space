<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();

const radioStyle = reactive({
  display: "flex",
  height: "18px",
  lineHeight: "18px",
  marginBottom: "16px",
});

const state = reactive({
  quickMode: "0",
  quickModeList: [
    { value: "0", label: "座位" },
    { value: "1", label: "空间" },
  ],

  date: "",

  activeType: "seat",
});

onMounted(() => {});
</script>
<template>
  <div class="commonAppt">
    <div class="cHeader">
      <div class="quickMode">
        <div
          v-for="item in state.quickModeList"
          :key="item.label"
          class="item activeBtn"
          :class="{ itemActive: item?.value == state.quickMode }"
          @click="state.quickMode = item?.value"
        >
          {{ item?.label }}
        </div>
      </div>
    </div>
    <div class="apptCon">
      <div class="filterTimes">
        <div class="timeItem">
          <span>日期：</span>
          <div>
            <a-radio-group v-model:value="state.date">
              <a-radio :style="radioStyle" :value="1">Option A</a-radio>
              <a-radio :style="radioStyle" :value="2">Option B</a-radio>
              <a-radio :style="radioStyle" :value="3">Option C</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="timeItem">
          <span>时间：</span>
          <div>
            <a-radio-group v-model:value="state.date">
              <a-radio :style="radioStyle" :value="1">Option A</a-radio>
              <a-radio :style="radioStyle" :value="2">Option B</a-radio>
              <a-radio :style="radioStyle" :value="3">Option C</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
      <div class="toggleLang">
        <div
          @click="state.activeType = 'seat'"
          :class="{ langActive: state.activeType == 'seat' }"
          class="langItem activeBtn"
        >
          收藏
        </div>
        <div
          @click="state.activeType = 'space'"
          :class="{ langActive: state.activeType == 'space' }"
          class="langItem activeBtn"
        >
          常用
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.commonAppt {
  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
  }
  .quickMode {
    display: flex;
    .item {
      padding-bottom: 10px;
      font-size: 15px;
      color: #616161;
      &:first-child {
        margin-right: 40px;
      }
      &.itemActive {
        color: #202020;
        border-bottom: 2px solid #1a49c0;
      }
    }
  }
  .apptCon {
    padding: 12px 14px;
    .filterTimes {
      .timeItem {
        display: flex;
        font-size: 13px;
        color: #616161;
      }
    }
  }
}

.toggleLang {
  height: 36px;
  padding: 4px;
  background: #f1f1f1;
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .langItem {
    color: #868686;
    padding: 2px 16px;
    width: 50%;
    height: 28px;
    text-align: center;
  }
  .langActive {
    background: #ffffff;
    box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
    border-radius: 17px 17px 17px 17px;
    font-weight: bold;
    color: #1f56e1;
  }
}
</style>
