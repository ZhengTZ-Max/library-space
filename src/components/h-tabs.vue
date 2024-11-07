<script setup>
import { reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const categoryList = computed(() => store.state.categoryList);

onMounted(() => {});

const onGoToLink = (row, t) => {
  console.log(row);
  if (t == "m") {
    router.push(`/mo${row?.path}`);
  } else {
    router.push(row?.path);
  }
};
</script>
<template>
  <div
    v-if="store.state.systemMode == 'pc' && categoryList?.length"
    class="tabs"
  >
    <div
      v-for="item in categoryList"
      :key="item.id"
      class="tabItem activeBtn"
      @click="onGoToLink(item)"
    >
      <img src="@/assets/home/seatIcon.svg" alt="" />
      <p>{{ item?.name }}</p>
    </div>
  </div>
  <div
    v-else-if="store.state.systemMode == 'mobile' && categoryList?.length"
    class="m-tabs"
  >
    <div
      v-for="item in categoryList"
      :key="item.id"
      class="tabItem activeBtn"
      @click="onGoToLink(item, 'm')"
    >
      <img src="@/assets/home/seatIcon.svg" alt="" />
      <p>{{ item?.name }}</p>
    </div>
  </div>
  <a-skeleton v-else />
</template>

<style scoped lang="less">
.tabs {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(5, 110px);
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
    p {
      font-size: 15px;
      color: #616161;
    }
    img {
      width: 44px;
    }
  }
}

.m-tabs {
  padding: 22px 8px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
  border-radius: 10px 10px 10px 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 30px;

  .tabItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      text-align: center;
      font-size: 12px;
      color: #616161;
    }
    img {
      width: 44px;
    }
  }
}
</style>
