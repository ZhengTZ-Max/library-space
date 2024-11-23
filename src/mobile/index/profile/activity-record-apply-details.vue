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

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  id: route?.query?.id || "",
  status: "预约成功",
  quickMode: 1,

  selectedDetails: {
    time: [
      {
        date: "2024-10-26",
        time: [
          {
            id: "1123",
            start_time: "08:00",
            end_time: "12:00",
            is_subscribe: 0,
            teams_count: 0,
          },
        ],
      },
      {
        date: "2024-10-27",
        time: [
          {
            id: "1124",
            start_time: "08:00",
            end_time: "12:00",
            is_subscribe: 0,
            teams_count: 0,
          },
        ],
      },
      {
        date: "2024-10-28",
        time: [
          {
            id: "1125",
            start_time: "08:00",
            end_time: "12:00",
            is_subscribe: 0,
            teams_count: 0,
          },
        ],
      },
      {
        date: "2024-10-29",
        time: [
          {
            id: "1126",
            start_time: "08:00",
            end_time: "12:00",
            is_subscribe: 0,
            teams_count: 0,
          },
        ],
      },
      {
        date: "2024-10-30",
        time: [
          {
            id: "1127",
            start_time: "08:00",
            end_time: "12:00",
            is_subscribe: 0,
            teams_count: 0,
          },
        ],
      },
      {
        date: "2024-10-31",
        time: [
          {
            id: "1128",
            start_time: "08:00",
            end_time: "12:00",
            is_subscribe: 1,
            teams_count: 1,
          },
        ],
      },
    ],
  },
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

const onChangeQMode = (value) => {
  state.quickMode = value;
};

const onSelectDate = (item) => {
  state.selectedDate = item.date;
  state.selectedTimeList = item.time;
};
</script>
<template>
  <div class="activity-record-details">
    <div class="content height_calc">
      <div class="top_swipe">
        <van-swipe>
          <van-swipe-item
            ><van-image
              radius="10"
              src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
              alt="Empty state illustration"
          /></van-swipe-item>
          <van-swipe-item
            ><van-image
              radius="10"
              src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
              alt="Empty state illustration"
          /></van-swipe-item>
          <van-swipe-item
            ><van-image
              radius="10"
              src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
              alt="Empty state illustration"
          /></van-swipe-item>

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
        <div class="item_right">{{ state.status }}</div>
      </div>
      <a-divider />
      <div class="item_can_edit">
        <div class="item_can_edit_top">
          <div>活动名称</div>
          <div class="item_can_edit_right">
            <div class="item_right">活动名称</div>
            <div v-if="false" @click="state.onShowTextAreaForName = true">
              <img src="@/assets/my/activity-record/comments_edit.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">活动日期</div>
        <div class="item_right">{{ state.status }}</div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">活动时间</div>
        <div class="item_right">{{ state.status }}</div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">可报名人数</div>
        <div class="item_right">{{ state.status }}</div>
      </div>
      <a-divider />
      <div class="item">
        <div class="item_left">活动地点</div>
        <div class="item_right">{{ state.status }}</div>
      </div>
      <a-divider />
      <div class="item_can_edit">
        <div class="item_can_edit_top">
          <div class="item_comments_left">活动介绍</div>
          <div
            v-if="false"
            class="item_can_edit_right"
            @click="state.onShowTextAreaForDescription = true"
          >
            <img src="@/assets/my/activity-record/comments_edit.svg" alt="" />
          </div>
        </div>
        <div class="item_can_edit_bottom">
          活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍活动介绍
        </div>
      </div>
      <a-divider />
      <!-- 不可编辑 文件列表 -->
      <div class="item_for_file">
        <div class="item_for_file_title">活动文件</div>
        <div class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">文件名称xxx</div>
            <div class="item_for_file_item_right">10.85KB</div>
          </div>
        </div>
      </div>
      <a-divider />
      <!-- 可编辑 文件列表 -->
      <div class="item_for_file">
        <div class="item_for_file_title">
          <div><span style="color: red">*</span>审批文件</div>
          <div class="item_for_file_title_right_upload">+图片</div>
        </div>
        <div class="item_for_file_content">
          <van-image
            style="width: 45px; height: 45px"
            src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
            alt="Empty state illustration"
          />
          <div class="item_for_file_item">
            <div class="item_for_file_item_left">文件名称xxx</div>
            <div class="item_for_file_item_right">10.85KB</div>
          </div>
          <img
            style="width: 20px; height: 20px"
            src="@/assets/my/mobile_event_details_remove.svg"
            alt="Empty state illustration"
          />
        </div>
      </div>
    </div>

    <!-- <div class="bottom_info_btn">
      <a-button shape="round" block class="cancel_btn">取消报名</a-button>
    </div> -->
    <div class="bottomAct">
      <van-button round block type="default">取消申请</van-button>
      <van-button round block type="primary" @click="handleFilter"
        >重新编辑</van-button
      >
    </div>
    <!-- <div class="bottomAct">
      <van-button round block type="default">取消</van-button>
      <van-button round block type="primary" @click="handleFilter"
        >提交修改</van-button
      >
    </div> -->
    <van-dialog
      v-model:show="state.onShowTextAreaForName"
      title="活动名称"
      message-align="center"
      show-cancel-button
    >
      <a-textarea
        style="width: 83%; margin: 20px 30px"
        v-model:value="state.description"
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
        v-model:value="state.description"
        :allowClear="true"
        :placeholder="`请输入本次活动的介绍`"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </van-dialog>
    <van-popup v-model:show="state.onShare" round class="share-popup">
      <div class="share-popup-container">
        <div class="share-popup-content">
          <van-image
            src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
            alt="Empty state illustration"
          />
          <div class="share-popup-title">XXX学院-XXX活动</div>
          <div class="share-popup-item">活动地点</div>
          <div class="share-popup-item_value">xxxxxxxxxxxx</div>
          <div class="share-popup-item">活动时间</div>
          <div class="share-popup-item_value">
            2024-10-26 08:00 ~ 2024-10-26 12:00
          </div>
        </div>
        <div class="share-popup-scan">
          <div class="share-popup-scan-text">扫码查看活动详情>></div>
          <van-image
            class="share-popup-scan-image"
            src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
            alt="Empty state illustration"
          />
        </div>
      </div>
      <div class="share-popup-footer">
        <button class="footer-button" @click="goToLink('/mo/...')">
          保存图片
        </button>
        <div class="divider"></div>
        <a-button
          type="text"
          class="share-button"
          plain
          @click="state.onShare = false"
        >
          <img
            src="@/assets/my/mobile_event_details_share.svg"
            style="margin-right: 5px"
            alt=""
          />
          分享
        </a-button>
      </div>
      <div class="share-popup-close">
        <img
          src="@/assets/my/mobile_event_details_close.svg"
          @click="state.onShare = false"
          alt=""
        />
      </div>
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
          height: 28px;
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
