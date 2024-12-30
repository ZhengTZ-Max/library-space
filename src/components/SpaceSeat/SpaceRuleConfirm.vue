<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const props = defineProps(["title", "content", "open", "review"]);
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
  () => props.review,
  (v) => {
    if (v) {
      state.finished = true;
      state.isConfirm = true;
    }
  },
  {
    immediate: true,
  }
);
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
    :title="props?.title || $t('Instructions')"
    @ok="handleConfirm"
    destroyOnClose
    :okText="
      !state?.isConfirm ? $t('V4_please_read_the_instructions') : $t('Known')
    "
    :cancelText="$t('cancel')"
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
        <slot name="content"></slot>
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
      <van-list :finished="state.finished" @load="onLoad" offset="10">
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
          {{ $t("cancel") }}
        </van-button>
        <van-button
          round
          block
          type="primary"
          @click="handleConfirm"
          :disabled="!state?.isConfirm"
          >{{
            !state?.isConfirm
              ? $t("V4_please_read_the_instructions")
              : $t("Known")
          }}</van-button
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
