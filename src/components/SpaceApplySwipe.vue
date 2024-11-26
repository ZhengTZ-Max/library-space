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
      <template v-slot:content v-if="systemMode == 'pc'">
        <div v-for="item in state.list" :key="item?.id">
          <div class="title">
            <div class="title_left">{{ item.name }}</div>
            <div class="title_right">{{ item.storey_name }}</div>
          </div>
          <div class="seatNum">
            可容纳人数<span>{{ item.minPerson }} ~ {{ item.maxPerson }}人</span>
          </div>
          <div class="otherInfo">
            <div
              class="otherInfo_item activeBtn"
              @click="() => emits('viewFloor')"
            >
              查看平面图
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
            <div
              class="otherInfo_item activeBtn"
              @click="() => emits('viewInfo')"
            >
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
          <div class="contentInfo">
            <div class="contentInfo_left">联系人: <span>胡老师</span></div>
            <div class="contentInfo_left">
              联系电话: <span>13800000000</span>
            </div>
          </div>
          <div class="contentInfo">
            <div class="contentInfo_left">
              联系地址: <span>北京市海淀区</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:content v-else>
        <div class="item" v-for="item in state.list" :key="item?.id">
          <div style="padding: 16px; padding-bottom: 0">
            <van-row>
              <van-col span="10" class="img_col">
                <a-image
                  style="width: 104px; height: 90px; border-radius: 10px"
                  :src="item?.firstImg"
                  :preview="false"
                />
                <div class="basicsBadge" :class="{ greenBadge: false }">
                  {{ item?.premise_name }}
                </div>
                <!-- <div class="posBot">
                  - {{ filterCategorys(item?.categorys) }} -
                </div> -->
              </van-col>
              <van-col span="14" class="right_info">
                <div class="title">
                  <span>{{ item?.name }}</span>
                  <span>{{ item?.storey_name }}</span>
                </div>
                <div class="num">
                  <span>可容纳人数</span>
                  <span>{{ item?.minPerson }} ~ {{ item?.maxPerson }} 人</span>
                </div>

                <div class="action">
                  <span @click="() => emits('viewFloor')">查看平面图 ></span>
                  <span @click="() => emits('viewInfo')">查看详情 ></span>
                </div>
              </van-col>
            </van-row>
            <div class="boutique_mobile">
              <div
                class="boutiqueList"
                v-for="bout in item?.boutiques"
                :key="bout?.id"
              >
                {{ bout.name }}
              </div>
            </div>
          </div>
          <a-divider class="divider" dashed />
          <div class="contentInfo">
            <div class="contentInfo_left">联系人: <span>胡老师</span></div>
            <div class="contentInfo_left">
              联系电话: <span>13800000000</span>
            </div>
          </div>
          <div class="contentInfo">
            <div class="contentInfo_left">
              联系地址: <span>北京市海淀区</span>
            </div>
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
  .ant-carousel {
    height: 100%;
    :deep(.slick-slider) {
      height: 100%;
    }
  }
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

.contentInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .contentInfo_left {
    font-size: 14px;
    color: rgba(97, 97, 97, 1);
    span {
      font-size: 14px;
      color: rgba(32, 32, 32, 1);
    }
  }
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

.item {
  background-color: #fff;
  border-radius: 10px;
  .img_col {
    display: flex;
    position: relative;

    .basicsBadge {
      position: absolute;
      top: 0;
      left: 0;
      padding: 3px 8px;
      background: #1a49c0;
      border-radius: 6px 0px 6px 0px;
      font-size: 12px;
      color: #ffffff;
    }

    .posBot {
      position: absolute;
      bottom: 10px;
      left: 0;
      display: flex;
      width: 90%;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
    }
  }
  .right_info {
    padding: 0 0 5px 0;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #616161;
      span {
        &:nth-child(1) {
          font-size: 14px;
          color: #202020;
        }
      }
    }
    .num {
      margin-top: 8px;
      font-size: 12px;
      color: rgba(97, 97, 97, 1);
      display: flex;
      align-items: center;
      span {
        &:nth-child(2) {
          font-size: 14px;
          color: rgba(32, 32, 32, 1);
        }
      }
    }

    .action {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 12px;
        color: rgba(134, 134, 134, 1);
      }
    }
  }
  .boutique_mobile {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    .boutiqueList {
      border: 1px solid #f28800;
      font-size: 10px;
      color: rgba(242, 136, 0, 1);
      padding: 1px 4px;
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }
  .divider {
    margin: 10px 0 !important;
  }
  .bottom_button {
    margin: 15px;
    display: flex;
    justify-content: center;
    width: 110px;
    color: rgba(26, 73, 192, 1);
    font-size: 12px;
    font-family: AliHeavy !important;
    padding: 5px 10px;
    background-color: rgba(26, 73, 192, 0.06);
    border-radius: 17px;
    border: 1px solid rgba(26, 73, 192, 0.5);
  }
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
