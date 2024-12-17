<route>
    {
      meta: {
        showHead: false,
        showLeftBack:false,
        title:'menu_home',
        showTabbar:true
      }
    }
    </route>

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

const state = reactive({
  activeKey: "1",
  isOptionDetails: false,

  refreshing: false,
  loading: false,
  finished: true,

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
  categoryAreaName: "",
  categoryTypeList: [],
  categoryTypeId: "",
  categoryTypeName: "",
  categoryInputContent: "",
  fileList: [],
  phone: "",
  email: "",

  ilkList: [],
  ilkTypeList: [],
  ilkTypeId: "",
  ilkTypeName: "",
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
  isShowIlkTypeDrawer: false,
  isShowIlkAreaDrawer: false,
  isIlkType: false,
  isIlkArea: false,
  concatenatedNames: "",
  ilkSeat: "",
  ilkIsStop: 0,
  ilkMobile: "",
  ilkContent: "",

  defaultPic:
    "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",

  isShowCategoryAreaDrawer: false,
  isCategoryArea: false,
  isCategoryType: false,
});

onMounted(() => {
  fetch();
  fetchCategory();
  fetchIlk();
});

const onChangeTab = (key) => {
  state.activeKey = key;
};

const onLoad = () => {
  state.currentPage++;
  fetch();
};

const onRefresh = () => {
  state.currentPage = 1;
  fetch();
};

const onShowOptionDetails = (item) => {
  state.isOptionDetails = true;
  state.record = item;
  fetchGetFeedbackDetail();
};

const onShowCategoryArea = () => {
  state.isShowCategoryAreaDrawer = true;
  state.isCategoryArea = true;
};

const onShowCategoryType = () => {
  if (state.categoryAreaId) {
    state.isShowCategoryAreaDrawer = true;
    state.isCategoryType = true;
  } else {
    message.warning("请先选择反馈区域");
  }
};

const onShowIlkType = () => {
  state.isShowIlkTypeDrawer = true;
  state.isIlkType = true;
};

const onShowIlkArea = () => {
  if (state.ilkTypeId) {
    state.isShowIlkAreaDrawer = true;
    state.isIlkArea = true;
  } else {
    message.warning("请先选择报修类型");
  }
};

const handleFilter = () => {
  if (state.activeKey == "2") {
    // 意见反馈
    state.isShowCategoryAreaDrawer = false;
    if (state.isCategoryArea) {
      if (state.categoryAreaId) {
        state.categoryAreaName = state.categoryAreaList.find(
          (item) => item.value == state.categoryAreaId
        )?.label;
        let categoryList = state.categoryList.find(
          (item) => item.id == state.categoryAreaId
        ).category;
        state.categoryTypeList = [];
        categoryList.forEach((item) => {
          let obj = {
            value: item.id,
            label: item.name,
          };
          state.categoryTypeList.push(obj);
        });
        if (state.categoryTypeId) {
          state.categoryTypeName =
            state.categoryTypeList.find(
              (item) => item.value == state.categoryTypeId
            )?.label || "";
          if (!state.categoryTypeName) {
            state.categoryTypeId = "";
          }
        }
      }
    }
    if (state.isCategoryType) {
      if (state.categoryTypeId) {
        state.categoryTypeName = state.categoryTypeList.find(
          (item) => item.value == state.categoryTypeId
        )?.label;
      }
    }

    state.isCategoryArea = false;
    state.isCategoryType = false;
  } else if (state.activeKey == "3") {
    // 设备报修
    state.isShowIlkTypeDrawer = false;
    state.isShowIlkAreaDrawer = false;

    if (state.isIlkType) {
      if (state.ilkTypeId) {
        state.ilkTypeName = state.ilkTypeList.find(
          (item) => item.value == state.ilkTypeId
        )?.label;
        let ilk = state.ilkList.find((item) => item.id == state.ilkTypeId);
        fetchGetIlkAddress(ilk.is_region);
      }
    }

    if (state.isIlkArea) {
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
    }

    state.isIlkType = false;
    state.isIlkArea = false;
  }
};

const onCloseDrawer = () => {
  state.isShowCategoryAreaDrawer = false;
  state.isCategoryArea = false;
  state.isCategoryType = false;
};

