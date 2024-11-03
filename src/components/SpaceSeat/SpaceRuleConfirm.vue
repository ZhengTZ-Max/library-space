<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const props = defineProps(["content", "open"]);
const emits = defineEmits(["onConfirm", "update:open"]);
const state = reactive({
  finished: false,
  spaceRuleShow: false,

  isConfirm: false,

  moHideList: true,
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
const onLoad = (e) => {
  state.finished = true;
  state.isConfirm = true;
  console.log("加载完毕？", e);
};

const handleConfirm = () => {
  emits("onConfirm");
};
</script>
<template>
  <a-modal
    v-if="systemMode == 'pc'"
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

  <van-popup
    v-else
    v-model:show="state.spaceRuleShow"
    position="bottom"
    :style="{ height: '100%' }"
    @opened="state.moHideList = true"
  >
    <div class="ruleCon" :class="{ ruleConMo: systemMode != 'pc' }">
      <van-list
        :finished="state.finished"
        @load="onLoad"
        offset="10"
      >
        <div class="propsCon" v-html="props?.content"></div>
      </van-list>
      <div class="bottomAction">
        <van-button
          round
          block
          type="default"
          @click="state.spaceRuleShow = false"
        >
          <img src="@/assets/seat/moBackBtn.svg" alt="" />
          取消
        </van-button>
        <van-button
          round
          block
          type="primary"
          @click="handleConfirm"
          :disabled="!state?.isConfirm"
          >{{ !state?.isConfirm ? "请阅读完使用须知" : "已知晓" }}</van-button
        >
      </div>
    </div>
  </van-popup>
</template>
<style lang="less" scoped>
.ruleCon {
  height: 50vh;
  overflow: hidden;
  .van-list {
    height: 100%;
    overflow: auto;
  }
  &.ruleConMo {
    height: 100%;
    display: flex;
    flex-direction: column;
    .van-list {
      height: calc(100vh - 68px);
    }
    .propsCon {
      padding: 10px 16px;
      font-size: 14px;
      color: #616161;
    }
  }
}
</style>
