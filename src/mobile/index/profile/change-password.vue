<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'user_changepassword',
        showTabbar:true
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
  userId: "",
  username: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
</script>
<template>
  <div class="change-password">
    <div class="top_info height_calc">
      <van-cell-group>
        <van-field
          v-model="state.userId"
          label="学工号"
          placeholder="请输入学工号"
          input-align="right"
        />
        <van-field
          v-model="state.username"
          label="姓名"
          placeholder="请输入姓名"
          input-align="right"
        />
        <van-field
          v-model="state.oldPassword"
          label="原密码"
          placeholder="请输入原密码"
          input-align="right"
        />
        <van-field
          v-model="state.newPassword"
          label="新密码"
          placeholder="请输入新密码"
          input-align="right"
        />
        <van-field
          v-model="state.confirmPassword"
          label="确认密码"
          placeholder="请在此输入新密码"
          input-align="right"
        />
      </van-cell-group>
    </div>

    <!-- <div class="bottom_info_btn">
      <a-button shape="round" block class="cancel_btn">取消预约</a-button>
    </div> -->
    <div class="bottomAct">
      <van-button round block type="default" @click="router.go(-1)">
        <img src="@/assets/seat/moBackBtn.svg" alt="" />
        返回
      </van-button>
      <van-button round block type="primary" @click="onApply">提交</van-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.change-password {
  position: relative;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .height_calc {
    height: calc(100% - 50px);
  }
  .top_info {
    overflow-y: auto;

    .mobile_email_info {
      display: flex;
      justify-content: space-between;
      padding: 10px 16px;
      background-color: #fff;
      .mobile_email_title {
        font-size: 14px;
        color: #616161;
      }
      .mobile_email_input {
        color: #616161;
        text-align: right;
      }
    }
    .divider {
      margin: 0 16px;
      border-top: 1px solid #e0e0e0;
    }
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
    background-color: #fff;
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
:deep(.ant-divider-horizontal) {
  margin: 0 !important;
  padding: 0 16px !important;
}
</style>
