<route>
    {
      meta: {
        showHead: true,
        showLeftBack:true,
        title:'yuyue_detail',
        showTabbar:false
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route?.query?.id || "",
  status: "预约成功",
});
</script>
<template>
  <div class="book-locker-details">
    <van-cell-group class="top_info">
      <van-cell
        class="info_item_status"
        :class="{ info_item_status_success: state.status === '预约成功' }"
        title="预约状态"
        :value="state.status"
      />
      <van-cell class="info_item" title="预约用户" value="内容" />
      <van-cell class="info_item" title="预约时间" value="内容" />
      <van-cell class="info_item" title="开始时间" value="内容" />
      <van-cell class="info_item" title="结束时间" value="内容" />
      <van-cell class="info_item" title="预约地点" value="内容" />
    </van-cell-group>
    <van-cell-group class="bottom_info">
        <van-cell class="info_item" title="预约用户" value="内容" />
        <van-cell class="info_item" title="预约用户" value="内容" />
        <van-cell class="info_item" title="预约用户" value="内容" />

    </van-cell-group>
    <div class="bottom_info_btn">
      <a-button shape="round" block class="cancel_btn">取消预约</a-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.book-locker-details {
  position: relative;
  height: 100%;
  overflow: auto;
  background-color: #fafafa;
  .top_info {
    margin-top: 16px;
    background-color: #fff;
    .info_item_status_success {
      --van-cell-value-color: rgba(78, 201, 91, 1);
    }
    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
  }
  .bottom_info {
    margin-top: 16px;

    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
  }
  .bottom_info_btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
}
:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
</style>
