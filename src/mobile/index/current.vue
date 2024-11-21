<route>
    {
      meta: {
        showHead: false,
        showLeftBack:false,
        title:'menu_home',
        showTabbar:true
      }
    }
    </route>
<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AppointmentItem from "@/components/AppointmentItem.vue";
import Carousel from "@/components/CarouselCom.vue";

import { getSubscribe } from "@/request/home";

const router = useRouter();
const store = useStore();

const state = reactive({
  config: {
    seat: { type: [1, 3, 4], list: [] },
    space: { type: [2], list: [] },
  },
});

onMounted(() => {
  fetchSubscribe();
});

const fetchSubscribe = async () => {
  try {
    let params = {};
    const res = await getSubscribe(params);

    if (res?.code != 0) {
      return false;
    }

    filterConfig(res?.data || []);
  } catch (e) {
    console.log(e);
  }
};

const filterConfig = (list) => {
  let { seat, space } = state.config;

  state.config.seat.list = list.filter((e) => seat?.type?.includes(e?.type));
  state.config.space.list = list.filter((e) => space?.type?.includes(e?.type));
};
</script>

<template>
  <div class="current">
    <div class="CardCon">
      <Carousel>
        <template v-slot:content>
          <template v-for="item in state.config.seat.list" :key="item?.id">
            <AppointmentItem :data="item" @getList="fetchSubscribe" />
          </template>
        </template>
      </Carousel>
    </div>
  </div>
</template>
<style scoped lang="less">
.current {
  padding: 12px;
  background: #fafafa;
  height: 100%;
  overflow: auto;

  .CardCon {
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
    border-radius: 10px;
    :deep(.carouseDots) {
      bottom: 20px;
    }
  }
}
</style>
