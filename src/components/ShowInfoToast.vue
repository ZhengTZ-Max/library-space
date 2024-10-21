<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  isShow: Boolean,
  type: String,
  title: String,
});
const state = reactive({
  isShow: true,
});

onMounted(() => {
  state.isShow = props?.isShow;
});

const handleConfirm = () => {
  state.isShow = false;
};
</script>
<template>
  <a-modal
    :closable="false"
    width="320px"
    v-model:open="state.isShow"
    @ok="handleConfirm"
    destroyOnClose
    :cancelButtonProps="{
      style: {
        display: 'none',
      },
    }"
    okText="确认"
    :okButtonProps="{
      size: 'middle',
      ghost: true,
      style: {
        marginLeft: 0,
        border: 'none',
      },
    }"
    centered
  >
    <div class="showInfoCon">
      <img
        v-if="props?.type == 'success'"
        class="showIcon"
        src="@/assets/home/successInfo.svg"
        alt=""
      />
      <img v-else class="showIcon" src="@/assets/home/errorInfo.svg" alt="" />
      <p v-if="props?.title" class="infoText">{{ props?.title }}</p>

      <slot name="content"></slot>
    </div>
  </a-modal>
</template>
<style lang="less" scoped>
.showInfoCon {
  display: flex;
  flex-direction: column;
  align-items: center;

  .showIcon {
    width: 50px;
    height: 50px;
  }
  .infoText {
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #202020;
  }
}
</style>
