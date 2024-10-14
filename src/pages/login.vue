<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { verify } from "@/request/login";

const store = useStore();
// const systemMode = store?.state?.systemMode;
const router = useRouter();
const state = reactive({
  verifyInfo: null,
  isCodeLoading: false,
  // passwordType: "password",
  // loginType: "",
});

const formState = reactive({
  username: "",
  password: "",
  code: "",
});

onMounted(() => {
  getVerify();
});

const getVerify = async () => {
  try {
    state.isCodeLoading = true;
    const res = await verify();
    state.isCodeLoading = false;

    if (res.code != 1) {
      return false;
    }
    state.verifyInfo = res.info;

    if (localStorage.getItem("isTest")) {
      state.user = "2022010"; // 用户名
      state.password = "000"; // 密码
      // state.code = '' // 验证码
    }
  } catch (e) {
    console.log(e);
  }
};

const onFinish = (values) => {
  console.log("Success:", values);
};
</script>
<template>
  <div class="login">
    <div class="header">
      <img
        :style="{ width: store.state.systemMode != 'pc' ? '100%' : '70%' }"
        class="bg"
        src="@/assets/login/headerBg.svg"
        alt=""
      />
      <div
        class="toggleLang"
        :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
      >
        <div class="langItem langActive activeBtn">中文</div>
        <div class="langItem activeBtn">English</div>
      </div>
    </div>

    <div class="content">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入学工号' }]"
        >
          <a-input v-model:value="formState.username" placeholder="学工号" />
        </a-form-item>

        <a-form-item
          placeholder="Username"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="密码"
          />
        </a-form-item>
        <a-form-item
          name="code"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input
            v-model:value="formState.code"
            placeholder="验证码"
            :maxlength="4"
          >
            <template #suffix>
              <a-spin :spinning="state.isCodeLoading">
                <img
                  class="verifyCode"
                  v-if="state.verifyInfo"
                  @click="getVerify"
                  :src="state.verifyInfo && state.verifyInfo.base64"
                  alt=""
                />
              </a-spin>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button class="submitBtn" type="primary" html-type="submit" block
            >提交</a-button
          >
          <p class="forgetPass">忘记密码？</p>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100vh;
  overflow: auto;
  max-width: 750px;
  margin: 0 auto;
  .header {
    position: relative;
    width: 100%;
    .bg {
      width: 70%;
      display: block;
      margin: 0 auto;
    }

    .toggleLang {
      position: absolute;
      top: 20px;
      right: 12px;
      width: 147px;
      height: 36px;
      padding: 4px;
      background: #f1f1f1;
      border-radius: 21px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .langItem {
        color: #868686;
        padding: 2px 16px;
        min-width: 60px;
        height: 28px;
      }
      .langActive {
        background: #ffffff;
        box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
        border-radius: 17px 17px 17px 17px;
        font-weight: bold;
        font-size: 14px;
        color: #1f56e1;
      }
    }
    .toggleLangPc {
      top: 45px;
      right: 70px;
    }
  }
  .content {
    margin: 0 auto;
    margin-top: 20px;
    width: 100%;
    padding: 0 15%;

    .ant-input,
    .ant-input-password,
    .ant-input-affix-wrapper {
      border-radius: 40px;
    }
    :deep(.ant-form .ant-col) {
      margin: 0 auto;
      .ant-form-item-explain-error {
        text-align: left;
        font-size: 13px;
      }
    }

    .submitBtn {
      margin-top: 40px;
      border-radius: 18px;
    }

    .verifyCode {
      width: 90px;
      height: 24px;
      object-fit: contain;
      cursor: pointer;
    }
    .forgetPass {
      margin: 0 auto;
      margin-top: 20px;
      font-weight: 500;
      font-size: 13px;
      color: #1a49c0;
    }
  }
}
</style>
