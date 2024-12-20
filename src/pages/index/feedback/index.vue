<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import {
  getMyFeedback,
  getFeedbackCategory,
  getFeedbackIlk,
  postFeedback,
  getFeedbackDetail,
  postFeedbackForRepair,
} from "@/request/feedback";

import PageSizeCom from "@/components/PageSizeCom.vue";
import FeedbackDetails from "@/components/Feedback/FeedbackDetails.vue";
import FeedbackSubmit from "@/components/Feedback/FeedbackSubmit.vue";

const store = useStore();

const state = reactive({
  data: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  isShowDrawer: false,
  isShowSubmitDrawer: false,

  detailDrawerInfo: {
    record: {},
    detail: {},
  },

  // categoryList: [],

  submitInfo: {
    submitType: "",
    categoryList: [],
    categoryAreaList: [],
    categoryAreaId: "",
    categoryTypeList: [],
    categoryTypeId: "",
    categoryInputContent: "",
    fileList: [],
    phone: "",
    email: "",

    ilkList: [],
    ilkTypeList: [],
    ilkTypeId: "",
    ilkAddressList: [],

    concatenatedNames: "",
    ilkSeat: "",
    ilkIsStop: 0,
    ilkMobile: "",
    ilkContent: "",
  },

  isShowIlkAreaDrawer: false,

  defaultPic:
    "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
});

onMounted(() => {
  fetch();
  fetchCategory();
  fetchIlk();
});

const columns = [
  {
    title: "反馈内容",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "提交时间",
    dataIndex: "create_time",
    key: "create_time",
  },
  {
    title: "操作",
    key: "action",
  },
];

const pagination = computed(() => ({
  total: state.total,
  current: state.currentPage,
  showSizeChanger: false,
}));

const onChangePage = (pagination) => {
  // pagination : {current: 2, pageSize: 10, total: 132, showSizeChanger: false}
  let { current } = pagination;
  state.currentPage = current;
  fetch();
};

const onShowModal = (record) => {
  state.detailDrawerInfo.record = record;
  fetchGetFeedbackDetail();
};

const onShowSubmitModal = (type) => {
  state.submitInfo.submitType = type;
  state.isShowSubmitDrawer = true;
};

const onCloseSubmitDrawer = () => {
  state.isShowSubmitDrawer = false;
  state.submitInfo = {
    ...state.submitInfo,
    categoryAreaId: "",
    categoryTypeId: "",
    categoryInputContent: "",
    phone: "",
    email: "",

    ilkTypeId: "",
    ilkAreaID: "",
    concatenatedNames: "",
    ilkSeat: "",
    ilkIsStop: 0,
    ilkMobile: "",
    ilkContent: "",
    ilkTypeHaveRegion: false,
    ilkTypeIsSpace: false,

    fileList: [],
  };
};

const onSubmit = () => {
  if (state.submitInfo.submitType == "1") {
    // 意见反馈
    if (!state.submitInfo.categoryAreaId) {
      message.warning("请选择反馈区域");
      return false;
    }
    if (!state.submitInfo.categoryTypeId) {
      message.warning("请选择反馈类型");
      return false;
    }
    if (!state.submitInfo.categoryInputContent) {
      message.warning("请输入反馈内容");
      return false;
    }
    if (!state.submitInfo.fileList.length) {
      message.warning("请上传反馈图片");
      return false;
    }
    if (!state.submitInfo.phone) {
      message.warning("请输入手机号");
      return false;
    }
    if (!state.email) {
      message.warning("请输入邮箱");
      return false;
    }
    let params = {
      area_id: state.submitInfo.categoryAreaId,
      cate_id: state.submitInfo.categoryTypeId,
      content: state.submitInfo.categoryInputContent,
      pic_urls: state.submitInfo.fileList,
      mobile: state.submitInfo.phone,
      email: state.submitInfo.email,
    };
    fetchSubmit(params);
  } else {
    // 设备报修

    if (!state.submitInfo.ilkTypeId) {
      message.warning("请选择报修类型");
      return false;
    }

    if (state.submitInfo.ilkTypeHaveRegion) {
      // 此时必填区域
      if (!state.submitInfo.ilkAreaID) {
        message.warning("请选择报修区域");
        return false;
      }
      if (!state.submitInfo.ilkTypeIsSpace) {
        // 不是空间类型， 座位一栏显示
        // 此时必填座位 第一层 ilkTypeHaveRegion 的判断下 此时必填区域
        if (!state.submitInfo.ilkSeat) {
          message.warning("请选择报修座位");
          return false;
        }
      }
    }

    if (!state.submitInfo.ilkMobile) {
      message.warning("请输入联系电话");
      return false;
    }
    if (!state.submitInfo.ilkContent) {
      message.warning("请输入报修内容");
      return false;
    }
    if (!state.submitInfo.fileList.length) {
      message.warning("请上传反馈图片");
      return false;
    }
    let areaId = state.submitInfo.ilkTypeHaveRegion
      ? state.submitInfo.ilkAreaID
      : "0";
    let spaceId = state.submitInfo.ilkTypeHaveRegion
      ? state.submitInfo.ilkSeat
      : "0";
    let params = {
      type_id: state.submitInfo.ilkTypeId,
      content: state.submitInfo.ilkContent,
      pic_urls: state.submitInfo.fileList,
      mobile: state.submitInfo.ilkMobile,
      area_id: areaId,
      space_id: spaceId,
    };
    fetchSubmit(params);
  }
};

