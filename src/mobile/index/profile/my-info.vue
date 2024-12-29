<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Personal_Information',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getMyInfo, updateMyInfo } from "@/request/my";
import { message } from "ant-design-vue";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route?.query?.id || "",
  status: "",
  isEdit: false,
  mobile: "",
  email: "",
});

onMounted(() => {
  fetchMyInfo();
});

watch(
  () => state.userInfo,
  (v) => {
    if (v) {
      state.mobile = v.mobile;
      state.email = v.email;
    }
  }
);
watch(
  () => state.userInfo?.status,
  (v) => {
    if (v == "1") {
      state.status = "正常";
    } else if (v == "0") {
      state.status = "注销";
    } else if (v == "2") {
      state.status = "挂失";
    } else if (v == "3") {
      state.status = "临时禁止";
    } else {
      state.status = "未知状态";
    }
  }
);

const fetchMyInfo = async () => {
  try {
    const res = await getMyInfo();
    if (res.code === 0) {
      state.userInfo = res.data || {};
      // if (state.userInfo.name) {
      //   store.dispatch("setUserName", res.data.name);
      // }
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const onApply = () => {
  if (!state.mobile) {
    message.error("请输入手机号");
    return;
  }
  if (!state.email) {
    message.error("请输入邮箱");
    return;
  }
  fetchUpdateMyInfo();
};

const fetchUpdateMyInfo = async () => {
  try {
    let params = {
      mobile: state.mobile,
      email: state.email,
    };
    const res = await updateMyInfo(params);
    if (res.code === 0) {
      message.success("修改成功");
      state.isEdit = false;
      state.userInfo.mobile = state.mobile;
      state.userInfo.email = state.email;
      store.dispatch("updateLoginInfo", state.userInfo);
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="my-info">
    <div class="top_info" :class="{ height_calc: state.isEdit }">
      <div class="mobile_email_info">
        <div class="mobile_email_title">{{ $t("user_telphone") }}</div>

        <div style="display: flex">
          <a-input
            v-model:value="state.mobile"
            :bordered="false"
            :placeholder="$t('Please_phone_number')"
            class="mobile_email_input"
            :disabled="!state.isEdit"
            size="small"
          />
          <img
            v-if="!state.isEdit"
            @click="state.isEdit = !state.isEdit"
            src="@/assets/my/activity-record/comments_edit.svg"
            alt=""
          />
        </div>
      </div>
      <div class="divider"></div>
      <div class="mobile_email_info">
        <div class="mobile_email_title">{{ $t("user_email") }}</div>

        <div style="display: flex">
          <a-input
            v-model:value="state.email"
            :bordered="false"
            :placeholder="$t('Please_Enter_Email')"
            class="mobile_email_input"
            :disabled="!state.isEdit"
            size="small"
          />
          <img
            v-if="!state.isEdit"
            @click="state.isEdit = !state.isEdit"
            src="@/assets/my/activity-record/comments_edit.svg"
            alt=""
          />
        </div>
      </div>
      <van-cell-group>
        <van-cell
          class="info_item"
          :title="$t('visitor_Student_ID')"
          :value="state.userInfo?.card"
        />
        <van-cell
          class="info_item"
          :title="$t('dept')"
          :value="state.userInfo?.deptName"
        />
        <van-cell
          class="info_item"
          :title="$t('status')"
          :value="state.status"
        />
        <van-cell
          class="info_item"
          :title="$t('Card_Validity')"
          :value="state.userInfo?.date"
        />
      </van-cell-group>
    </div>

    <!-- <div class="bottom_info_btn">
      <a-button shape="round" block class="cancel_btn">取消预约</a-button>
    </div> -->
    <div class="bottomAct" v-if="state.isEdit">
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
.my-info {
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
