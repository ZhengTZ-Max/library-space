<script setup></script>
<template>
  <div class="AppointmentItem">
    <div class="header">
      <img src="@/assets/home/appSeatIcon.svg" alt="" srcset="" />
      <span>已约座位</span>
      <div class="seatType">普通座位</div>
    </div>

    <div class="intro">
      <div class="introFirst">
        <p>地点：图书馆-2F-外文特藏阅览室</p>
        <div class="areaView">
          区域平面图
          <img src="@/assets/home/rightIcon.svg" alt="" />
        </div>
      </div>
      <div>座位：015</div>
      <div>时间：2023-11-28 10:00~18:00</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.AppointmentItem {
  padding: 12px 20px;
  .header {
    display: flex;
    margin-bottom: 14px;
    font-size: 15px;
    color: #202020;
    span {
      padding-left: 4px;
      flex: 1;
      text-align: left;
    }
    .seatType {
      padding: 3px 8px;
      background: rgba(26, 73, 192, 0.1);
      border-radius: 3px 3px 3px 3px;
      font-weight: normal;
      font-size: 13px;
      color: #1a49c0;
    }
  }
  .intro {
    padding: 14px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px 6px 6px 6px;
    font-size: 14px;
    color: #4a4a4a;
    div {
      margin-bottom: 8px;
      text-align: left;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .introFirst {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .areaView {
      display: flex;
      font-size: 13px;
      color: #999999;
      img {
        margin-left: 5px;
      }
    }
  }
}
</style>
