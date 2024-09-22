<template>
    <div class="PcLayout">
      <PcHeader></PcHeader>
      <div class="PcContent">
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import PcHeader from "./PcHeader.vue";
  </script>
  
  <style lang="less">
  .PcLayout {
    width: 100%;
    header {
      height: 90px;
      background: #1a49c0;
    }
    .PcContent {
    }
  }
  </style>
  