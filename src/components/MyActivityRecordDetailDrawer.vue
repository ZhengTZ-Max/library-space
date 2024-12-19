<script setup>
import { reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Carousel from "@/components/CarouselCom.vue";
const store = useStore();

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const state = reactive({
  propsData: {
    activeKey: "",
    selectedRecord: {},
    selectedDetails: {},

    selectedDate: "",
    selectedTimeList: [],
    appointmentTime: "",
    isShowTextArea: false,
    comments: "",
  },
});
onMounted(() => {
  state.propsData = props?.data || {};
});
</script>
<template>
  <div class="drawer-content">
    <div
      class="content-top"
      v-if="
        (state.propsData?.activeKey === '1' &&
          state.propsData?.selectedRecord?.status_name !== '等待审核') ||
        state.propsData?.activeKey === '2'
      "
    >
      <Carousel>
        <template v-slot:content>
          <div v-for="item in state.propsData?.selectedRecord?.poster">
            <img class="image" :src="item?.file_path" alt="" />
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

    <div
      v-if="
        state.propsData?.activeKey === '1' &&
        state.propsData?.selectedRecord?.status_name !== '等待审核'
      "
    >
      <div class="content-details">
        <div class="info-item status">
          <span class="label">活动状态：</span>
          <span :class="statusClass">{{
            state.propsData?.selectedDetails?.status_name
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">活动名称：</span>
          <span class="value">{{ state.propsData?.selectedDetails?.title }}</span>
        </div>
        <div class="info-item">
          <span class="label">活动日期：</span>
          <span class="value">2024-02-19 ~ 2024-02-21</span>
        </div>
        <div class="info-item">
          <span class="label">活动时间：</span>
          <span class="value">08:00-12:00, 13:00-17:00</span>
        </div>
        <div class="info-item">
          <span class="label">可报名人数：</span>
          <span class="value">30</span>
        </div>
        <div class="info-item">
          <span class="label">活动地点：</span>
          <span class="value">嘉德馆-5F-501大型空间</span>
        </div>
        <div class="info_item_description">
          <span class="label_description">活动介绍：</span>
          <div class="value-wrapper">
            <p class="value">
              这是一段活动介绍，这是一段活动介绍这是一段活动介绍这是一段活动介绍这是一段活动介绍，这是一段活动介绍。
            </p>
          </div>
        </div>
        <div class="attachment-section">
          <div class="label">审批附件：</div>
          <div class="file-item">
            <!-- <img src="@/assets/doc-icon.png" alt="DOC" class="file-icon" /> -->
            <span class="file-name">文件名XXX.docx</span>
          </div>
        </div>
        <div class="attachment-section">
          <div class="label">活动策划案：</div>
          <div class="file-item">
            <!-- <img src="@/assets/pdf-icon.png" alt="PDF" class="file-icon" /> -->
            <span class="file-name">文件名XXX.pdf</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="state.activeKey === '2'">
      <div class="content-details">
        <div class="info-item status">
          <span class="label">活动状态：</span>
          <span :class="statusClass">{{
            state.propsData?.selectedDetails?.status_name
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">活动名称：</span>
          <span class="value">{{ state.propsData?.selectedDetails?.title }}</span>
        </div>
        <div class="schedule-row">
          <span class="label">活动日期：</span>
          <div class="date-options">
            <div
              v-for="(item, index) in state.propsData?.selectedDetails?.time"
              :key="item.date"
              :class="[
                'date-option',
                { selected: item.date === state.propsData?.selectedDate },
              ]"
              @click="onSelectDate(item)"
            >
              <div class="leftBadge basicsBadge">
                {{ item.isAppointment ? "已预约" : "未预约" }}
              </div>
              {{ item.date }}
            </div>
          </div>
        </div>
        <div class="schedule-row">
          <span class="label">活动时间：</span>
          <div class="time-options">
            <div
              v-for="(item, index) in state.propsData?.selectedTimeList"
              :key="item.id"
              :class="['time-option', { selected: item.is_subscribe === 1 }]"
            >
              {{ item.start_time }} ~ {{ item.end_time }}
              <div class="leftBadge basicsBadge">
                {{ item.is_subscribe === 1 ? "已预约" : "未预约" }}
              </div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <span class="label">报名人数：</span>
          <span class="value">{{ state.propsData?.selectedDetails?.max }}</span>
        </div>
        <div class="info-item">
          <span class="label">活动地点：</span>
          <span class="value">{{ state.propsData?.selectedDetails?.nameMerge }}</span>
        </div>
        <div class="info_item_description">
          <span class="label_description">活动介绍：</span>
          <div class="value-wrapper">
            <p class="value">
              {{ state.propsData?.selectedDetails?.content }}
            </p>
          </div>
        </div>
        <div
          :class="{
            info_item_comments: state.propsData.isShowTextArea,
            'info-item': !state.propsData.isShowTextArea,
          }"
        >
          <span class="label">活动评价：</span>
          <img
            v-if="!state.propsData.isShowTextArea"
            src="@/assets/my/activity-record/comments_edit.svg"
            alt=""
            @click="onShowTextArea"
          />
          <div v-if="state.propsData.isShowTextArea" class="value-wrapper">
            <a-textarea
              v-model:value="state.propsData.comments"
              :allowClear="true"
              :autosize="{ minRows: 1, maxRows: 5 }"
            />
            <img
              style="margin-right: 10px; margin-left: 10px"
              src="@/assets/my/activity-record/comments_cancel.svg"
              alt=""
              @click="onCancelComments"
            />
            <img
              src="@/assets/my/activity-record/comments_ok.svg"
              alt=""
              @click="onSaveComments"
            />
          </div>
        </div>
        <div v-if="state.propsData.selectedRecord.status_name === '报名成功'">
          <a-button
            type="primary"
            shape="round"
            size="large"
            @click="onHideDrawer"
            >取消报名</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">

.drawer-content {
  padding: 10px 15px;
}
.content-top {
  position: relative;
  width: 100%;
  max-width: 400px;
  .image {
    width: 400px;
    height: 225px;
  }
}
.controls {
  position: absolute;
  width: 263px;
  bottom: 30px;
  left: 136px;
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
.content-details {
  padding-top: 40px;
  color: black;
  .status-ongoing {
    color: #1890ff;
  }
  .status-ended {
    color: rgba(32, 32, 32, 1);
  }
  .status-pending {
    color: #faad14;
  }
  .status-success {
    color: #52c41a;
  }
  .status-default {
    color: #000000;
  }
  .info-item {
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .label {
    flex-shrink: 0;
    width: 100px;
    font-weight: bold;
    color: rgba(97, 97, 97, 1);
  }

  .info_item_description {
    display: flex;
    margin-bottom: 15px;
  }

  .label_description {
    flex-shrink: 0;
    font-weight: bold;
    color: rgba(97, 97, 97, 1);

    width: 70px; /* 调整标签的宽度 */
  }

  .value-wrapper {
    display: flex;
    flex: 1;
  }

  .value {
    color: rgba(32, 32, 32, 1);
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.5;
  }
  .info_item_comments {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .highlight {
    color: #1890ff;
  }

  .description {
    white-space: pre-wrap;
    display: flex;
    flex-direction: row;
  }

  .attachment-section {
    margin-top: 20px;
  }

  .file-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .file-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .file-name {
    color: #1890ff;
    text-decoration: underline;
    cursor: pointer;
  }

  .schedule-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .date-options,
  .time-options {
    display: flex;
    gap: 10px;
  }

  .date-option,
  .time-option {
    padding: 8px 16px;
    border: 1px solid #d9d9d9;
    background-color: #f5f5f5;
    color: #333;
    border-radius: 4px;
    position: relative;
  }
  .leftBadge {
    position: absolute;
    left: 0;
    top: 0;
  }
  .basicsBadge {
    padding: 3px 5px;
    background: #1a49c0;
    border-radius: 2px 0px 2px 0px;
    font-size: 7px;
    color: #ffffff;
  }

  .date-option.selected,
  .time-option.selected {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
  }
}
</style>
