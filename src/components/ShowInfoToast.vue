<script setup>
import { Footer } from "ant-design-vue/es/layout/layout";
import { reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  isShow: Boolean,
  type: String,
  title: String,
  okText: String,
  hideIcon: Boolean,
});
const emits = defineEmits(["handleShow", "update:isShow"]);
const state = reactive({
  isShow: true,
});

onMounted(() => {
  state.isShow = props?.isShow;
});

watch(
  () => state.isShow,
  (v) => {
    emits("update:isShow", v);
    emits("handleShow", v);
  }
);

const handleConfirm = () => {
  state.isShow = false;
};
</script>
<template>
  <a-modal
    :closable="false"
    width="320px"
    v-model:open="state.isShow"
    :cancelButtonProps="{
      style: {
        display: 'none',
      },
    }"
    :okText="props?.okText || $t('visitor_Confirm')"
    :okButtonProps="{
      size: 'middle',
      ghost: true,
      style: {
        marginLeft: 0,
        border: 'none',
      },
    }"
    centered
    mask
    :maskClosable="false"
  >
    <template v-slot:footer>
      <div v-if="props?.okText != 'none'" class="footerCon">
        <a-button size="small" type="link" @click="handleConfirm">{{
          props?.okText || $t("visitor_Confirm")
        }}</a-button>
      </div>
    </template>
    <div class="showInfoCon">
      <template v-if="!props?.hideIcon">
        <img
          v-if="props?.type == 'success'"
          class="showIcon"
          src="@/assets/home/successInfo.svg"
          alt=""
        />
        <img v-else class="showIcon" src="@/assets/home/errorInfo.svg" alt="" />
      </template>

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
.footerCon {
  padding-top: 12px;
  border-top: 1px solid rgba(4, 4, 21, 0.05);
}
</style>
