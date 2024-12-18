<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";

import { verify, login } from "@/request/login";

import { VerifySystem } from "@/utils/login.js";

const store = useStore();
// const systemMode = store?.state?.systemMode;
const lang = computed(() => store.state.lang);
const systemMode = computed(() => store.state.systemMode);
const apiConfig = computed(() => store.state.apiConfig);

const router = useRouter();
const route = useRoute();
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

watch(
  () => apiConfig?.value,
  (v) => {
    if (v?.wechat?.app_id) {
      VerifySystem({ config: v, router: router });
    }
  },
  {
    deep: true,
  }
);

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
      formState.username = "2022010"; // 用户名
      formState.password = "000"; // 密码
      // state.code = '' // 验证码
    }
  } catch (e) {
    console.log(e);
  }
};

const onFinish = (values) => {
  console.log("Success:", values);
  onLogin();
};

const onLogin = async () => {
  try {
    let open_id = localStorage.getItem("openId");

    let params = {
      key: state.verifyInfo?.key,
      open_id,
      ...formState,
    };
    console.log("params", params);
    let res = await login(params);
    if (res?.code != 1) {
      message.warning(res?.msg || "登录失败~");
      formState.code = "";
      getVerify();
      return false;
    }

    store.dispatch("updateLoginInfo", res?.data);
    sessionStorage.setItem("token", res.data.token);

    if (systemMode?.value == "pc") {
      router.replace("/");
    } else {
      router.replace("/mo");
    }
  } catch (e) {
    console.log(e);
  }
};

const toggleLang = (type) => {
  store.dispatch("updateLang", type);
};
</script>
<template>
  <div
    class="login"
    :style="{ overflow: systemMode == 'mobile' ? 'auto' : 'hidden' }"
  >
    <div class="header">
      <img
        :style="{ width: systemMode == 'mobile' ? '100%' : '70%' }"
        class="bg"
        src="@/assets/login/headerBg.svg"
        alt=""
      />
      <div class="toggleLang" :class="{ toggleLangPc: systemMode == 'pc' }">
        <div
          @click="toggleLang('zh')"
          :class="{ langActive: lang == 'zh' }"
          class="langItem activeBtn"
        >
          中文
        </div>
        <div
          @click="toggleLang('en')"
          :class="{ langActive: lang == 'en' }"
          class="langItem activeBtn"
        >
          English
        </div>
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
          :rules="[
            { required: true, message: $t('V4_please_enter_your_student_ID') },
          ]"
        >
          <a-input
            v-model:value="formState.username"
            :placeholder="$t('user_inputcard')"
          />
        </a-form-item>

        <a-form-item
          placeholder="Username"
          name="password"
          :rules="[
            {
              required: true,
              message: `${$t('V4_please_enter')} ${$t('Password')}`,
            },
          ]"
        >
          <a-input-password
            v-model:value="formState.password"
            :placeholder="$t('Password')"
          />
        </a-form-item>
        <a-form-item
          name="code"
          :rules="[
            {
              required: true,
              message: `${$t('V4_please_enter')} ${$t('verification_code')}`,
            },
          ]"
        >
          <a-input
            v-model:value="formState.code"
            :placeholder="$t('verification_code')"
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
          <a-button class="submitBtn" type="primary" html-type="submit" block>{{
            $t("Submit")
          }}</a-button>
          <p class="forgetPass">{{ $t("Forgot_password") }}？</p>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100vh;
  max-width: 750px;
  margin: 0 auto;
  /* 隐藏Chrome、Safari和Opera的滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
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
      height: 36px;
      padding: 4px;
      background: #f1f1f1;
      border-radius: 21px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
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
