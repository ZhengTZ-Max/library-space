<script setup>
import AppointmentsCards from "@/components/h-appointments-cards.vue";
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

        <div class="tabs">
          <div v-for="i in 7" class="tabItem activeBtn">
            <img src="@/assets/home/seatIcon.svg" alt="" />
            <p>座位预约</p>
          </div>
        </div>
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
        font-size: 80px;
        color: #1a49c0;
        line-height: 100px;
      }

      .tabs {
        margin-top: 40px;
        display: grid;
        grid-template-columns: repeat(4, 106px);
        grid-row-gap: 30px;
        grid-column-gap: 30px;
        .tabItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0) 52%,
            #ffffff 100%
          );
          border-radius: 24px;
          border: 1px solid #ffffff;

          img {
            width: 44px;
          }
        }
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
