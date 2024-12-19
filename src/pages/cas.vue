<template>
  <div class="pageVerify">
    <div class="loading">
      <div class="la-ball-atom la-dark la-2x">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="helpText">正在认证...</div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { Toast, Dialog } from "vant";
import { CasLogin } from "@/utils/login.js";
const store = useStore();
const router = useRouter();
const route = useRoute();
const state = reactive({});

onMounted(() => {
  checkInfo();
});

const checkInfo = () => {
  // https://sh.swechat.cc/h5/#/cas?cas=xxxxxx

  let cas = route.query.cas;

  if (cas) {
    console.log("登录");
    CasLogin(cas);
  }
};
</script>
<style lang="less">
.pageVerify {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
}
.helpText {
  margin-top: 45px;
  position: relative;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}
.loading {
  margin: 20px auto;
  position: relative;
  top: -10%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
