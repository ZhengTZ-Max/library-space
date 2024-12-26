<template>
  <div class="reg-con">
    <div
      v-for="item in list"
      class="reg-date reg-tags flex-column clickBox"
      :class="{ active: checkActive(item) }"
      @click="checked(item)"
    >
      <span>{{ item[activeLabel] }}</span>
      <span v-if="item.subtitle">{{ item.subtitle }}</span>
      <img v-if="checkActive(item)" class="selectedIcon" src="@/assets/common/tabSelected.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
  active: {
    type: Array || Object,
    default: {},
  },
  activeLabel: {
    type: String,
    default: "label",
  },
  activeKey: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["onChange", "nextChild"]);
const checkActive = (item) => {
  let { multiple, activeKey, active } = props;
  if (!multiple) {
    return active[activeKey] == item[activeKey];
  } else {
    return active.includes(item[activeKey]);
  }
};
const checked = (item) => {
  emits("onChange", item);
  emits("nextChild", item);
};
</script>

<style lang="less" scoped>
.reg-con {
  width: 100%;
  margin: 0 -15px;
  padding: 0 15px;
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  overflow-x: hidden;
  .reg-date {
    position: relative;
    min-width: 96px;
    flex-shrink: 0;
    margin-right: 12px;
    margin-bottom: 12px;
    padding: 10px 16px;
    text-align: center;
    border: 1px solid #f2f2f2;
    background: #f2f2f2;
    color: #333333;
    &.active {
      background: rgba(53, 83, 158, 0.3);
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
    &:last-child {
      margin-right: 0;
    }
    span {
      &:nth-child(1) {
        font-size: 13px;
      }
      &:nth-child(2) {
        margin-top: 5px;
        font-size: 12px;
      }
    }
    .selectedIcon {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 22px;
      height: 12px;
    }
  }
  .reg-tags-active {
    background: rgba(53, 83, 158, 0.3);
    border: 1px solid var(--van-primary-color);
    color: var(--van-primary-color);
  }
  .reg-tags {
    border-radius: 6px;
    &.full {
      .status {
        color: #3b97fb;
      }
    }
    &.suspend {
      background: #f6f6f6;
      border: 1px solid #f6f6f6;
    }
  }
}
</style>
