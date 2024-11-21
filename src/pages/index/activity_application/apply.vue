<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getActivityApply, getActivityDetail } from "@/request/activity_application";
import ActivitySpaceSwipe from "@/components/ActivityApplication/ActivitySpaceSwipe.vue";
import LibraryInfo from "@/components/LibraryInfo.vue";

const router = useRouter();
const route = useRoute();

const state = reactive({
  initQuerySpaceId: route?.query?.id || "",
  activityApplyInfo: {},
  activityDetailInfo: {},
  activityDetailInfoShow: false,

  topImg: "",
});

onMounted(() => {
  fetchGetActivityApply();
});

const goToLink = (link) => {
  router.replace(link);
};

const fetchGetActivityApply = async () => {
  try {
    let params = {
      id: state.initQuerySpaceId,
    };
    let res = await getActivityApply(params);
    if (res.code != 0) return;
    state.activityApplyInfo = res?.data?.detail || {};
    state.topImg = res?.data?.detail?.firstImg || "";
  } catch (e) {
    console.log(e);
  }
};
const fetchGetActivityDetailInfo = async () => {
  try {
    let params = {
      id: state.initQuerySpaceId,
    };
    let res = await getActivityDetail(params);
    if (res.code != 0) return;
    state.activityDetailInfo = { ...res?.data, type: "activity" } || {};
    state.activityDetailInfoShow = true;
    console.log(state.activityDetailInfo);
  } catch (e) {
    console.log(e);
  }
};

const onChangeSlide = (row) => {
  state.initQuerySpaceId = row?.id;
  fetchGetActivityApply();
  console.log(row);
};



const onViewFloor = (row) => {
  console.log(row);
};
</script>
<template>
  <div class="apply">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/activity_application')"
              >选择空间</a-breadcrumb-item
            >
            <a-breadcrumb-item>填写申请信息</a-breadcrumb-item>
            <!-- <a-breadcrumb-item>1</a-breadcrumb-item> -->
          </a-breadcrumb>
        </div>
      </div>
    </a-affix>
    <div class="content">
      <div class="left">
        <div class="left_top">
          <div class="left_top_left">
            <img style="width: 90%; height: 100%" :src="state.topImg" alt="" />
          </div>
          <div class="left_top_right">
            <ActivitySpaceSwipe
              v-if="state.activityApplyInfo?.brother_area?.length"
              :data="state.activityApplyInfo"
              :defaultId="state.initQuerySpaceId"
              @changeSlide="onChangeSlide"
              @viewInfo="fetchGetActivityDetailInfo"
              @viewFloor="onViewFloor"
            />
          </div>
        </div>
        <div class="left_bottom">1</div>
      </div>
      <div class="right">
        <div class="right_top"></div>
        <div class="right_bottom"></div>
      </div>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.activityDetailInfoShow"
      title="空间详情"
      @ok="state.activityDetailInfoShow = false"
      destroyOnClose
      okText="确认"
      cancelText="关闭"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <LibraryInfo v-if="state.activityDetailInfo?.id" :data="state.activityDetailInfo" />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.apply {
  display: flex;
  flex-direction: column;
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
  }
  .content {
    flex: 1;
    padding: 0 30px;
    display: flex;
    margin-bottom: 30px;
    .left {
      flex: 1.2;
      background: rgba(247, 249, 251, 1);
      border-radius: 16px;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      .left_top {
        flex: 1;
        margin: 30px;
        margin-bottom: 0;
        padding: 30px;
        background-color: #fff;
        border-radius: 16px;
        display: flex;
        .left_top_left {
          flex: 1;
        }
        .left_top_right {
          width: 350px;
          padding-left: 30px;
          padding-top: 10px;
        }
      }
      .left_bottom {
        flex: 1.2;
        margin: 30px;
        background-color: #fff;
        border-radius: 16px;
      }
    }
    .right {
      flex: 1.3;
      background: rgba(247, 249, 251, 1);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      .right_top {
        flex: 1;
        margin: 30px;
        margin-bottom: 0;
        padding: 30px;
        background-color: #fff;
        border-radius: 16px;
      }
      .right_bottom {
        flex: 1.3;
        margin: 30px;
        background-color: #fff;
        border-radius: 16px;
      }
    }
  }
}
</style>
