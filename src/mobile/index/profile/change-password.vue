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
import { updatePassword } from "@/request/my";
import { message } from "ant-design-vue";
import { getUserInfo } from "@/utils";

const store = useStore();
const router = useRouter();
const route = useRoute();

const userInfo = computed(() => getUserInfo());

const formState = reactive({
  userId: userInfo.value.card,
  username: userInfo.value.name,
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const onSubmit = async () => {
  try {
    if (
      !formState.userId ||
      !formState.username ||
      !formState.oldPassword ||
      !formState.newPassword ||
      !formState.confirmPassword
    ) {
      message.error("请填写完整信息");
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      message.error("新密码和确认密码不一致");
      return;
    }
    const passwordPattern =
      /^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%.*?&]{8,12}$/;
    if (!passwordPattern.test(formState.newPassword)) {
      message.error(
        "密码必须在8-12位之间,首位为大写字母,且包含大小写字母、数字和特殊字符(@$!%.*?&)"
      );
      return;
    }

    let params = {
      card: formState.userId,
      Oldpassword: formState.oldPassword,
      password: formState.newPassword,
      repassword: formState.confirmPassword,
    };

    const res = await updatePassword(params);
    if (res.code === 0) {
      message.success("修改成功");
      onHideDrawer();
    } else {
      message.error(res.msg);
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="change-password">
    <div class="top_info height_calc">
      <van-cell-group>
        <van-field
          v-model="formState.userId"
          :label="$t('visitor_Student_ID')"
          :placeholder="$t('V4_please_enter_your_student_ID')"
          input-align="right"
        />
        <van-field
          v-model="formState.username"
          :label="$t('user_name')"
          :placeholder="$t('user_inputname')"
          input-align="right"
        />
        <van-field
          v-model="formState.oldPassword"
          :label="$t('user_oldpassword')"
          :placeholder="$t('user_inputoldpassword')"
          input-align="right"
        />
        <van-field
          v-model="formState.newPassword"
          :label="$t('user_newpassword')"
          :placeholder="$t('V4_please_enter_the_new_password')"
          input-align="right"
        />
        <van-field
          v-model="formState.confirmPassword"
          :label="$t('user_conformpassword')"
          placeholder="请再次输入新密码"
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
        {{ $t("Return") }}
      </van-button>
      <van-button round block type="primary" @click="onApply">
        {{ $t("Submit") }}
      </van-button>
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