const onApply = () => {
  if (state.activeKey == "2") {
    // 意见反馈
    if (!state.categoryAreaId) {
      message.warning("请先选择反馈区域");
      return;
    }
    if (!state.categoryTypeId) {
      message.warning("请先选择反馈类型");
      return;
    }
    if (!state.categoryInputContent) {
      message.warning("请输入反馈内容");
      return;
    }
    if (!state.fileList.length) {
      message.warning("请上传反馈图片");
      return;
    }
    if (!state.phone) {
      message.warning("请输入手机号");
      return;
    }
    if (!state.email) {
      message.warning("请输入邮箱");
      return;
    }
    let params = {
      area_id: state.categoryAreaId,
      cate_id: state.categoryTypeId,
      content: state.categoryInputContent,
      pic_urls: state.fileList,
      mobile: state.phone,
      email: state.email,
    };
    fetchSubmit(params);
  } else if (state.activeKey == "3") {
    // 设备报修
    // fetchSubmit(params);
  }
};

const fetch = async () => {
  try {
    let params = {
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getMyFeedback(params);
    state.loading = false;
    state.refreshing = false;

    if (res.code == 0) {
      if (state.currentPage === 1) {
        state.data = res?.data?.data || [];
      } else {
        state.data.push(...res?.data?.data);
      }
      state.total = res?.data?.total || 0;
      state.finished = state.currentPage >= res?.data?.last_page;
    } else {
      state.data = [];
      state.finished = true;
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
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
    } else {
      state.detail = {};
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

const fileUpload = (data) => {
  if (data[0]?.response?.data) {
    state.fileList.push(data[0].response.data);
    console.log(state.fileList);
  }
  // console.log(state.fileList);
};

const fetchSubmit = async (params) => {
  try {
    if (state.activeKey == "2") {
      const res = await postFeedback(params);
      if (res.code == 0) {
        message.success(res.message);
        state.isShowSubmitDrawer = false;
      }
    } else if (state.activeKey == "3") {
      const res = await postFeedback(params);
      console.log(res);
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
</script>

<template>
  <div class="feedback">
    <div v-if="!state.isOptionDetails" style="height: 100%; overflow-y: hidden">
      <a-tabs
        v-model:activeKey="state.activeKey"
        class="top_tabs"
        size="middle"
        @change="onChangeTab"
      >
        <a-tab-pane key="1" tab="反馈列表"></a-tab-pane>
        <a-tab-pane key="2" tab="意见反馈"></a-tab-pane>
        <a-tab-pane key="3" tab="设备报修"></a-tab-pane>
      </a-tabs>

      <!-- 反馈列表 -->
      <van-pull-refresh
        v-model="state.refreshing"
        @refresh="onRefresh"
        v-if="state.activeKey == '1'"
      >
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="feedback_list" v-for="item in state.data" :key="item?.id">
            <div class="item" @click="onShowOptionDetails(item)">
              <div class="van-ellipsis item_title">
                {{ item?.content }}
              </div>
              <div class="type_time">
                <div
                  class="type"
                  :class="{
                    opinion: item?.type == '1',
                    device: item?.type == '2',
                  }"
                >
                  {{ item?.type === "1" ? "意见反馈" : "设备报修" }}
                </div>
                <div class="time">{{ item?.create_time }}</div>
              </div>
              <a-divider />
              <div class="right_arrow">
                <img
                  src="@/assets/activity_application/right_arrow_gray.svg"
                  alt=""
                />
              </div>
              <div class="status_dot" v-if="item?.is_read == '0'"></div>

              <!-- <img src="@/assets/activity_application/right_arrow_gray.svg" alt="" /> -->
            </div>
          </div>
        </van-list>
      </van-pull-refresh>

      <!-- 意见反馈 -->
      <div v-if="state.activeKey == '2'" class="feedback_option_tab">
        <div class="option_content">
          <div class="feedback_option_tab_item" @click="onShowCategoryArea">
            <div class="feedback_option_tab_item_left">反馈区域</div>
            <div class="feedback_option_tab_item_right">
              <div :class="{ no_select: !state.categoryAreaName }">
                {{ state.categoryAreaName ? state.categoryAreaName : "请选择" }}
              </div>
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_item" @click="onShowCategoryType">
            <div class="feedback_option_tab_item_left">反馈类型</div>
            <div class="feedback_option_tab_item_right">
              <div :class="{ no_select: !state.categoryTypeName }">
                {{ state.categoryTypeName ? state.categoryTypeName : "请选择" }}
              </div>
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_col">
            <div class="feedback_option_tab_item_top">反馈内容</div>
            <div>
              <a-textarea
                style="margin-bottom: 15px"
                v-model:value="state.categoryInputContent"
                :bordered="false"
                show-count
                :maxlength="200"
                :autoSize="{ minRows: 3, maxRows: 3 }"
                placeholder="请输入反馈内容"
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_col">
            <div class="feedback_option_tab_item_top">上传图片</div>
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
          <div class="feedback_option_tab_col">
            <div class="feedback_option_tab_item_top">手机号</div>
            <a-input
              v-model:value="state.phone"
              class="input"
              :bordered="false"
              placeholder="请输入手机号"
            />
          </div>
          <a-divider />
          <div class="feedback_option_tab_col">
            <div class="feedback_option_tab_item_top">邮箱</div>
            <a-input
              v-model:value="state.email"
              class="input"
              :bordered="false"
              placeholder="请输入邮箱"
            />
          </div>
        </div>
        <div class="option_bottomAction">
          <van-button round block type="default">
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            返回
          </van-button>
          <van-button round block type="primary" @click="onApply"
            >提交</van-button
          >
        </div>
      </div>

      <!-- 设备报修 -->
      <div v-if="state.activeKey == '3'" class="feedback_option_tab">
        <div class="option_content">
          <div class="feedback_option_tab_item" @click="onShowIlkType">
            <div class="feedback_option_tab_item_left">报修类型</div>
            <div class="feedback_option_tab_item_right">
              <div :class="{ no_select: !state.ilkTypeName }">
                {{ state.ilkTypeName ? state.ilkTypeName : "请选择" }}
              </div>
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_item" @click="onShowIlkArea">
            <div class="feedback_option_tab_item_left">报修区域</div>
            <div class="feedback_option_tab_item_right">
              <div :class="{ no_select: !state.concatenatedNames }">
                {{
                  state.concatenatedNames ? state.concatenatedNames : "请选择"
                }}
              </div>
              <img
                src="@/assets/activity_application/right_arrow_gray.svg"
                alt=""
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_item">
            <div class="feedback_option_tab_item_left">报修座位</div>
            <div class="feedback_option_tab_item_right">
              <a-input
                style="text-align: right; padding: 0 10px"
                v-model:value="state.ilkSeat"
                :bordered="false"
                :size="middle"
                placeholder="请输入"
              />
            </div>
          </div>

          <div class="feedback_option_tab_item" style="margin-top: 10px">
            <div class="feedback_option_tab_item_left">
              报修区域是否暂停使用
            </div>
            <div class="feedback_option_tab_item_right">
              <a-radio-group v-model:value="state.ilkIsStop">
                <a-radio :value="0" :key="0">是</a-radio>
                <a-radio :value="1" :key="1">否</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_item">
            <div class="feedback_option_tab_item_left">联系电话</div>
            <div class="feedback_option_tab_item_right">
              <a-input
                style="text-align: right; padding: 0 10px"
                v-model:value="state.ilkMobile"
                :bordered="false"
                :size="middle"
                placeholder="请输入"
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_col">
            <div class="feedback_option_tab_item_top">报修内容</div>
            <div>
              <a-textarea
                style="margin-bottom: 15px"
                v-model:value="state.ilkContent"
                :bordered="false"
                show-count
                :maxlength="200"
                :autoSize="{ minRows: 3, maxRows: 3 }"
                placeholder="请输入报修内容"
              />
            </div>
          </div>
          <a-divider />
          <div class="feedback_option_tab_col">
            <div class="feedback_option_tab_item_top">上传图片</div>
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
        </div>
        <div class="option_bottomAction">
          <van-button round block type="default">
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            返回
          </van-button>
          <van-button round block type="primary" @click="onApply"
            >提交</van-button
          >
        </div>
      </div>
    </div>

    <!-- 反馈详情 -->
    <div v-if="state.isOptionDetails">
      <div class="option_details_box">
        <div v-if="state.record.type == '1'">
          <div class="option_details_item">
            <div class="option_details_item_left">反馈类型</div>
            <div class="option_details_item_right">
              {{ state.detail?.cate_id }}
            </div>
          </div>
          <a-divider />
          <div class="option_details_item_content">
            <div class="option_details_item_content_title">反馈内容</div>
            <div class="option_details_item_content_content">
              {{ state.detail?.content }}
            </div>
          </div>
          <a-divider />
          <div class="option_details_item_content">
            <div class="option_details_item_content_title">反馈图片</div>
            <div class="option_details_item_content_content">
              <img
                :src="state.defaultPic"
                style="width: 80px; height: 80px"
                alt=""
              />
            </div>
          </div>
          <a-divider />
          <div class="option_details_item">
            <div class="option_details_item_left">手机号</div>
            <div class="option_details_item_right">
              {{ state.detail?.mobile }}
            </div>
          </div>
        </div>
        <div v-if="state.record.type == '2'">
          <div class="option_details_item">
            <div class="option_details_item_left">报修类型</div>
            <div class="option_details_item_right">xxx类型</div>
          </div>
          <a-divider />
          <div class="option_details_item">
            <div class="option_details_item_left">报修区域</div>
            <div class="option_details_item_right">xxx区域</div>
          </div>
          <a-divider />
          <div class="option_details_item">
            <div class="option_details_item_left">报修区域是否暂停使用：</div>
            <div class="option_details_item_right">是</div>
          </div>
          <a-divider />
          <div class="option_details_item">
            <div class="option_details_item_left">联系电话</div>
            <div class="option_details_item_right">
              {{ state.detail?.mobile }}
            </div>
          </div>
          <a-divider />
          <div class="option_details_item_content">
            <div class="option_details_item_content_title">报修内容</div>
            <div class="option_details_item_content_content">
              内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
            </div>
          </div>
          <a-divider />
          <div class="option_details_item_content">
            <div class="option_details_item_content_title">报修图片</div>
            <div class="option_details_item_content_content">
              <img
                :src="state.defaultPic"
                style="width: 80px; height: 80px"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="reply_box">
          <div class="reply_box_title">平台回复</div>
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

      <div class="bottomAction">
        <van-button
          round
          block
          type="default"
          @click="state.isOptionDetails = false"
        >
          <img src="@/assets/seat/moBackBtn.svg" alt="" />
          返回
        </van-button>
      </div>
    </div>

    <!-- 意见反馈 筛选 -->
    <a-drawer
      width="100%"
      height="50%"
      placement="bottom"
      :open="state.isShowCategoryAreaDrawer"
      @close="onCloseDrawer"
      :closable="false"
    >
      <div class="filterCon">
        <div class="filterCategory" v-if="state.isCategoryArea">
          <div class="filterFilter">反馈区域</div>
          <div class="fiterItem">
            <a-radio-group v-model:value="state.categoryAreaId">
              <a-radio
                class="width_half"
                v-for="item in state.categoryAreaList"
                :value="item?.value"
                :key="item?.value"
                >{{ item?.label }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
        <div class="filterCategory" v-if="state.isCategoryType">
          <div class="filterFilter">反馈类型</div>
          <div class="fiterItem">
            <a-radio-group v-model:value="state.categoryTypeId">
              <a-radio
                class="width_half"
                v-for="item in state.categoryTypeList"
                :value="item?.value"
                :key="item?.value"
                >{{ item?.label }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.isShowCategoryAreaDrawer = false"
          >
            取消
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >确认</van-button
          >
        </div>
      </div>
    </a-drawer>

    <!-- 设备报修 类型 筛选 -->
    <a-drawer
      width="100%"
      height="50%"
      placement="bottom"
      :open="state.isShowIlkTypeDrawer"
      @close="onCloseDrawer"
      :closable="false"
    >
      <div class="filterCon">
        <div class="filterCategory">
          <div class="filterFilter">报修类型</div>
          <div class="fiterItem">
            <a-radio-group v-model:value="state.ilkTypeId">
              <a-radio
                class="width_half"
                v-for="item in state.ilkTypeList"
                :value="item?.value"
                :key="item?.value"
                >{{ item?.label }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.isShowIlkTypeDrawer = false"
          >
            取消
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >确认</van-button
          >
        </div>
      </div>
    </a-drawer>

    <!-- 设备报修 区域 筛选 -->
    <a-drawer
      width="100%"
      height="50%"
      placement="bottom"
      :open="state.isShowIlkAreaDrawer"
      @close="onCloseDrawer"
      :closable="false"
    >
      <div class="filterCon">
        <FeedbackFilter
          v-if="state.filterSource?.ilkAreaList?.length"
          :data="state.filterSource"
          :initSearch="state.filterSearch"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.isShowIlkAreaDrawer = false"
          >
            取消
          </van-button>
          <van-button round block type="primary" @click="handleFilter"
            >确认</van-button
          >
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
.feedback {
  height: 100%;
  background-color: #fafafa;
  overflow: hidden;
  .top_tabs {
    background-color: #fff;
    padding-left: 10px !important;
  }
  .feedback_list {
    height: 100%;
    overflow-y: auto;
    margin-top: 10px;
    .item {
      position: relative;
      background-color: #fff;
      padding: 10px;
      padding-bottom: 0;
      .item_title {
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
      }
      .type_time {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
        margin-top: 10px;
        .type {
          font-size: 12px;
          margin-right: 10px;
        }
        .opinion {
          background-color: rgba(31, 86, 225, 0.1);
          padding: 2px 8px;
          color: rgba(31, 86, 225, 1);
        }
        .device {
          background-color: rgba(243, 116, 0, 0.1);
          padding: 2px 8px;
          color: rgba(243, 116, 0, 1);
        }
        .time {
          font-size: 12px;
          color: rgba(97, 97, 97, 1);
        }
      }
      .right_arrow {
        position: absolute;
        right: 10px;
        top: 35%;
      }
      .status_dot {
        width: 6px;
        height: 6px;
        background: #f72222;
        border-radius: 7px;
        position: absolute;
        right: 10px;
        top: 10px;
      }
    }
  }

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
  .bottomAction {
    padding: 12px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    background: #fff;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
      img {
        margin-right: 4px;
        transform: translateY(-2px);
      }
    }
  }

  .feedback_option_tab {
    height: calc(100vh - 125px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .option_content {
      flex: 1;
      padding-bottom: 100px;
      overflow-y: auto;
      background-color: #fafafa;
      .feedback_option_tab_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background-color: #fff;
        .feedback_option_tab_item_left {
          color: rgba(97, 97, 97, 1);
          font-size: 14px;
        }
        .feedback_option_tab_item_right {
          display: flex;
          align-items: center;
          color: rgba(32, 32, 32, 1);
          font-size: 14px;
          img {
            margin-left: 4px;
          }
          .no_select {
            color: rgba(32, 32, 32, 0.3);
          }
        }
      }
      .feedback_option_tab_col {
        padding: 16px;
        background-color: #fff;
        .feedback_option_tab_item_top {
          color: rgba(97, 97, 97, 1);
          font-size: 14px;
        }
        .input {
          margin-top: 10px;
          padding-left: 0;
        }
      }
    }

    .option_bottomAction {
      padding: 12px;

      display: flex;
      justify-content: space-between;
      background: #fff;
      & button {
        &:nth-child(1) {
          margin-right: 12px;
        }
        img {
          margin-right: 4px;
          transform: translateY(-2px);
        }
      }
    }
  }
}
.filterCon {
  padding: 24px 0 0 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  .filterCategory {
    flex: 1;
    overflow-y: auto;
    .filterFilter {
      margin-bottom: 24px;
      background: rgba(97, 97, 97, 0.05);
      border-radius: 0px 0px 0px 0px;
      padding: 2px 10px;
      color: rgba(97, 97, 97, 1);
    }
    .fiterItem {
      width: 100%;
      user-select: none;
      padding: 0 20px;
      margin-bottom: 40px;
      .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
    }
      &:last-child {
        margin-bottom: 0;
      }
      .width_half {
        width: 40%;
      }
    }
  }
  .bottomAct {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
  }
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0px !important;
}
:deep(.ant-divider-horizontal) {
  margin: 0 !important;
}
:deep(.van-pull-refresh) {
  height: 100% !important;
}
</style>
