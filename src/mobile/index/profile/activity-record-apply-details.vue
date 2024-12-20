<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'V4_event_details',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import { getActivityDetail, saveComments } from "@/request/activity-record";
import MyActivityRecordShare from "@/components/MyActivityRecordShare.vue";

import Uploader from "@/components/Uploader.vue";
import PDFICON from "@/assets/common/pdfIcon.png";
import DOCICON from "@/assets/common/docIcon.png";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route?.query?.id || "",
  status: "预约成功",
  quickMode: 1,

  isEdit: false,

  poster: [],
  approve: [],
  publicize: [],
  plan: [],
  materials: [],

  selectedDetails: {},
  selectedDate: "",
  selectedTimeList: [],
  appointmentTime: "",

  // 介绍弹窗
  onShowTextAreaForDescription: false,
  // 名称弹窗
  onShowTextAreaForName: false,
  description: "",
  onShare: false,
});

onMounted(() => {
  fetch();
});

const fetch = async () => {
  try {
    let params = {
      ilk: "1",
      id: state.id,
    };
    const res = await getActivityDetail(params);
    if (res?.code === 0) {
      state.selectedDetails = res?.data;

      // 海报
      if (state.selectedDetails?.poster) {
        state.poster = state.selectedDetails?.poster;
      }
      // 审批附件
      if (state.selectedDetails?.approve) {
        state.approve = state.selectedDetails?.approve;
      }
      // 活动策划案
      if (state.selectedDetails?.publicize) {
        state.publicize = state.selectedDetails?.publicize;
      }
      // 宣传片
      if (state.selectedDetails?.plan) {
        state.plan = state.selectedDetails?.plan;
      }
      // 其他活动材料
      if (state.selectedDetails?.materials) {
        state.materials = state.selectedDetails?.materials;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const onChangeQMode = (value) => {
  state.quickMode = value;
};

const onSelectDate = (item) => {
  state.selectedDate = item.date;
  state.selectedTimeList = item.time;
};

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
</script>
<template>
  <div class="activity-record-details">
    <div class="content height_calc">
      <div class="top_swipe">
        <van-swipe :autoplay="3000" v-if="state.selectedDetails?.poster">
          <van-swipe-item
            v-for="item in state.selectedDetails?.poster"
            :key="item?.file_path"
          >
            <van-image
              radius="10"
              :src="item?.file_path"
              alt="Empty state illustration"
            />
          </van-swipe-item>

          <template #indicator="{ active, total }">
            <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
          </template>
        </van-swipe>

        <div class="controls_mode">
          <div
            class="toggleLang"
            :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
          >
            <div
              class="langItem activeBtn"
              :class="{ langActive: state.quickMode == 1 }"
              @click="onChangeQMode(1)"
            >
              图片
            </div>
            <div
              class="langItem activeBtn"
              :class="{ langActive: state.quickMode == 2 }"
              @click="onChangeQMode(2)"
            >
              视频
            </div>
          </div>
        </div>

        <div class="controls_share">
          <div class="share-btn">
            <img
              src="@/assets/rectangle_transaction.svg"
              alt=""
              class="background-image"
            />
            <span class="share-text" @click="state.onShare = true">分享</span>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="item_left">活动状态</div>
        <div class="item_right">{{ state.selectedDetails?.status_name }}</div>
      </div>
      <a-divider />
      <div class="item_can_edit">
        <div class="item_can_edit_top">
          <div>活动名称</div>
          <div class="item_can_edit_right">
            <div class="item_right">{{ state.selectedDetails?.title }}</div>
            <div
              v-if="state.isEdit"
              @click="state.onShowTextAreaForName = true"
            >
              <img src="@/assets/my/activity-record/comments_edit.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">活动日期</div>
        <div class="item_right">
          {{ state.selectedDetails?.begin_date }} ~
          {{ state.selectedDetails?.end_date }}
        </div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">活动时间</div>
        <div class="item_right">
          {{ state.selectedDetails?.begin_time }} ~
          {{ state.selectedDetails?.end_time }}
        </div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">可报名人数</div>
        <div class="item_right">{{ state.selectedDetails?.max }}</div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">活动地点</div>
        <div class="item_right">{{ state.selectedDetails?.nameMerge }}</div>
      </div>
      <a-divider />
      <div class="item_can_edit">
        <div class="item_can_edit_top">
          <div class="item_comments_left">活动介绍</div>
          <div
            v-if="state.isEdit"
            class="item_can_edit_right"
            @click="state.onShowTextAreaForDescription = true"
          >
            <img src="@/assets/my/activity-record/comments_edit.svg" alt="" />
          </div>
        </div>
        <div class="item_can_edit_bottom">
          {{ state.selectedDetails?.content }}
        </div>
      </div>
      <a-divider />
      <!-- 不可编辑 文件列表 -->
      <div v-if="!state.isEdit">
        <div class="item_for_file" v-if="state.selectedDetails?.approve">
          <div class="item_for_file_title">审批附件</div>
          <div class="item_for_file_content">
            <van-image
              style="width: 45px; height: 45px"
              :src="getFileIcon(state.selectedDetails?.approve[0]?.file_ext)"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.selectedDetails?.approve[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.selectedDetails?.approve[0]?.file_size }}
              </div>
            </div>
          </div>
        </div>
        <a-divider />
        <div class="item_for_file" v-if="state.selectedDetails?.plan">
          <div class="item_for_file_title">活动策划案</div>
          <div class="item_for_file_content">
            <van-image
              style="width: 45px; height: 45px"
              :src="getFileIcon(state.selectedDetails?.plan[0]?.file_ext)"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.selectedDetails?.plan[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.selectedDetails?.plan[0]?.file_size }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-divider />
      <!-- 可编辑 文件列表 -->
      <div v-if="state.isEdit">
        <!-- 活动海报 -->
        <div class="item_for_file">
          <div class="item_for_file_title">
            <div><span style="color: red">*</span>活动海报</div>
            <Uploader
              :initFileList="state.poster"
              filePath="activity"
              :maxCount="1"
              :showUploadList="false"
              @onFileUpload="(v) => fileUpload(v, 'poster')"
              accept=".png, .jpg, .jpeg"
              list-type="picture"
            >
              <div class="item_for_file_title_right_upload">+图片</div>
            </Uploader>
          </div>
          <div class="item_for_file_content" v-if="state.poster.length > 0">
            <van-image
              style="width: 45px; height: 45px"
              :src="state.poster[0]?.file_path"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.poster[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.poster[0]?.file_size }}
              </div>
            </div>
            <img
              style="width: 20px; height: 20px"
              src="@/assets/my/mobile_event_details_remove.svg"
              alt="Empty state illustration"
            />
          </div>
        </div>
        <a-divider />
        <!-- 审批附件 -->
        <div class="item_for_file">
          <div class="item_for_file_title">
            <div><span style="color: red">*</span>审批附件</div>
            <Uploader
              :initFileList="state.approve"
              filePath="activity"
              :maxCount="1"
              :showUploadList="false"
              @onFileUpload="(v) => fileUpload(v, 'approve')"
              accept="application/pdf,application/msword"
              list-type="picture"
            >
              <div class="item_for_file_title_right_upload">+Word/PDF</div>
            </Uploader>
          </div>
          <div class="item_for_file_content" v-if="state.approve.length > 0">
            <van-image
              style="width: 45px; height: 45px"
              :src="getFileIcon(state.approve[0]?.file_ext)"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.approve[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.approve[0]?.file_size }}
              </div>
            </div>
            <img
              style="width: 20px; height: 20px"
              src="@/assets/my/mobile_event_details_remove.svg"
              alt="Empty state illustration"
            />
          </div>
        </div>
        <a-divider />
        <!-- 宣传片 -->
        <div class="item_for_file">
          <div class="item_for_file_title">
            <div>宣传片</div>
            <Uploader
              :initFileList="state.plan"
              filePath="activity"
              :maxCount="1"
              :showUploadList="false"
              @onFileUpload="(v) => fileUpload(v, 'plan')"
              accept=".mp4,.mov"
              list-type="picture"
            >
              <div class="item_for_file_title_right_upload">+视频</div>
            </Uploader>
          </div>
          <div class="item_for_file_content" v-if="state.plan.length > 0">
            <van-image
              style="width: 45px; height: 45px"
              :src="state.plan[0]?.file_path"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.approve[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.approve[0]?.file_size }}
              </div>
            </div>
            <img
              style="width: 20px; height: 20px"
              src="@/assets/my/mobile_event_details_remove.svg"
              alt="Empty state illustration"
            />
          </div>
        </div>
        <a-divider />
        <!-- 活动策划案 -->
        <div class="item_for_file">
          <div class="item_for_file_title">
            <div><span style="color: red">*</span>活动策划案</div>
            <Uploader
              :initFileList="state.plan"
              filePath="activity"
              :maxCount="1"
              :showUploadList="false"
              @onFileUpload="(v) => fileUpload(v, 'plan')"
              accept="application/pdf,application/msword"
              list-type="picture"
            >
              <div class="item_for_file_title_right_upload">+Word/PDF</div>
            </Uploader>
          </div>
          <div class="item_for_file_content" v-if="state.plan.length > 0">
            <van-image
              style="width: 45px; height: 45px"
              :src="getFileIcon(state.plan[0]?.file_ext)"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.plan[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.plan[0]?.file_size }}
              </div>
            </div>
            <img
              style="width: 20px; height: 20px"
              src="@/assets/my/mobile_event_details_remove.svg"
              alt="Empty state illustration"
            />
          </div>
        </div>
        <a-divider />
        <!-- 其他申请材料 -->
        <div class="item_for_file">
          <div class="item_for_file_title">
            <div>其他申请材料</div>
            <Uploader
              :initFileList="state.materials"
              filePath="activity"
              :maxCount="1"
              :showUploadList="false"
              @onFileUpload="(v) => fileUpload(v, 'materials')"
              accept="application/pdf,application/msword"
              list-type="picture"
            >
              <div class="item_for_file_title_right_upload">+Word/PDF</div>
            </Uploader>
          </div>
          <div class="item_for_file_content" v-if="state.materials.length > 0">
            <van-image
              style="width: 45px; height: 45px"
              :src="getFileIcon(state.materials[0]?.file_ext)"
              alt="Empty state illustration"
            />
            <div class="item_for_file_item">
              <div class="item_for_file_item_left">
                {{ state.materials[0]?.file_name }}
              </div>
              <div class="item_for_file_item_right">
                {{ state.materials[0]?.file_size }}
              </div>
            </div>
            <img
              style="width: 20px; height: 20px"
              src="@/assets/my/mobile_event_details_remove.svg"
              alt="Empty state illustration"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="bottom_info_btn">
      <a-button shape="round" block class="cancel_btn">取消报名</a-button>
    </div> -->
    <div
      class="bottomAct"
      v-if="state.selectedDetails?.status_name == '等待审核' && !state.isEdit"
    >
      <van-button round block type="default">取消申请</van-button>
      <van-button round block type="primary" @click="state.isEdit = true"
        >重新编辑</van-button
      >
    </div>
    <div class="bottomAct" v-if="state.isEdit">
      <van-button round block type="default" @click="state.isEdit = false"
        >取消</van-button
      >
      <van-button round block type="primary" @click="submitEdit"
        >提交修改</van-button
      >
    </div>

    <van-dialog
      v-model:show="state.onShowTextAreaForName"
      title="活动名称"
      message-align="center"
      show-cancel-button
    >
      <a-textarea
        style="width: 83%; margin: 20px 30px"
        v-model:value="state.selectedDetails.title"
        :allowClear="true"
        :placeholder="`请输入活动名称`"
        :autosize="{ minRows: 1, maxRows: 1 }"
      />
    </van-dialog>
    <van-dialog
      v-model:show="state.onShowTextAreaForDescription"
      title="活动介绍"
      message-align="center"
      show-cancel-button
    >
      <a-textarea
        style="width: 83%; margin: 20px 30px"
        v-model:value="state.selectedDetails.content"
        :allowClear="true"
        :placeholder="`请输入本次活动的介绍`"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </van-dialog>
    <van-popup v-model:show="state.onShare" round class="share-popup">
      <MyActivityRecordShare
        :data="state.selectedDetails"
        @onClose="state.onShare = false"
      />
      
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.activity-record-details {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .height_calc {
    height: calc(100% - 50px);
  }
  .content {
    overflow-y: auto;
    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none; /* 隐藏滚动条 */
    }

    scrollbar-width: none; /* Firefox 隐藏滚动条 */
    -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */

    margin-bottom: 10px;

    .top_swipe {
      position: relative;
      background-color: #fff;
      padding: 10px;

      .custom-indicator {
        position: absolute;
        left: 5px;
        bottom: 5px;
        padding: 2px 5px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.1);
      }

      .controls_mode {
        position: absolute;
        width: 40%;
        bottom: 10px;
        left: 30%;
        display: flex;
        align-items: center;
        .toggleLang {
          width: 140px;
          height: 35px;
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
      }
      .controls_share {
        position: absolute;
        width: 20%;
        bottom: 10px;
        right: 8px;
        display: flex;
        align-items: center;
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
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      padding: 10px;

      .item_left {
        color: rgba(97, 97, 97, 1);
        font-size: 14px;
      }
      .item_right {
        color: rgba(32, 32, 32, 1);
        font-size: 14px;
      }
    }

    .item_can_edit {
      display: flex;
      padding: 10px;
      background-color: #fff;
      flex-direction: column;

      .item_can_edit_bottom {
        color: rgba(32, 32, 32, 1);
        margin-top: 10px;
        font-size: 14px;
      }
      .item_can_edit_top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        color: rgba(97, 97, 97, 1);
        font-size: 14px;
        .item_can_edit_right {
          display: flex;
          align-items: center;
          .item_right {
            color: rgba(32, 32, 32, 1);
            font-size: 14px;
          }
        }
      }
    }
    .item_for_file {
      background-color: #fff;
      padding: 10px;
      .item_for_file_title {
        display: flex;
        justify-content: space-between;
        color: rgba(97, 97, 97, 1);
        font-size: 14px;
        .item_for_file_title_right_upload {
          border-radius: 22px;
          border: 1px solid rgba(223, 223, 223, 1);
          padding: 2px 10px;
          color: rgba(134, 134, 134, 1);
        }
      }
      .item_for_file_content {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        .item_for_file_item {
          flex: 1;
          margin-left: 10px;
          color: rgba(97, 97, 97, 1);
          font-size: 12px;
        }
      }
    }
  }

  .bottom_info_btn {
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
  .bottomAct {
    background-color: #fff;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
  }
  .share-popup {
    background: transparent !important;
    padding: 10px;
    width: 100%;
    .share-popup-container {
      border-radius: 10px;
      background-color: #fff;
      .share-popup-content {
        padding: 16px;
        .share-popup-title {
          font-size: 16px;
          color: rgba(32, 32, 32, 1);
        }
        .share-popup-item {
          margin-top: 20px;
          font-size: 14px;
          color: rgba(32, 32, 32, 1);
        }
        .share-popup-item_value {
          font-size: 14px;
          color: rgba(97, 97, 97, 1);
        }
      }
      .share-popup-scan {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: end;
        background-color: rgba(0, 0, 0, 0.03);
        .share-popup-scan-text {
          font-size: 14px;
          color: rgba(97, 97, 97, 1);
        }
        .share-popup-scan-image {
          width: 80px;
          height: 80px;
        }
      }
    }
    .share-popup-footer {
      margin-top: 15px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      background-color: #fff;
      border-radius: 12px; /* 圆角效果 */

      .footer-button {
        background: none;
        border: none;
        color: rgba(97, 97, 97, 1); /* 按钮文字颜色 */
        padding: 10px 20px;
        cursor: pointer;
        font-size: 14px;
      }
      .share-button {
        color: rgba(31, 86, 225, 1);
        font-size: 14px;
        width: 30%;
      }

      .divider {
        width: 1px; /* 分隔线宽度 */
        height: 30px; /* 分隔线高度 */
        background-color: #e0e0e0; /* 分隔线颜色 */
      }
    }
    .share-popup-close {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
:deep(.ant-divider-horizontal) {
  margin: 0 !important;
}
</style>
