<script setup>
import { reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();

const props = defineProps(["content", "open"]);
const emits = defineEmits(["onConfirm", "update:open"]);
const state = reactive({
  finished: false,
  spaceRuleShow: false,

  isConfirm: false,
});

onMounted(() => {
  state.spaceRuleShow = props?.open;
});
watch(
  () => state.spaceRuleShow,
  (v) => {
    emits("update:open", v);
  }
);
const onLoad = () => {
  state.finished = true;
  state.isConfirm = true;
};

const handleConfirm = () => {
  emits("onConfirm");
};
</script>
<template>
  <a-modal
    width="50%"
    v-model:open="state.spaceRuleShow"
    title="使用须知"
    @ok="handleConfirm"
    destroyOnClose
    :okText="!state?.isConfirm ? '请阅读完使用须知' : '已知晓'"
    cancelText="取消"
    :cancelButtonProps="{
      size: 'middle',
      style: {
        color: '#8C8F9E',
        background: '#F3F4F7',
        borderColor: '#CECFD5',
      },
    }"
    :okButtonProps="{
      size: 'middle',
      style: {
        background: (!state?.isConfirm && 'rgba(26,73,192,0.3)') || '',
        pointerEvents: (!state?.isConfirm && 'none') || '',
      },
    }"
    centered
  >
    <div class="ruleCon">
      <van-list :finished="state.finished" @load="onLoad" :offset="10">
        <div class="propsCon" v-html="props?.content"></div>
      </van-list>
    </div>
  </a-modal>
</template>
<style lang="less" scoped>
.ruleCon {
  height: 50vh;
  overflow: hidden;
  .van-list {
    height: 100%;
    overflow: auto;
  }
}
</style>
