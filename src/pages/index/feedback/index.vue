<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import {
  getMyFeedback,
  getFeedbackCategory,
  getFeedbackIlk,
  postFeedback,
  getIlkAddress,
  getFeedbackDetail,
} from "@/request/feedback";
import Uploader from "@/components/Uploader.vue";
import FeedbackFilter from "@/components/FeedbackFilter.vue";
const store = useStore();

const state = reactive({
  data: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  isShowDrawer: false,
  isShowSubmitDrawer: false,
  submitType: "",
  record: {},
  detail: {},

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

  filterSource: {
    ilkAreaList: [],
    ilkFloorList: [],
    ilkSpaceList: [],
  },
  filterSearch: {
    ilkAreaID: "",
    ilkFloorID: "",
    ilkSpaceID: "",
  },
  isShowIlkAreaDrawer: false,
  concatenatedNames: "",
  ilkSeat: "",
  ilkIsStop: 0,
  ilkMobile: "",
  ilkContent: "",

  defaultPic:
    "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
});

onMounted(() => {
  fetch();
  fetchCategory();
  fetchIlk();
});



const getDefaultList = () => {
  return [
    {
      id: "1", //意见反馈id
      content: "这是意见反馈内容", //反馈内容
      type: "1", //区分是意见反馈还是设备报修。1意见反馈2设备报修
      cate_id: "1", //意见反馈类型
      pic_urls: null, //反馈图片,json格式
      create_time: "2024-03-07 09:28:28", //反馈时间
      is_read: "0", //是否已读，1已读0未读
      ROW_NUMBER: "1", //意见反馈类型名称
      cate_name: "意见", //英文意见反馈类型名称
      en_cate_name: "opinion",
    },
    {
      id: "2", //意见反馈id
      content: "这是意见反馈内容", //反馈内容
      type: "2", //区分是意见反馈还是设备报修。1意见反馈2设备报修
      cate_id: "2", //意见反馈类型
      pic_urls: null, //反馈图片,json格式
      create_time: "2024-03-07 09:28:28", //反馈时间
      is_read: "0", //是否已读，1已读0未读
      ROW_NUMBER: "1", //意见反馈类型名称
      cate_name: "意见", //英文意见反馈类型名称
      en_cate_name: "opinion",
    },
  ];
};

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
  state.isShowDrawer = true;
  state.record = record;
  fetchGetFeedbackDetail();
};

const onShowSubmitModal = (type) => {
  state.submitType = type;
  state.isShowSubmitDrawer = true;
};

const handleCategoryChange = (value) => {
  let categoryList = state.categoryList.find(
    (item) => item.id == value
  ).category;
  categoryList.forEach((item) => {
    let obj = {
      value: item.id,
      label: item.name,
    };
    state.categoryTypeList.push(obj);
  });
  console.log(state.categoryTypeList);
};

const handleIlkChange = (value) => {
  let ilk = state.ilkList.find((item) => item.id == value);
  fetchGetIlkAddress(ilk.is_region);
};



const fileUpload = (data) => {
  if (data[0]?.response?.data) {
    state.fileList.push(data[0].response.data);
    console.log(state.fileList);
  }
  // console.log(state.fileList);
};

const onSubmit = () => {
  if (state.submitType == "1") {
    // 意见反馈
    if (!state.categoryAreaId) {
      message.warning("请选择反馈区域");
      return false;
    }
    if (!state.categoryTypeId) {
      message.warning("请选择反馈类型");
      return false;
    }
    if (!state.categoryInputContent) {
      message.warning("请输入反馈内容");
      return false;
    }
    if (!state.fileList.length) {
      message.warning("请上传反馈图片");
      return false;
    }
    if (!state.phone) {
      message.warning("请输入手机号");
      return false;
    }
    // if (!state.email) {
    //   message.warning("请输入邮箱");
    //   return false;
    // }
    let params = {
      area_id: state.categoryAreaId,
      cate_id: state.categoryTypeId,
      content: state.categoryInputContent,
      pic_urls: state.fileList,
      mobile: state.phone,
      email: state.email,
    };
    fetchSubmit(params);
  } else {
    // 设备报修
  }
};



const handleIlkAreaClick = () => {
  if (state.ilkTypeId) {
    state.isShowIlkAreaDrawer = true;
  } else {
    message.warning("请选择报修类型");
  }
};