const fetch = async () => {
  try {
    let params = {
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getMyFeedback(params);
    if (res.code == 0) {
      state.data = res.data.data;
      state.total = res.data.total;
    }
  } catch (error) {
    state.data = [];
    state.total = 0;
    console.log(error);
  }
};

const fetchGetFeedbackDetail = async () => {
  try {
    let params = {
      type: state.detailDrawerInfo.record.type,
      id: state.detailDrawerInfo.record.id,
    };
    const res = await getFeedbackDetail(params);
    if (res.code == 0) {
      state.detailDrawerInfo.detail = res.data;
      state.isShowDrawer = true;
      console.log(state.detailDrawerInfo);
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const fetchCategory = async () => {
  try {
    const res = await getFeedbackCategory();
    if (res.code == 0) {
      state.submitInfo.categoryList = res.data;

      state.submitInfo.categoryList.forEach((item) => {
        let obj = {
          value: item.id,
          label: item.name,
        };
        state.submitInfo.categoryAreaList.push(obj);
      });
      console.log(state.submitInfo.categoryAreaList);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchIlk = async () => {
  try {
    const res = await getFeedbackIlk();
    if (res.code == 0) {
      state.submitInfo.ilkList = res.data;

      state.submitInfo.ilkList.forEach((item) => {
        let obj = {
          value: item.id,
          label: item.name,
        };
        state.submitInfo.ilkTypeList.push(obj);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchSubmit = async (params) => {
  try {
    if (state.submitInfo.submitType == "1") {
      const res = await postFeedback(params);
      if (res.code == 0) {
        message.success(res.message);
        state.isShowSubmitDrawer = false;
        fetch();
      }
    } else {
      const res = await postFeedbackForRepair(params);
      if (res.code == 0) {
        message.success(res.message);
        state.isShowSubmitDrawer = false;
        fetch();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="feebback">
    <p class="title">反馈与报修</p>

    <div class="cardCon">
      <div class="cardItem clickBox" @click="onShowSubmitModal('1')">
        <img src="@/assets/feedback/opinion.svg" alt="" />
        <span>意见反馈</span>
        <img src="@/assets/feedback/rightIcon.svg" alt="" />
      </div>
      <div class="cardItem clickBox" @click="onShowSubmitModal('2')">
        <img src="@/assets/feedback/equipment.svg" alt="" />
        <span>设备报修</span>
        <img src="@/assets/feedback/rightIcon.svg" alt="" />
      </div>
    </div>
    <div class="bottom_content" v-if="state.data?.length > 0">
      <PageSizeCom>
        <a-table
          :columns="columns"
          :data-source="state.data"
          :pagination="false"
          sticky
          scrollToFirstRowOnChange
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'content'">
              <div>
                <span v-if="record.is_read == '0'" class="required"></span
                >{{ record.content }}
              </div>
            </template>

            <template v-if="column.key === 'type'">
              <span>
                <a-tag
                  class="custom-tag"
                  :color="record.type === '1' ? 'processing' : 'warning'"
                >
                  {{ record.type === "1" ? "意见反馈" : "设备报修" }}
                </a-tag>
              </span>
            </template>

            <template v-if="column.key === 'create_time'">
              <span>{{ record.create_time }}</span>
            </template>

            <template v-if="column.key === 'action'">
              <span>
                <a type="primary" @click="onShowModal(record)">查看</a>
              </span>
            </template>
          </template>
        </a-table>
      </PageSizeCom>
    </div>
    <a-empty v-else style="margin-top: 40px" />
    <div class="cPagination" v-if="state.data?.length > 0">
      <a-pagination
        v-model:current="state.currentPage"
        :total="state.total"
        @change="onChangePage"
        :default-page-size="10"
        show-less-items
      />
    </div>
    <!-- 详情页面 -->
    <a-drawer
      :open="state.isShowDrawer"
      @close="state.isShowDrawer = false"
      :closable="false"
      :footer="null"
      width="600px"
      destroyOnClose
    >
      <div class="drawer_title">
        <div class="title_text">
          <div class="indicator_title"></div>
          <div>反馈详情</div>
        </div>
        <div>
          <img
            src="@/assets/close.svg"
            class="clickBox"
            @click="state.isShowDrawer = false"
            alt=""
          />
        </div>
      </div>
      <a-divider />
      <FeedbackDetails :data="state.detailDrawerInfo" />
      <template #extra>
        <img
          src="@/assets/close.svg"
          class="clickBox"
          @click="state.isShowDrawer = false"
          alt=""
        />
      </template>
    </a-drawer>

    <!-- 提交反馈/设备报修 抽屉弹窗 -->
    <a-drawer
      :open="state.isShowSubmitDrawer"
      @close="onCloseSubmitDrawer"
      :closable="false"
      :footer="null"
      width="600px"
      destroyOnClose
    >
      <div class="drawer_title">
        <div class="title_text">
          <div class="indicator_title"></div>
          <div>
            {{ state.submitInfo.submitType == "1" ? "意见反馈" : "设备报修" }}
          </div>
        </div>
        <div>
          <a-button class="cancel_btn" @click="state.isShowSubmitDrawer = false"
            >取消</a-button
          >
          <a-button class="submit_btn" type="primary" @click="onSubmit"
            >确认</a-button
          >
        </div>
      </div>

      <a-divider />
      <FeedbackSubmit :data="state.submitInfo" />
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
.feebback {
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .title {
    font-size: 20px;
    color: #202020;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 4px;
      left: 0;
      width: 110px;
      height: 6px;
      background: linear-gradient(
        90deg,
        rgba(26, 73, 192, 0.5) 0%,
        rgba(26, 73, 192, 0) 100%
      );
      border-radius: 2px 2px 2px 2px;
    }
  }
  .cardCon {
    margin-top: 30px;
    display: flex;
    align-items: center;
    .cardItem {
      padding: 20px 50px;
      flex: 1;
      height: 160px;
      background: #f8f9fd;
      border-radius: 10px;
      border: none;

      display: flex;
      align-items: center;
      span {
        margin-left: 50px;
        flex: 1;
        font-size: 30px;
        transform: skewX(-6deg);
        // font-family: AliHeavy !important;
        font-weight: bold;
        color: var(--primary-color);
      }
      &:last-child {
        margin-left: 40px;
      }
    }
  }
  .bottom_content {
    margin-top: 30px;
    flex: 1;
    overflow: auto;
    .required {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: red;
      display: inline-block;
      margin-right: 5px;
    }
    .custom-tag {
      border-radius: 12px;
    }
  }
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
}
.drawer_title {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title_text {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: rgba(32, 32, 32, 1);
  }
  .indicator_title {
    margin-left: 10px;
    width: 4px;
    height: 16px;
    background-color: rgba(26, 73, 192, 1);
    margin-right: 8px;
    border-radius: 10px;
  }
  .cancel_btn {
    width: 80px;
    margin-right: 10px;
    background-color: rgba(243, 244, 247, 1);
    color: rgba(140, 143, 158, 1);
    font-size: 14px;
  }
  .submit_btn {
    width: 80px;
    font-size: 14px;
    margin-right: 10px;
  }
}

.ant-divider-horizontal {
  margin: 15px 0;
}
</style>
