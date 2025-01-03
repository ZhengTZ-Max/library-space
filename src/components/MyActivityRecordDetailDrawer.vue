<script setup>
import { reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Carousel from "@/components/CarouselCom.vue";
import MyActivityRecordShare from "@/components/MyActivityRecordShare.vue";
import Uploader from "@/components/Uploader.vue";
import PDFICON from "@/assets/common/pdfIcon.png";
import DOCICON from "@/assets/common/docIcon.png";

const store = useStore();

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const state = reactive({
  onShare: false,
  propsData: {
    activeKey: "",

    selectedDetails: {},

    selectedDate: "",
    selectedTimeList: [],
    appointmentTime: "",
    isShowTextArea: false,
    comments: "",
  },

  quickMode: "1",
  initApprove: [
    // {
    //   file_ext: "pdf",
    //   file_name: "NKY2Pj2ipqIUQmFu1732951373143983.pdf",
    //   file_origin_name: "Transactions Explanation.pdf",
    //   file_path:
    //     "/upload/activity/2024-11-30/NKY2Pj2ipqIUQmFu1732951373143983.pdf",
    //   file_size: "524.64 KB",
    // },
  ],
  poster: [],
  approve: [],
  publicize: [],
  plan: [],
  materials: [],
});
onMounted(() => {
  state.propsData = props?.data || {};

  console.log(state.propsData);
});

const getFileIcon = (fileExt) => {
  switch (fileExt) {
    case "pdf":
      return PDFICON; // PDF 图标
    case "doc":
    case "docx":
      return DOCICON; // Word 图标
    case "xls":
    case "xlsx":
      return require("@/assets/common/excelIcon.png"); // Excel 图标
    default:
      return require("@/assets/common/defaultIcon.png"); // 默认图标
  }
};

const onCancelComments = () => {
  state.propsData.isShowTextArea = false;
  state.propsData.comments = "";
};

const onSelectDate = (item) => {
  state.propsData.selectedDate = item.date;
  state.propsData.selectedTimeList = item.time;
};

const fileUpload = (data, type) => {
  console.log(data, type);
  if (type == "poster") {
    state.poster = filterFileUpload(data);
  } else if (type == "approve") {
    state.approve = filterFileUpload(data);
  } else if (type == "publicize") {
    state.publicize = filterFileUpload(data);
  } else if (type == "plan") {
    state.plan = filterFileUpload(data);
  } else if (type == "materials") {
    state.materials = filterFileUpload(data);
  }

  console.log(state);
};

const filterFileUpload = (files) => {
  let list = files || [];

  list = list.map((e) => {
    let fileRow = {};
    if (e?.status == "done" && e?.response?.code == 0) {
      fileRow = e?.response?.data;
    }
    return fileRow;
  });

  return list;
};

const onOpenFile = (file_path) => {
  window.open(file_path, "_blank");
};
</script>
<template>
  <div class="drawer-content">
    <div class="content-top">
      <div class="carousel-box">
        <Carousel>
          <template v-slot:content>
            <div
              v-if="state.quickMode == '1'"
              v-for="item in state.propsData?.selectedDetails?.poster"
            >
              <img class="image" :src="item?.file_path" alt="" />
            </div>
            <div
              v-if="state.quickMode == '2'"
              v-for="item in state.propsData?.selectedDetails?.publicize"
            >
              <img class="image" :src="item?.file_path" alt="" />
            </div>
          </template>
        </Carousel>
      </div>
      <div
        class="uploadFile-box"
        v-if="state.propsData.selectedDetails.status_name == '等待审核'"
      >
        <div class="uploadFile-item">
          <div>
            <span style="color: #ff4d4f">*</span>{{ $t("V4_event_poster") }}:
          </div>
          <Uploader
            :initFileList="state.poster"
            filePath="activity"
            :showUploadList="true"
            :maxCount="1"
            @onFileUpload="(v) => fileUpload(v, 'poster')"
            accept=".png, .jpg, .jpeg"
            list-type="picture-card"
          >
            <img src="@/assets/feedback_uploadimg.svg" alt="" />
          </Uploader>
        </div>
        <div class="uploadFile-item">
          <div>{{ $t("V4_promotional_video") }}:</div>
          <Uploader
            :initFileList="state.publicize"
            filePath="activity"
            :showUploadList="true"
            :maxCount="1"
            @onFileUpload="(v) => fileUpload(v, 'publicize')"
            accept=".mp4,.mov"
            list-type="picture-card"
          >
            <img src="@/assets/feedback_uploadimg.svg" alt="" />
          </Uploader>
        </div>
      </div>
      <div
        class="controls"
        v-if="state.propsData?.selectedDetails?.publicize?.length > 0"
      >
        <div
          class="toggleLang"
          :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
        >
          <div
            class="langItem activeBtn"
            :class="{ langActive: state.quickMode == '1' }"
            @click="state.quickMode = '1'"
          >
            {{ $t("photo") }}
          </div>
          <div
            class="langItem activeBtn"
            :class="{ langActive: state.quickMode == '2' }"
            @click="state.quickMode = '2'"
          >
            {{ $t("video") }}
          </div>
        </div>
        <div class="share-btn">
          <img
            src="@/assets/rectangle_transaction.svg"
            alt=""
            class="background-image"
          />
          <span class="share-text" @click="state.onShare = true">{{
            $t("V4_share")
          }}</span>
        </div>
      </div>
    </div>

    <!-- 申请记录 详情 -->
    <div
      v-if="
        state.propsData?.activeKey === '1' &&
        state.propsData?.selectedDetails?.status_name !== '等待审核'
      "
    >
      <div class="content-details">
        <div class="info-item status">
          <span class="label">{{ $t("activity_status") }}：</span>
          <span :class="statusClass">{{
            state.propsData?.selectedDetails?.status_name
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activityname") }}：</span>
          <span class="value">{{
            state.propsData?.selectedDetails?.title
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("activity_Date") }}：</span>
          <span class="value"
            >{{ state.propsData?.selectedDetails?.begin_date }} ~
            {{ state.propsData?.selectedDetails?.end_date }}</span
          >
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activitytime") }}：</span>
          <span class="value"
            >{{ state.propsData?.selectedDetails?.begin_time }} ~
            {{ state.propsData?.selectedDetails?.end_time }}</span
          >
        </div>
        <div class="info-item">
          <span class="label">{{ $t("Number_of_registrations") }}：</span>
          <span class="value">{{ state.propsData?.selectedDetails?.max }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activityplace") }}：</span>
          <span class="value">{{
            state.propsData?.selectedDetails?.nameMerge
          }}</span>
        </div>
        <div class="info_item_description">
          <span class="label_description"
            >{{ $t("Activity_Introduction") }}：</span
          >
          <div class="value-wrapper">
            <p class="value">
              {{ state.propsData?.selectedDetails?.content }}
            </p>
          </div>
        </div>
        <div
          class="attachment-section"
          v-if="state.propsData?.selectedDetails?.approve"
        >
          <div class="label">{{ $t("V4_approval_attachments") }}：</div>
          <div
            class="file-item"
            @click="
              onOpenFile(
                state.propsData?.selectedDetails?.approve[0]?.file_path
              )
            "
          >
            <img
              :src="
                getFileIcon(
                  state.propsData?.selectedDetails?.approve[0]?.file_ext
                )
              "
              alt="DOC"
              class="file-icon"
            />
            <span class="file-name">{{
              state.propsData?.selectedDetails?.approve[0]?.file_name
            }}</span>
          </div>
        </div>
        <div
          class="attachment-section"
          v-if="state.propsData?.selectedDetails?.plan"
        >
          <div class="label">{{ $t("V4_event_plan") }}：</div>
          <div
            class="file-item"
            @click="
              onOpenFile(state.propsData?.selectedDetails?.plan[0]?.file_path)
            "
          >
            <img
              :src="
                getFileIcon(state.propsData?.selectedDetails?.plan[0]?.file_ext)
              "
              alt="PDF"
              class="file-icon"
            />
            <span class="file-name">{{
              state.propsData?.selectedDetails?.plan[0]?.file_name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请记录 等待审核状态  编辑 -->
    <div
      v-if="
        state.propsData?.activeKey === '1' &&
        state.propsData?.selectedDetails?.status_name == '等待审核'
      "
    >
      <div class="content-details">
        <div class="info-item status">
          <span class="label">{{ $t("activity_status") }}：</span>
          <span :class="statusClass">{{
            state.propsData?.selectedDetails?.status_name
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activityname") }}:</span>
          <a-input v-model:value="state.propsData.selectedDetails.title" />
        </div>
        <div class="info-item">
          <span class="label">{{ $t("activity_Date") }}：</span>
          <div class="disable_input_item">
            {{ state.propsData?.selectedDetails?.begin_date }} ~
            {{ state.propsData?.selectedDetails?.end_date }}
          </div>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activitytime") }}：</span>
          <div class="disable_input_item">
            {{ state.propsData?.selectedDetails?.begin_time }} ~
            {{ state.propsData?.selectedDetails?.end_time }}
          </div>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("Number_of_registrations") }}：</span>
          <div class="disable_input_item">
            {{ state.propsData?.selectedDetails?.max }}
          </div>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activityplace") }}：</span>
          <div class="disable_input_item">
            {{ state.propsData?.selectedDetails?.nameMerge }}
          </div>
        </div>
        <div class="info_item_description">
          <span class="label_description"
            >{{ $t("Activity_Introduction") }}：</span
          >
          <div class="value-wrapper">
            <a-textarea
              style="width: 100%"
              v-model:value="state.propsData.selectedDetails.content"
              :allowClear="true"
              :show-count="true"
              :maxlength="200"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </div>
        </div>
        <div class="bottom-upload-box">
          <div class="bottom-upload-item">
            <div class="bottom-upload-item-title">
              <span style="color: #ff4d4f">*</span
              >{{ $t("V4_approval_attachments") }}:
            </div>
            <Uploader
              :initFileList="state.approve"
              filePath="activity"
              :showUploadList="true"
              :maxCount="1"
              @onFileUpload="(v) => fileUpload(v, 'approve')"
              accept="application/pdf,application/msword"
              list-type="picture"
            >
              <div class="bottom-upload-item-img">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                Word/PDF
              </div>
            </Uploader>
          </div>
          <div class="bottom-upload-item">
            <div class="bottom-upload-item-title">
              <span style="color: #ff4d4f">*</span>{{ $t("V4_event_plan") }}:
            </div>
            <Uploader
              :initFileList="state.plan"
              filePath="activity"
              :showUploadList="true"
              :maxCount="1"
              @onFileUpload="(v) => fileUpload(v, 'plan')"
              accept="application/pdf,application/msword"
              list-type="picture"
            >
              <div class="bottom-upload-item-img">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                Word/PDF
              </div>
            </Uploader>
          </div>
          <div class="bottom-upload-item">
            <div class="bottom-upload-item-title">其他申请材料:</div>
            <Uploader
              :initFileList="state.materials"
              filePath="activity"
              :showUploadList="true"
              :maxCount="1"
              @onFileUpload="(v) => fileUpload(v, 'materials')"
              accept="application/pdf,application/msword"
              list-type="picture"
            >
              <div class="bottom-upload-item-img">
                <img
                  src="@/assets/activity_application/upload_file.svg"
                  alt=""
                />
                Word/PDF
              </div>
            </Uploader>
          </div>
        </div>
      </div>

      <a-divider />
      <div class="bottom_btn_box">
        <a-button class="cancel_btn">取消申请</a-button>
        <a-button class="submit_btn" type="primary" @click="onSubmit"
          >提交修改</a-button
        >
      </div>
    </div>

    <!-- 报名记录 详情 -->
    <div v-if="state.propsData?.activeKey === '2'">
      <div class="content-details">
        <div class="info-item status">
          <span class="label">{{ $t("activity_status") }}：</span>
          <span :class="statusClass">{{
            state.propsData?.selectedDetails?.status_name
          }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activityname") }}：</span>
          <span class="value">{{
            state.propsData?.selectedDetails?.title
          }}</span>
        </div>
        <div class="schedule-row">
          <span class="label">{{ $t("activity_Date") }}：</span>
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
                {{ item.isAppointment ? $t("已预约") : "未预约" }}
              </div>
              {{ item.date }}
            </div>
          </div>
        </div>
        <div class="schedule-row">
          <span class="label">{{ $t("user_activitytime") }}：</span>
          <div class="time-options">
            <div
              v-for="(item, index) in state.propsData?.selectedTimeList"
              :key="item.id"
              :class="['time-option', { selected: item.is_subscribe === 1 }]"
            >
              {{ item.start_time }} ~ {{ item.end_time }}
              <div class="leftBadge basicsBadge">
                {{ item.is_subscribe === 1 ? $t("已预约") : "未预约" }}
              </div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("Enrollment_quantity") }}：</span>
          <span class="value">{{ state.propsData?.selectedDetails?.max }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t("user_activityplace") }}：</span>
          <span class="value">{{
            state.propsData?.selectedDetails?.nameMerge
          }}</span>
        </div>
        <div class="info_item_description">
          <span class="label_description"
            >{{ $t("Activity_Introduction") }}：</span
          >
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
            @click="state.propsData.isShowTextArea = true"
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
        <div v-if="state.propsData.selectedDetails.status_name === '报名成功'">
          <a-button
            type="primary"
            shape="round"
            size="large"
            @click="onHideDrawer"
            >{{ $t("Cancel_Enrollment") }}</a-button
          >
        </div>
      </div>
    </div>

    <van-popup v-model:show="state.onShare" round class="share-popup">
      <MyActivityRecordShare
        :data="state.propsData.selectedDetails"
        @onClose="state.onShare = false"
      />
    </van-popup>
  </div>
</template>
<style scoped lang="less">
.drawer-content {
  padding: 10px 15px;
}
.content-top {
  display: flex;
  position: relative;
  width: 100%;

  .carousel-box {
    width: 100%;
    max-width: 400px;
    .image {
      width: 400px;
      height: 225px;
    }
  }
  .uploadFile-box {
    color: #000;
    margin-left: 20px;
    overflow-y: auto;
    .uploadFile-item {
      margin-bottom: 20px;
    }
  }
}
.controls {
  position: absolute;
  width: 263px;
  top: 180px;
  left: 136px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .toggleLang {
    width: 130px;
    height: 35px;
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
  padding-bottom: 50px;
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
    align-items: center;
    display: flex;
    margin-top: 15px;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .label {
    flex-shrink: 0;
    width: 100px;
    font-weight: bold;
    color: rgba(97, 97, 97, 1);
  }

  .disable_input_item {
    border: 1px solid rgba(4, 4, 21, 0.1);
    border-radius: 10px;
    width: 100%;
    padding: 10px;
    background-color: rgba(4, 4, 21, 0.04);
    color: rgba(32, 32, 32, 0.6);
  }

  .info_item_description {
    display: flex;
    margin-bottom: 15px;
  }

  .label_description {
    flex-shrink: 0;
    font-weight: bold;
    color: rgba(97, 97, 97, 1);

    width: 100px; /* 调整标签的宽度 */
  }

  .bottom-upload-box {
    display: flex;
    gap: 110px;
    .bottom-upload-item {
      margin-top: 20px;
      .bottom-upload-item-title {
        color: rgba(32, 32, 32, 1);
        font-size: 14px;
      }
      .bottom-upload-item-img {
        cursor: pointer;
        margin-top: 12px;
        color: rgba(134, 134, 134, 1);
        font-size: 12px;
      }
    }
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
    margin-top: 15px;
    justify-content: space-between;
    margin-bottom: 25px;
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

.bottom_btn_box {
  display: flex;
  justify-content: center;
  gap: 20px;
  .cancel_btn {
    width: 160px;
    background-color: rgba(243, 244, 247, 1);
    color: rgba(140, 143, 158, 1);
    font-size: 14px;
  }
  .submit_btn {
    width: 160px;
    font-size: 14px;
  }
}
.share-popup {
  background: transparent !important;
  width: 316px;
}
</style>
