<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import Carousel from "@/components/CarouselCom.vue";
import { getEventDetails } from "@/request/event";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();

const state = reactive({
  id: route?.query?.id || "",
  eventDateList: [],
  eventDateIndex: "",
  eventTimeList: [],
  eventTimeIndex: "",
});

onMounted(() => {
  fetchEventDetails();
}); 

watch(
  () => state.eventDateList,
  (v) => {
    if (v?.length) {
      state.eventDateIndex = v[0]?.date;
      state.eventTimeList = v[0]?.List;
    }
  }
);

watch(
  () => state.eventTimeList,
  (v) => {
    if (v?.length) {
      state.eventTimeIndex = v[0]?.id;
    }
  }
);

const fetchEventDetails = async () => {
  try {
    let res = await getEventDetails({ id: state.id });
    state.eventDateList = res?.eventDateInfoList?.times;
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

</script>
<template>
  <div class="eventDetail">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/event')"
              >选择活动</a-breadcrumb-item
            >
            <a-breadcrumb-item>立即报名</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
    </a-affix>
    <div class="content">
      <div class="left_info">
        <div class="left_top">
          <div class="left_top_content">
            <Carousel>
              <template v-slot:content>
                <div v-for="i in 3">
                  <img
                    class="image"
                    src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
                    alt=""
                  />
                </div>
              </template>
            </Carousel>
            <div class="controls">
              <div
                class="toggleLang"
                :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
              >
                <div class="langItem langActive activeBtn">图片</div>
                <div class="langItem activeBtn">视频</div>
              </div>
              <div class="share-btn">
                <img
                  src="@/assets/rectangle_transaction.svg"
                  alt=""
                  class="background-image"
                />
                <span class="share-text">分享</span>
              </div>
            </div>
          </div>
        </div>
        <div class="left_bottom">
          <div>
            <span class="left_bottom_title_status">报名中</span>
            <span class="left_bottom_title_name">XXX学院-青春校园片展</span>
          </div>
          <div class="left_bottom_detail">
            <div class="left_bottom_detail_item">
              <span>活动地点：</span>
              <span>图书馆-3F-302研究室</span>
            </div>
            <div class="left_bottom_detail_item">
              <span>活动地点：</span>
              <span>
                这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right_info">
        <div class="right_info_title">活动日期</div>

      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.eventDetail {
  height: 100%;
  overflow: auto;
  .header {
    padding: 20px 30px;
    color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .leftTit {
      font-size: 18px;
      img {
        width: 22px;
        height: 22px;
      }
    }
    .rightAction {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .quickDate {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      .filters {
        margin-left: 20px;
        padding: 8px 16px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 18px 18px 18px 18px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }
  }
  .content {
    margin: 20px 30px;
    border-radius: 10px;
    height: calc(100% - 100px);
    background: #fff;
    display: flex;
    .left_info {
      flex: 1.3;
      display: flex;
      flex-direction: column;
      background: #f7f9fb;
      border-radius: 10px;
      margin-right: 20px;
      .left_top {
        flex: 3;
        background: #fff;
        border-radius: 10px;
        margin: 20px;
        .left_top_content {
          padding-top: 20px;
          padding-left: 20px;
          padding-right: 20px;
          position: relative;
          width: 100%;
          max-width: 680px;
          .image {
            width: 680px;
            height: 550px;
            padding-bottom: 30px;
          }

          .controls {
            position: absolute;
            width: 384px;
            bottom: 60px;
            left: 276px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .toggleLang {
              width: 130px;
              height: 28px;
              margin-bottom: 25px;
              padding: 4px;
              background: #333f6c;
              border-radius: 21px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .langItem {
                color: #868686;
                padding: 2px 16px;
                min-width: 60px;
                height: 28px;
              }
              .langActive {
                background: #707794;
                box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
                border-radius: 17px 17px 17px 17px;
                font-weight: bold;
                font-size: 14px;
                color: #fff;
              }
            }
            .share-btn {
              position: relative;
              display: inline-block;
              cursor: pointer;
            }

            .background-image {
              display: block;
              width: 100%;
              height: auto;
            }

            .share-text {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #ffffff;
              font-size: 14px;
            }
          }
        }
      }
      .left_bottom {
        flex: 1;
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        margin: 20px;
        .left_bottom_title_status {
          margin-right: 10px;
          padding: 3px 8px;
          background: #1a49c0;
          font-size: 14px;
          color: #ffffff;
        }
        .left_bottom_title_name {
          font-size: 18px;
          color: #202020;
        }
        .left_bottom_detail {
          .left_bottom_detail_item {
            display: flex;
            align-items: flex-start;
            margin-top: 15px;
            span {
              &:nth-child(1) {
                font-size: 16px;
                color: #a7a7a7;
                margin-left: 2px;
                
              }
              &:nth-child(2) {
                flex: 1;
                font-size: 16px;
                color: #6e6e6e;
                margin-left: 2px;
              }
            }
          }
        }
      }
    }
    .right_info {
      flex: 1;
      background: #f7f9fb;
      border-radius: 10px;
      margin-left: 20px;
      padding: 20px;
      .right_info_title {
        font-size: 18px;
        color: #202020;
        font-weight: bold;
      }
    }
  }
}
:deep(.slick-prev ) {
  left: 0 !important;
}
:deep(.slick-next) {
  right: 0 !important;
}
:deep(.carouseDots) {
  bottom: 18px !important;
}
</style>
