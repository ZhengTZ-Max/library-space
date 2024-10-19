<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
import Carousel from "@/components/CarouselCom.vue";
const store = useStore();
const props = defineProps({
  data: {
    type: Object,
  },
  defaultId: {
    type: [String, Number],
  },
});
const state = reactive({
  list: [],
  initId: "",
});

onMounted(() => {
  state.list = props.data.brother_area;
  state.initId = props.defaultId;
  initFirst();
});

const initFirst = () => {
  let findRow = {};
  let list = state.list?.filter((e) => {
    if (e?.id == state.initId) {
      findRow = e;
    }
    return e?.id != state.initId;
  });
  list.unshift(findRow);
  state.list = list;
};
</script>
<template>
  <div class="container">
    <Carousel>
      <template v-slot:content>
        <div v-for="item in state.list" :key="item?.id" class="card">
          <div class="header">
            <div class="tag">{{ item?.premise_name }}</div>
            <img
              src="http://kfcs.skalibrary.com/home/images/first/area/45/1715999170251.jpg"
              alt="Reading Room"
              class="image"
            />
          </div>
          <div class="card-body">
            <div class="card-title">
              <h3>{{ item?.name }}</h3>
              <p class="floor">2F</p>
            </div>

            <div class="info">
              <span>总数 {{ item?.total_num }}</span>
              <span
                >空闲 <span class="available">{{ item?.free_num }}</span></span
              >
            </div>
            <div class="links">
              <p class="activeBtn">
                查看平面图
                <img src="@/assets/home/rightIcon.svg" alt="" />
              </p>
              <p class="activeBtn">
                查看详情
                <img src="@/assets/home/rightIcon.svg" alt="" />
              </p>
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>
<style lang="less" scoped>
.container {
  padding: 18px;
  padding-bottom: 0;
  border-radius: 10px;
  border: 1px solid #e7e7e7;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
}
.card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.header {
  position: relative;
}

.tag {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #48c774;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

.image {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.card-body {
  .card-title {
    margin: 14px 0 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 18px;
      margin: 0;
      color: #000;
    }

    .floor {
      color: gray;
      font-size: 18px;
    }
  }
}

.card-body .info {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 14px;
}

.available {
  color: #48c774;
}

.links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  font-size: 12px;
  color: #868686;

  p {
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      margin-left: 4px;
    }
  }
}

:deep(.slick-prev) {
  left: 0 !important;
}

:deep(.slick-next) {
  right: 0 !important;
}

:deep(.carouseDots) {
  bottom: 12px !important;
}
</style>
