<script setup>
import { reactive, onMounted, computed } from "vue";
const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  propsData: {},
});
onMounted(() => {
  state.propsData = props?.data || {};
});
</script>

<template>
  <div class="feedback_details">
    <!-- 意见反馈 -->
    <div v-if="state.propsData?.record?.type == '1'">
      <a-flex class="feedback_item">
        <div>{{ $t("feedback_type") }}:</div>
        <div style="flex: 1">{{ state.propsData?.detail?.cate_id }}</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{ $t("Feedback_content") }}:</div>
        <div style="flex: 1">{{ state.propsData?.record?.content }}</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{ $t("V4_feedback_images") }}:</div>
        <div style="flex: 1">
          <img
            :src="state.propsData?.defaultPic"
            style="width: 80px; height: 80px"
            alt=""
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{$t("phone")}}：</div>
        <div style="flex: 1">{{ state.propsData?.detail?.mobile }}</div>
      </a-flex>
      <a-divider dashed />
    </div>
    <div v-else>
      <!-- 设备报修 -->
      <a-flex class="feedback_item">
        <div>{{$t("Repair_Type")}}：</div>
        <div style="flex: 1">xxx类型</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{$t("Repair_Area")}}：</div>
        <div style="flex: 1">xxx区域</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{$t("TRAI_suspended")}}：</div>
        <div style="flex: 1">是</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{$t("user_phone")}}：</div>
        <div style="flex: 1">{{ state.propsData?.detail?.mobile }}</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>{{$t("Repair_Content")}}：</div>
        <div style="flex: 1">{{ state.propsData?.record?.content }}</div>
      </a-flex>
      <a-flex class="feedback_item">
        <div>报修图片：</div>
        <div style="flex: 1">
          <img
            :src="state.propsData?.defaultPic"
            style="width: 80px; height: 80px"
            alt=""
          />
        </div>
      </a-flex>

      <a-divider dashed />
    </div>
  </div>

  <div v-if="state.propsData?.detail?.reply?.length">
    <div class="feedback_item">{{$t("platform_response")}}:</div>

    <div>
      <template v-for="item in state.propsData?.detail?.reply" :key="item">
        <a-flex :vertical="true">
          <div class="feedback_system_item">
            <div>{{ item.content }}</div>
            <div>{{ item.create_time }}</div>
          </div>
        </a-flex>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.feedback_item {
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  color: rgba(97, 97, 97, 1);
  font-size: 14px;
  div {
    &:nth-child(2) {
      color: rgba(32, 32, 32, 1);
    }
  }
  .filter_box {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
  }
  .grayTextColor {
    color: rgba(140, 143, 158, 1) !important;
  }
}
.feedback_system_item {
  margin-top: 20px;
  margin-left: 30px;

  color: rgba(32, 32, 32, 1);
  font-size: 14px;
  div {
    &:nth-child(2) {
      color: rgba(97, 97, 97, 1);
    }
  }
}
</style>
