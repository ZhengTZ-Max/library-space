<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Facility_Selection',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import NoticeList from "@/components/Notice/list.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <NoticeList />
</template>
<style lang="less" scoped></style>
