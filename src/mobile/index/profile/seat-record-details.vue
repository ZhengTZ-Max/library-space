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
  <div class="area-record-details">
    <div class="top_info" :class="{height_calc:state.status === '预约成功'}">
      <van-cell-group>
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

      <br>
      <!-- 取消时间  签到时间-->
      <van-cell class="info_item" title="取消时间" value="内容" />
      <van-cell class="info_item" title="签到时间" value="内容" />
    </div>
    <!-- <van-cell-group class="bottom_info">
        <van-cell class="info_item" title="预约用户" value="内容" />
        <van-cell class="info_item" title="预约用户" value="内容" />
        <van-cell class="info_item" title="预约用户" value="内容" />

    </van-cell-group> -->
    <div class="bottom_info_btn" v-if="state.status === '预约成功'">
      <a-button shape="round" block class="cancel_btn">取消预约</a-button>
    </div>

  </div>
</template>
<style lang="less" scoped>
.area-record-details {
  position: relative;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .height_calc{
    height: calc(100% - 50px);
  }
  .top_info {
    overflow-y: auto;
    margin-top: 16px;

    .info_item_status_success {
      --van-cell-value-color: rgba(78, 201, 91, 1);
    }
    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }

    .all_member {
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      overflow: hidden;
      color: #616161;
      font-size: 14px;
      background-color: #fff;
      .right_value {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-end;
      }
    }
    .sign_time {
      padding: 10px 16px;
      background-color: #fff;
      margin-top: 10px;
      .sign_time_value {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        overflow: hidden;
        color: #616161;
        font-size: 14px;
      }
    }
  }
  .bottom_info {
    margin-top: 16px;

    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
  }
  .bottom_info_btn {
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
  .bottomAct {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
  }
}
:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
</style>
