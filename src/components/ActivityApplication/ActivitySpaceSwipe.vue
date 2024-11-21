<script setup>
import { reactive, onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Carousel from "@/components/CarouselCom.vue";
const store = useStore();
const emits = defineEmits(["viewInfo", "changeSlide", "viewFloor"]);
const systemMode = computed(() => store.state.systemMode);

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

const carouselRef = ref(null);

onMounted(() => {
  state.list = props.data.brother_area;
  state.initId = props.defaultId;
  initFirst();
});

const initFirst = () => {
  let findIndex = state.list?.findIndex((e) => e?.id == state.initId);
  carouselRef?.value?.goToSlide(findIndex);
};

const onChange = (v) => {
  emits("changeSlide", state.list[v]);
};

</script>
<template>
  <div class="container">
    <Carousel ref="carouselRef" :afterChange="onChange">
      <template v-slot:content>
        <div v-for="item in state.list" :key="item?.id">
          <div class="title">
            <div class="title_left">{{ item.name }}</div>
            <div class="title_right">{{ item.storey_name }}</div>
          </div>
          <div class="seatNum">可容纳人数<span>{{ item.minPerson }} ~ {{ item.maxPerson }}人</span></div>
          <div class="otherInfo">
            <div class="otherInfo_item" @click="() => emits('viewFloor')">
              查看平面图
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
            <div class="otherInfo_item" @click="() => emits('viewInfo')">
              查看详情
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
          </div>
          <div class="boutique">
            <div class="boutiqueList" v-for="bout in item?.boutiques">
              {{ bout.name }}
            </div>
          </div>

          <a-divider dashed />
          <div class="bottom_button" style="">
            查看申请说明<img
              src="@/assets/activity_application/right_arrow_gray.svg"
              alt=""
            />
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 0;
  padding-bottom: 0;
  height: 100%;
  //   border-radius: 10px;
  //   border: 1px solid #e7e7e7;
  //   box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title_left {
    font-size: 18px;
    color: rgba(32, 32, 32, 1);
  }
  .title_right {
    font-size: 18px;
    color: rgba(97, 97, 97, 1);
  }
}
.seatNum {
  text-align: left;
  margin: 10px 0;
  font-size: 14px;
  color: rgba(97, 97, 97, 1);
  span {
    &:nth-child(1) {
      font-size: 16px;
      color: rgba(32, 32, 32, 1);
    }
  }
}
.otherInfo {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  .otherInfo_item {
    display: flex;
    align-items: center;
    color: rgba(134, 134, 134, 1);
  }
}
.boutique {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  .boutiqueList {
    border: 1px solid #f28800;
    font-size: 12px;
    color: rgba(242, 136, 0, 1);
    padding: 2px 6px;
    margin-right: 10px;
    margin-top: 10px;
  }
}
.ant-divider-horizontal {
  margin-top: 21px;
  margin-bottom: 15px;
}

.bottom_button {
  display: flex;
  justify-content: center;
  width: 144px;
  color: rgba(26, 73, 192, 1);
  font-size: 14px;
  font-family: AliHeavy !important;
  padding: 5px 10px;
  background-color: rgba(26, 73, 192, 0.06);
  border-radius: 17px;
  border: 1px solid rgba(26, 73, 192, 0.5);
}

:deep(.carouseDots) {
  bottom: 20px !important;
}
:deep(.slick-prev) {
  left: 0 !important;

}

:deep(.slick-next) {
  right: 0 !important;
}
:deep(.slick-slide) {
  padding-bottom: 0;
}

</style>
