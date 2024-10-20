<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import Carousel from "@/components/CarouselCom.vue";
import { getEventDetails } from "@/request/event";
import { exchangeDateTime } from "../../../utils";

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
  eventMaxNum: "",
  eventCurrentNum: "",
});

onMounted(() => {
  fetchEventDetails();
});

watch(
  () => state.eventDateList,
  (v) => {
    if (v?.length) {
      state.eventDateIndex = v[0]?.date;
      state.eventTimeList = v[0]?.list;
    }
  }
);

watch(
  () => state.eventTimeList,
  (v) => {
    if (v?.length) {
      state.eventTimeIndex = v[0]?.id;
      state.eventCurrentNum = v[0]?.count || "1";
    }
  }
);
const onChangeDateAct = (row) => {
  state.eventDateIndex = row?.date;
  state.eventTimeList = row?.list;
  state.eventCurrentNum = row?.list[0]?.count || "1";
};
const onChangeTimeAct = (row) => {
  state.eventTimeIndex = row?.id;
  state.eventCurrentNum = row?.count || "1";
};

const getDefalutList = () => {
  return {
    code: 0,
    message: "操作成功",
    data: {
      id: "1402",
      title: "v4申请活动标题",
      status: -1,
      max: "25",
      nameMerge: "活动馆舍-一层-活动区域",
      ennameMerge: "new prem--ActivityArea001",
      content: "v4申请活动内容",
      ddl_time: "2024-04-19 16:59:30",
      status_name: "未开始",
      status_en_name: "Not started",
      times: [
        {
          date: "2024-04-18",
          list: [
            {
              id: "1942",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-19",
          list: [
            {
              id: "1943",
              show_time: "10:00-20:00",
              count: 0,
            },
          ],
        },
        {
          date: "2024-04-20",
          list: [
            {
              id: "1944",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-21",
          list: [
            {
              id: "1945",
              show_time: "08:00-09:00",
              count: 1,
            },
            {
              id: "1946",
              show_time: "10:00-20:00",
              count: 1,
            },
            {
              id: "1947",
              show_time: "21:00-22:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-22",
          list: [
            {
              id: "1948",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-23",
          list: [
            {
              id: "1949",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-24",
          list: [
            {
              id: "1950",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
        {
          date: "2024-04-25",
          list: [
            {
              id: "1951",
              show_time: "10:00-20:00",
              count: 1,
            },
          ],
        },
      ],
    },
  };
};

const fetchEventDetails = async () => {
  try {
    let res = await getEventDetails({ id: state.id });
    if (res?.code == 10001) {
      state.eventDateList = getDefalutList()?.data?.times;
      state.eventMaxNum = getDefalutList()?.data?.max;
      console.log(state.eventDateList);
    } else {
      state.eventDateList =
        res.data?.times && res.data.times.length > 0
          ? res.data?.times
          : getDefalutList();
      state.eventMaxNum = getDefalutList()?.data?.max;
    }
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
              <div></div>
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
                这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍
                这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍，这是一段活动介绍
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right_info">
        <div class="right_info_box">
          <div class="right_info_title">活动日期</div>
          <a-row v-if="state.eventDateList?.length" :gutter="[15, 15]">
            <template v-for="item in state.eventDateList" :key="item?.date">
              <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <div
                  class="libraryItem cardItemBorTran"
                  :class="{ activeItem: item?.date == state.eventDateIndex }"
                  @click="onChangeDateAct(item)"
                >
                  <span>{{ moment(item?.data).format("MM-DD") }}</span>
                  <span>{{ exchangeDateTime(item?.data, 31) }}</span>
                  <div
                    v-if="item?.date == state.eventDateIndex"
                    style="
                      position: absolute;
                      margin-left: 71px;
                      margin-top: 40px;
                    "
                  >
                    <img src="@/assets/event/checked.svg" />
                  </div>
                </div>
              </a-col>
            </template>
          </a-row>
          <a-empty v-else />
          <div class="right_info_title" style="margin-top: 50px">活动时间</div>
          <a-row v-if="state.eventTimeList?.length" :gutter="[15, 15]">
            <template v-for="item in state.eventTimeList" :key="item?.id">
              <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <div
                  class="libraryItem cardItemBorTran"
                  :class="{ activeItem: item?.id == state.eventTimeIndex }"
                  @click="onChangeTimeAct(item)"
                >
                  <span>{{ item?.show_time }}</span>
                  <div
                    v-if="item?.id == state.eventTimeIndex"
                    style="
                      position: absolute;
                      margin-left: 71px;
                      margin-top: 20px;
                    "
                  >
                    <img src="@/assets/event/checked.svg" />
                  </div>
                </div>
              </a-col>
            </template>
          </a-row>

          <div class="right_info_title" style="margin-top: 50px">报名人数</div>
          <div
            v-if="state.eventTimeList?.length"
            style="color: rgba(97, 97, 97, 1)"
          >
            {{ state.eventCurrentNum }}/{{ state.eventMaxNum }}
          </div>
          <div v-if="state.eventTimeList?.length" class="right_info_btn">
            <a-button type="primary" shape="round" style="width: 200px"
              >我要报名</a-button
            >
          </div>
        </div>
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
      width: 60%;
      background: #f7f9fb;
      border-radius: 10px;
      margin-right: 20px;
      overflow: auto;
      .left_top {
        height: 65%;
        min-height: 570px;
        background: #fff;
        border-radius: 10px;
        margin: 20px;
        .left_top_content {
          padding: 20px 20px 0 20px;
          position: relative;
          width: 100%;
          .image {
            width: 100%;
            height: 500px;
            object-fit: cover; /* 确保图片不失真 */
          }

          .controls {
            position: absolute;

            width: 97%;
            margin-left: 0%;
            bottom: 30px;
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
      width: 40%;
      background: #f7f9fb;
      border-radius: 10px;
      margin-left: 20px;
      padding: 20px;
      .right_info_box {
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .right_info_title {
          font-size: 18px;
          color: #202020;
          font-weight: bold;
          font-family: AliHeavy !important;
          margin-bottom: 20px;
        }
        .libraryItem {
          position: relative;
          background-color: rgba(97, 97, 97, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .right_info_btn {
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
      }
    }
  }
}
:deep(.slick-prev) {
  left: 0 !important;
  bottom: 12px !important;
}
:deep(.slick-next) {
  right: 0 !important;
  bottom: 12px !important;
}
:deep(.carouseDots) {
  bottom: 3px !important;
}
</style>
