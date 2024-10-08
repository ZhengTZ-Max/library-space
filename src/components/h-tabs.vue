<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { getCategory } from "@/request/home";
const store = useStore();

const state = reactive({
  categoryList: [],
});

onMounted(() => {
  fetchCategory();
});

const fetchCategory = async () => {
  try {
    state.isCodeLoading = true;
    const res = await getCategory();
    state.isCodeLoading = false;

    if (res.code != 0) {
      return false;
    }
    state.categoryList = res.data || [];
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <div
    v-if="store.state.systemMode == 'pc' && state.categoryList?.length"
    class="tabs"
  >
    <div
      v-for="item in state.categoryList"
      :key="item.id"
      class="tabItem activeBtn"
    >
      <img src="@/assets/home/seatIcon.svg" alt="" />
      <p>{{ item?.name }}</p>
    </div>
  </div>
  <div
    v-else-if="store.state.systemMode == 'mobile' && state.categoryList?.length"
    class="m-tabs"
  >
    <div v-for="i in state.categoryList" class="tabItem activeBtn">
      <img src="@/assets/home/seatIcon.svg" alt="" />
      <p>座位预约</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.tabs {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(5, 106px);
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

.m-tabs {
}
</style>
