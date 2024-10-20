<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
import AppointmentsCards from "@/components/h-appointments-cards.vue";
import Tabs from "@/components/h-tabs.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <div class="home">
    <div class="content">
      <div class="homel">
        <p class="title">欢迎您使用</p>
        <div class="library">
          图书馆<br />
          空间预约系统
        </div>
        <p class="subtitle">
          与其用华丽的外衣装饰自己 <br />
          不如用知识武装自己...
        </p>

        <Tabs></Tabs>
      </div>
    </div>

    <div class="footer"></div>

    <AppointmentsCards />
  </div>
</template>

<style scoped lang="less">
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    background-color: #ecf5ff;
    background-image: url("@/assets/home/homeBg.svg");
    background-position: right;
    background-repeat: no-repeat;
    .homel {
      padding: 100px 0 0 120px;
      min-width: 400px;
      max-width: 660px;
      width: 660px;
      .title {
        font-size: 18px;
        color: #202020;
      }
      .subtitle {
        margin-top: 20px;
        font-size: 18px;
        color: #202020;
      }
      .library {
        margin: 8px 0 0 0;
        font-weight: 400;
        font-size: 75px;
        color: #1a49c0;
        line-height: 80px;
        transform: skewX(-6deg);
        font-family: AliHeavy !important;
      }


    }
  }
  .footer {
    width: 100%;
    height: 60px;
    background: linear-gradient(90deg, #1a49c0 0%, #abbef0 100%);
  }
}
</style>
