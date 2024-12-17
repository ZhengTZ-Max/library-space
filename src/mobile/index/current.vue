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
import commonAppt from "@/components/moCommon/commonAppt.vue";

import { getSubscribe } from "@/request/home";

const router = useRouter();
const store = useStore();

const state = reactive({
  config: {
    seat: { type: [1, 3, 4], list: [] },
    space: { type: [2], list: [] },
    book: { type: [14, 15, 16], list: [] },
  },
  showList: [],
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
    state.showList = res?.data;
  } catch (e) {
    console.log(e);
  }
};

const filterConfig = (list) => {
  let { seat, space, book } = state.config;

  state.config.seat.list = list.filter((e) => seat?.type?.includes(e?.type));
  state.config.space.list = list.filter((e) => space?.type?.includes(e?.type));
  state.config.book.list = list.filter((e) => book?.type?.includes(e?.type));
};

const isEmpty = () => {
  // let { seat, space, book } = state.config;
  let show = false;
  if (state.showList?.length) {
    show = true;
  }
  return show;
};
</script>

<template>
  <div class="current">
    <template v-if="isEmpty()">
      <div class="CardCon">
        <Carousel>
          <template v-slot:content>
            <template v-for="item in state.showList" :key="item?.id">
              <AppointmentItem :data="item" @getList="fetchSubscribe" />
            </template>
          </template>
        </Carousel>
      </div>
    </template>

    <div v-else class="emptyCon">
      <img src="@/assets/home/emptyAppt.png" alt="" />
      <div class="apptBtn activeBtn" @click="router.push('/')">立即预约</div>
    </div>

    <div class="commonAppt">
      <commonAppt @handleShow="fetchSubscribe" />
    </div>
  </div>
</template>
<style scoped lang="less">
.current {
  padding: 12px;
  background: #fafafa;
  height: 100%;
  overflow: auto;
  .emptyCon {
    width: 250px;
    margin: 0 auto;
    margin-top: 75px;
    img {
      width: 100%;
    }
    .apptBtn {
      margin: 40px auto 0 auto;
      width: 160px;
      height: 42px;
      border-radius: 22px;
      border: 1px solid #c2c6d0;
      font-weight: 500;
      font-size: 15px;
      color: #8b93a7;
      line-height: 42px;
      text-align: center;
    }
  }
  .CardCon {
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
    border-radius: 10px;
    :deep(.carouseDots) {
      bottom: 20px;
    }
  }

  .commonAppt {
    margin-top: 12px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
}
</style>