const handleFilter = () => {
  console.log(state.filterSearch);
  let names = [];
  state.ilkAddressList.forEach((item) => {
    if (
      state.filterSearch.ilkAreaID &&
      item.id == state.filterSearch.ilkAreaID
    ) {
      names.push(item.name);
    }
    if (
      state.filterSearch.ilkFloorID &&
      item.id == state.filterSearch.ilkFloorID
    ) {
      names.push(item.name);
    }

    if (
      state.filterSearch.ilkSpaceID &&
      item.id == state.filterSearch.ilkSpaceID
    ) {
      names.push(item.name);
    }
  });
  state.concatenatedNames = names.join("_"); // 使用逗号拼接名称
  console.log(state.concatenatedNames);
  state.isShowIlkAreaDrawer = false;
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
      type: state.record.type,
      id: state.record.id,
    };
    const res = await getFeedbackDetail(params);
    if (res.code == 0) {
      state.detail = res.data;
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
      state.categoryList = res.data;

      state.categoryList.forEach((item) => {
        let obj = {
          value: item.id,
          label: item.name,
        };
        state.categoryAreaList.push(obj);
      });
      console.log(state.categoryAreaList);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchIlk = async () => {
  try {
    const res = await getFeedbackIlk();
    if (res.code == 0) {
      state.ilkList = res.data;

      state.ilkList.forEach((item) => {
        let obj = {
          value: item.id,
          label: item.name,
        };
        state.ilkTypeList.push(obj);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchGetIlkAddress = async (id) => {
  try {
    const res = await getIlkAddress(id);
    state.filterSource = {
      ilkAreaList: [],
      ilkFloorList: [],
      ilkSpaceList: [],
    };
    if (res.code == 0) {
      state.ilkAddressList = res.data;
      let list = res.data;
      list.forEach((item) => {
        if (item.levels == 1) {
          state.filterSource.ilkAreaList.push(item);
        } else if (item.levels == 2) {
          state.filterSource.ilkFloorList.push(item);
        } else if (item.levels == 3) {
          state.filterSource.ilkSpaceList.push(item);
        }
      });
      console.log(state.filterSource);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchSubmit = async (params) => {
  try {
    if (state.submitType == "1") {
      const res = await postFeedback(params);
      if (res.code == 0) {
        message.success(res.message);
        state.isShowSubmitDrawer = false;
      }
    } else {
      const res = await postFeedback(params);
      console.log(res);
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
    <div class="bottom_content">
      <a-table
        v-if="state.data?.length"
        :columns="columns"
        :data-source="state.data"
        :pagination="pagination"
        @change="onChangePage"
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
      <a-empty v-else />
    </div>

    <!-- 详情页面 -->
    <a-drawer
      :open="state.isShowDrawer"
      @close="state.isShowDrawer = false"
      :closable="false"
      :footer="null"
      width="600px"
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
      <!-- 意见反馈 -->
      <div v-if="state.record.type == '1'">
        <a-flex class="feedback_item">
          <div>反馈类型：</div>
          <div style="flex: 1">{{ state.detail.cate_id }}</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>反馈内容：</div>
          <div style="flex: 1">{{ state.record.content }}</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>反馈图片：</div>
          <div style="flex: 1">
            <img
              :src="state.defaultPic"
              style="width: 80px; height: 80px"
              alt=""
            />
          </div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>手机号：</div>
          <div style="flex: 1">{{ state.detail.mobile }}</div>
        </a-flex>
        <a-divider dashed />
      </div>
      <!-- 设备报修 -->
      <div v-else>
        <a-flex class="feedback_item">
          <div>报修类型：</div>
          <div style="flex: 1">xxx类型</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>报修区域：</div>
          <div style="flex: 1">xxx区域</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>报修区域是否暂停使用：</div>
          <div style="flex: 1">是</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>联系电话：</div>
          <div style="flex: 1">{{ state.record.content }}</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>报修内容：</div>
          <div style="flex: 1">{{ state.record.content }}</div>
        </a-flex>
        <a-flex class="feedback_item">
          <div>报修图片：</div>
          <div style="flex: 1">
            <img
              :src="state.defaultPic"
              style="width: 80px; height: 80px"
              alt=""
            />
          </div>
        </a-flex>

        <a-divider dashed />
      </div>

      <div v-if="state.detail.reply?.length">

        <div class="feedback_item">平台回复:</div>
  
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
      @close="state.isShowSubmitDrawer = false"
      :closable="false"
      :footer="null"
      width="600px"
    >
      <div class="drawer_title">
        <div class="title_text">
          <div class="indicator_title"></div>
          <div>{{ state.submitType == "1" ? "意见反馈" : "设备报修" }}</div>
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
      <div v-if="state.submitType == '1'">
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>反馈区域：</div>
          <a-select
            style="flex: 1"
            v-model:value="state.categoryAreaId"
            @change="handleCategoryChange"
            placeholder="选择反馈区域"
          >
            <template v-for="item in state.categoryAreaList" :key="item?.value">
              <a-select-option :value="item?.value">{{
                item?.label
              }}</a-select-option>
            </template>
          </a-select>
        </a-flex>

        <a-flex class="feedback_item" gap="middle" align="center">
          <div>反馈类型：</div>
          <a-select
            style="flex: 1"
            v-model:value="state.categoryTypeId"
            @change="handleCategoryChange"
            placeholder="选择反馈类型"
          >
            <template v-for="item in state.categoryTypeList" :key="item?.value">
              <a-select-option :value="item?.value">{{
                item?.label
              }}</a-select-option>
            </template>
          </a-select>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="top">
          <div>反馈内容：</div>
          <a-textarea
            style="flex: 1"
            v-model:value="state.categoryInputContent"
            show-count
            class="edit_textarea"
            placeholder="请输入要反馈的详细内容"
            :autoSize="{ minRows: 3, maxRows: 6 }"
            :maxlength="200"
          />
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="top">
          <div>上传照片：</div>
          <div style="flex: 1">
            <Uploader
              filePath="feedback"
              :maxCount="1"
              @onFileUpload="(v) => fileUpload(v)"
              accept="image/jpeg,image/png,image/bmp"
              list-type="picture-card"
              :showUploadList="false"
            >
              <img src="@/assets/feedback_uploadimg.svg" alt="" />
            </Uploader>
          </div>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>手机号：</div>
          <div style="flex: 1">
            <a-input v-model:value="state.phone" placeholder="请输入手机号" />
          </div>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>邮箱：</div>
          <div style="flex: 1; margin-left: 15px">
            <a-input v-model:value="state.email" placeholder="请输入邮箱" />
          </div>
        </a-flex>
      </div>
      <div v-else>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>报修类型：</div>
          <a-select
            style="flex: 1"
            v-model:value="state.ilkTypeId"
            @change="handleIlkChange"
            placeholder="选择报修类型"
          >
            <template v-for="item in state.ilkTypeList" :key="item?.value">
              <a-select-option :value="item?.value">{{
                item?.label
              }}</a-select-option>
            </template>
          </a-select>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>报修区域：</div>
          <div
            class="filter_box"
            :class="{ grayTextColor: !state.concatenatedNames.length }"
            @click="handleIlkAreaClick"
          >
            {{
              state.concatenatedNames
                ? state.concatenatedNames
                : "请选择报修区域"
            }}
          </div>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>报修座位：</div>
          <div style="flex: 1">
            <a-input
              v-model:value="state.ilkSeat"
              placeholder="请输入报修座位"
            />
          </div>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>报修区域是否暂停使用：</div>
          <div style="flex: 1">
            <a-radio-group v-model:value="state.ilkIsStop">
              <a-radio :value="0" :key="0">是</a-radio>
              <a-radio :value="1" :key="1">否</a-radio>
            </a-radio-group>
          </div>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="center">
          <div>联系电话：</div>
          <div style="flex: 1">
            <a-input
              v-model:value="state.ilkMobile"
              placeholder="请输入联系电话"
            />
          </div>
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="top">
          <div>报修内容：</div>
          <a-textarea
            style="flex: 1"
            v-model:value="state.ilkContent"
            show-count
            class="edit_textarea"
            placeholder="请输入要报修的详细内容"
            :autoSize="{ minRows: 3, maxRows: 6 }"
            :maxlength="200"
          />
        </a-flex>
        <a-flex class="feedback_item" gap="middle" align="top">
          <div>上传照片：</div>
          <div style="flex: 1">
            <Uploader
              filePath="feedback"
              :maxCount="1"
              @onFileUpload="(v) => fileUpload(v)"
              accept="image/jpeg,image/png,image/bmp"
              list-type="picture-card"
              :showUploadList="false"
            >
              <img src="@/assets/feedback_uploadimg.svg" alt="" />
            </Uploader>
          </div>
        </a-flex>
      </div>
    </a-drawer>

    <a-modal
      width="50%"
      v-model:open="state.isShowIlkAreaDrawer"
      title="报修区域"
      @ok="handleFilter"
      destroyOnClose
      okText="确认"
      cancelText="取消"
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
      <FeedbackFilter
        v-if="state.filterSource?.ilkAreaList?.length"
        :data="state.filterSource"
        :initSearch="state.filterSearch"
      />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.feebback {
  padding: 24px 30px;
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
        font-family: AliHeavy !important;
        color: var(--primary-color);
      }
      &:last-child {
        margin-left: 40px;
      }
    }
  }
  .bottom_content {
    margin-top: 30px;
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
  }
}

.feedback_item {
  margin-top: 30px;
  margin-left: 30px;
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
.ant-divider-horizontal {
  margin: 15px 0;
}
</style>
