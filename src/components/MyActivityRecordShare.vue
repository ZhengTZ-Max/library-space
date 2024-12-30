<script setup>
import { reactive, onMounted, watch } from "vue";

const emits = defineEmits(["onClose"]);

const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  data: props.data,
});

onMounted(() => {
  state.data = props.data;
});
</script>
<template>
  <div class="share-popup">
    <div class="share-popup-container">
      <div class="share-popup-content">
        <van-image
          :src="state.data.poster[0].file_path"
          alt="Empty state illustration"
        />
        <div class="share-popup-title">{{ state.data.title }}</div>
        <div class="share-popup-item">{{$t("user_activityplace")}}</div>
        <div class="share-popup-item_value">{{ state.data.nameMerge }}</div>
        <div class="share-popup-item">{{ $t("user_activitytime") }}</div>
        <div class="share-popup-item_value">
          {{ state.data.begin_date }} {{ state.data.begin_time }} ~
          {{ state.data.end_date }} {{ state.data.end_time }}
        </div>
      </div>
      <div class="share-popup-scan">
        <div class="share-popup-scan-text">扫码查看活动详情>></div>
        <van-image
          class="share-popup-scan-image"
          src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
          alt="Empty state illustration"
        />
      </div>
    </div>
    <div class="share-popup-footer">
      <button class="footer-button" @click="goToLink('/mo/...')">
        保存图片
      </button>
      <div class="divider"></div>
      <a-button
        type="text"
        class="share-button"
        plain
        @click=""
      >
        <!-- <img
          src="@/assets/my/mobile_event_details_share.svg"
          style="margin-right: 5px"
          alt=""
        /> -->
        复制链接
      </a-button>
    </div>
    <div class="share-popup-close">
      <img
        src="@/assets/my/mobile_event_details_close.svg"
        @click="emits('onClose')"
        alt=""
      />
    </div>
  </div>
</template>
<style lang="less" scoped>
.share-popup {

  .share-popup-container {
    border-radius: 10px;
    background-color: #fff;
    .share-popup-content {
      padding: 16px;
      .share-popup-title {
        font-size: 16px;
        color: rgba(32, 32, 32, 1);
      }
      .share-popup-item {
        margin-top: 20px;
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
      }
      .share-popup-item_value {
        font-size: 14px;
        color: rgba(97, 97, 97, 1);
      }
    }
    .share-popup-scan {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: end;
      background-color: rgba(0, 0, 0, 0.03);
      .share-popup-scan-text {
        font-size: 14px;
        color: rgba(97, 97, 97, 1);
      }
      .share-popup-scan-image {
        width: 80px;
        height: 80px;
      }
    }
  }
  .share-popup-footer {
    margin-top: 15px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: #fff;
    border-radius: 12px; /* 圆角效果 */

    .footer-button {
      background: none;
      border: none;
      color: rgba(97, 97, 97, 1); /* 按钮文字颜色 */
      padding: 10px 20px;
      cursor: pointer;
      font-size: 14px;
    }
    .share-button {
      color: rgba(31, 86, 225, 1);
      font-size: 14px;
      width: 30%;
    }

    .divider {
      width: 1px; /* 分隔线宽度 */
      height: 30px; /* 分隔线高度 */
      background-color: #e0e0e0; /* 分隔线颜色 */
    }
  }
  .share-popup-close {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
