<script setup>
import { reactive, onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
});

const state = reactive({
  detail: {
    type: "",
  },
  defaultPic:
    "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
});

onMounted(() => {
  state.detail = props.data;
});
</script>
<template>
  <div class="option_details_box">
    <div v-if="state.detail.type == '1'">
      <div class="option_details_item">
        <div class="option_details_item_left">{{ $t("feedback_type") }}</div>
        <div class="option_details_item_right">
          {{ state.detail?.cate_name }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item_content">
        <div class="option_details_item_content_title">{{ $t("Feedback_content") }}</div>
        <div class="option_details_item_content_content">
          {{ state.detail?.content }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item_content">
        <div class="option_details_item_content_title">{{ $t("V4_feedback_images") }}</div>
        <div class="option_details_item_content_content">
          <img
            :src="state.detail?.pic_urls[0]?.file_path"
            style="width: 80px; height: 80px"
            alt=""
          />
        </div>
      </div>
      <a-divider />
      <div class="option_details_item">
        <div class="option_details_item_left">{{ $t("phone") }}</div>
        <div class="option_details_item_right">
          {{ state.detail?.mobile }}
        </div>
      </div>
    </div>
    <div v-if="state.detail.type == '2'">
      <div class="option_details_item">
        <div class="option_details_item_left">{{ $t("Repair_Type") }}</div>
        <div class="option_details_item_right">
          {{ state.detail?.type_name }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item">
        <div class="option_details_item_left">{{ $t("Repair_Area") }}</div>
        <div class="option_details_item_right">
          {{ state.detail?.nameMerge }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item" v-if="state.detail.type_name != '空间'">
        <div class="option_details_item_left">{{ $t("V4_report_a_seat") }}</div>
        <div class="option_details_item_right">
          {{ state.detail?.space_name }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item">
        <div class="option_details_item_left">{{ $t("TRAI_suspended") }}</div>
        <div class="option_details_item_right">是</div>
      </div>
      <a-divider />
      <div class="option_details_item">
        <div class="option_details_item_left">{{ $t("user_phone") }}</div>
        <div class="option_details_item_right">
          {{ state.detail?.mobile }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item_content">
        <div class="option_details_item_content_title">{{ $t("Repair_Content") }}</div>
        <div class="option_details_item_content_content">
          {{ state.detail?.content }}
        </div>
      </div>
      <a-divider />
      <div class="option_details_item_content">
        <div class="option_details_item_content_title">报修图片</div>
        <div class="option_details_item_content_content">
          <img
            :src="state.detail?.pic_urls[0]?.file_path"
            style="width: 80px; height: 80px"
            alt=""
          />
        </div>
      </div>
    </div>

    <div class="reply_box" v-if="state.detail.reply?.length > 0">
      <div class="reply_box_title">{{ $t("platform_response") }}</div>
      <div>
        <template v-for="item in state.detail.reply" :key="item">
          <a-flex :vertical="true">
            <div class="feedback_system_item">
              <div>{{ item.content }}</div>
              <div>{{ item.create_time }}</div>
            </div>
          </a-flex>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.option_details_box {
  height: calc(100vh - 125px);
  overflow-y: auto;
  .option_details_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 16px;

    .option_details_item_left {
      color: rgba(97, 97, 97, 1);
      font-size: 14px;
    }
    .option_details_item_right {
      color: rgba(32, 32, 32, 1);
      font-size: 14px;
    }
  }
  .option_details_item_content {
    background-color: #fff;
    padding: 16px;
    .option_details_item_content_title {
      color: rgba(97, 97, 97, 1);
      font-size: 14px;
    }
    .option_details_item_content_content {
      color: rgba(32, 32, 32, 1);
      font-size: 14px;
      margin-top: 10px;
    }
  }

  .reply_box {
    margin-top: 10px;
    background-color: #fff;
    padding: 16px;
    .reply_box_title {
      color: rgba(97, 97, 97, 1);
      font-size: 14px;
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
  }
}
</style>
