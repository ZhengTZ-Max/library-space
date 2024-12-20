<script setup>
import { reactive, onMounted } from "vue";
import { message } from "ant-design-vue";

import { getIlkAddress } from "@/request/feedback";
import Uploader from "@/components/Uploader.vue";
import FeedbackFilter from "@/components/FeedbackFilter.vue";

const props = defineProps({
  data: {
    type: Object,
  },
});

const state = reactive({
  propsData: {
    activeKey: "1",
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
    ilkAreaID: "",
    ilkAddressList: [],
    concatenatedNames: "",
    ilkSeat: "",
    ilkIsStop: 0,
    ilkMobile: "",
    ilkContent: "",

    ilkTypeIsSpace: false,
    ilkTypeHaveRegion: false,
  },
  isCategoryArea: false,
  isCategoryType: false,
  isShowIlkType: false,
  isShowIlkArea: false,

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
});

onMounted(() => {
  state.propsData = props?.data || {};
  console.log(state.propsData);
});

// 意见反馈 区域筛选
const handleFilterArea = () => {
  state.isCategoryArea = false;
  if (state.propsData.categoryAreaId) {
    state.propsData.categoryAreaName = state.propsData.categoryAreaList.find(
      (item) => item.value == state.propsData.categoryAreaId
    )?.label;
    let categoryList = state.propsData.categoryList.find(
      (item) => item.id == state.propsData.categoryAreaId
    ).category;
    state.propsData.categoryTypeList = [];
    categoryList.forEach((item) => {
      let obj = {
        value: item.id,
        label: item.name,
      };
      state.propsData.categoryTypeList.push(obj);
    });
  }
};

const onShowCategoryType = () => {
  if (state.propsData.categoryAreaId) {
    state.isCategoryType = true;
  } else {
    message.warning("请先选择反馈区域");
  }
};

// 意见反馈 类型筛选
const handleFilterType = () => {
  state.isCategoryType = false;
  if (state.propsData.categoryTypeId) {
    state.propsData.categoryTypeName =
      state.propsData.categoryTypeList.find(
        (item) => item.value == state.propsData.categoryTypeId
      )?.label || "";
    if (!state.propsData.categoryTypeName) {
      state.propsData.categoryTypeId = "";
    }
  }
};

const onShowIlkArea = () => {
  if (state.propsData.ilkTypeId) {
    state.isShowIlkArea = true;
  } else {
    message.warning("请先选择报修类型");
  }
};

// 设备报修 类型筛选
const handleFilterIlkType = () => {
  state.isShowIlkType = false;

  if (state.propsData.ilkTypeId) {
    state.propsData.ilkTypeName = state.propsData.ilkTypeList.find(
      (item) => item.value == state.propsData.ilkTypeId
    )?.label;
    let ilk = state.propsData.ilkList.find(
      (item) => item.id == state.propsData.ilkTypeId
    );

    state.propsData.ilkTypeIsSpace = ilk.id == 10;
    if (ilk.is_region) {
      state.propsData.ilkTypeHaveRegion = true;
    } else {
      state.propsData.ilkTypeHaveRegion = false;
    }
    fetchGetIlkAddress(ilk.is_region);
  }
};
const handleFilterIlkArea = () => {
  state.isShowIlkArea = false;
  let names = [];
  state.propsData.ilkAddressList.forEach((item) => {
    if (
      state.filterSearch.ilkAreaID &&
      item.id == state.filterSearch.ilkAreaID
    ) {
        state.propsData.ilkAreaID = item.id;
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
  state.propsData.concatenatedNames = names.join("_"); // 使用逗号拼接名称
  console.log(state.propsData.concatenatedNames);
};

const fileUpload = (data, type) => {
  console.log(data, type);
  if (type == "feedback") {
    state.propsData.fileList = filterFileUpload(data);
  }
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
const initFilter = () => {
  state.filterSource = {
    ilkAreaList: [],
    ilkFloorList: [],
    ilkSpaceList: [],
  };
  state.filterSearch = {
    ilkAreaID: "",
    ilkFloorID: "",
    ilkSpaceID: "",
  };
  state.propsData.concatenatedNames = "";
  state.propsData.ilkSeat = "";
  state.propsData.ilkAreaID = "";
};

const fetchGetIlkAddress = async (id) => {
  try {
    const res = await getIlkAddress(id);
    initFilter();
    if (res.code == 0) {
      state.propsData.ilkAddressList = res.data;
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
  <div class="option_content" v-if="state.propsData.activeKey == '2'">
    <div class="feedback_option_tab_item" @click="state.isCategoryArea = true">
      <div class="feedback_option_tab_item_left">反馈区域</div>
      <div class="feedback_option_tab_item_right">
        <div :class="{ no_select: !state.propsData.categoryAreaName }">
          {{
            state.propsData.categoryAreaName
              ? state.propsData.categoryAreaName
              : "请选择"
          }}
        </div>
        <img src="@/assets/activity_application/right_arrow_gray.svg" alt="" />
      </div>
    </div>
    <a-divider />
    <div class="feedback_option_tab_item" @click="onShowCategoryType">
      <div class="feedback_option_tab_item_left">反馈类型</div>
      <div class="feedback_option_tab_item_right">
        <div :class="{ no_select: !state.propsData.categoryTypeName }">
          {{
            state.propsData.categoryTypeName
              ? state.propsData.categoryTypeName
              : "请选择"
          }}
        </div>
        <img src="@/assets/activity_application/right_arrow_gray.svg" alt="" />
      </div>
    </div>
    <a-divider />
    <div class="feedback_option_tab_col">
      <div class="feedback_option_tab_item_top">反馈内容</div>
      <div>
        <a-textarea
          style="margin-bottom: 15px"
          v-model:value="state.propsData.categoryInputContent"
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
        @onFileUpload="(v) => fileUpload(v, 'feedback')"
        accept="image/jpeg,image/png,image/bmp"
        list-type="picture-card"
        :showUploadList="true"
      >
        <img src="@/assets/feedback_uploadimg.svg" alt="" />
      </Uploader>
    </div>
    <div class="feedback_option_tab_col">
      <div class="feedback_option_tab_item_top">手机号</div>
      <a-input
        v-model:value="state.propsData.phone"
        class="input"
        :bordered="false"
        placeholder="请输入手机号"
      />
    </div>
    <a-divider />
    <div class="feedback_option_tab_col">
      <div class="feedback_option_tab_item_top">邮箱</div>
      <a-input
        v-model:value="state.propsData.email"
        class="input"
        :bordered="false"
        placeholder="请输入邮箱"
      />
    </div>
  </div>
  <div class="option_content" v-if="state.propsData.activeKey == '3'">
    <div class="feedback_option_tab_item" @click="state.isShowIlkType = true">
      <div class="feedback_option_tab_item_left">报修类型</div>
      <div class="feedback_option_tab_item_right">
        <div :class="{ no_select: !state.propsData.ilkTypeName }">
          {{
            state.propsData.ilkTypeName ? state.propsData.ilkTypeName : "请选择"
          }}
        </div>
        <img src="@/assets/activity_application/right_arrow_gray.svg" alt="" />
      </div>
    </div>
    <a-divider />
    <div class="feedback_option_tab_item" @click="onShowIlkArea">
      <div class="feedback_option_tab_item_left">报修区域</div>
      <div class="feedback_option_tab_item_right">
        <div :class="{ no_select: !state.propsData.concatenatedNames }">
          {{
            state.propsData.concatenatedNames
              ? state.propsData.concatenatedNames
              : "请选择"
          }}
        </div>
        <img src="@/assets/activity_application/right_arrow_gray.svg" alt="" />
      </div>
    </div>
    <a-divider />
    <div class="feedback_option_tab_item" v-if="!state.propsData.ilkTypeIsSpace">
      <div class="feedback_option_tab_item_left">报修座位</div>
      <div class="feedback_option_tab_item_right">
        <a-input
          style="text-align: right; padding: 0 10px"
          v-model:value="state.propsData.ilkSeat"
          :bordered="false"
          :size="middle"
          placeholder="请输入"
        />
      </div>
    </div>

    <div class="feedback_option_tab_item" style="margin-top: 10px">
      <div class="feedback_option_tab_item_left">报修区域是否暂停使用</div>
      <div class="feedback_option_tab_item_right">
        <a-radio-group v-model:value="state.propsData.ilkIsStop">
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
          v-model:value="state.propsData.ilkMobile"
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
          v-model:value="state.propsData.ilkContent"
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
        @onFileUpload="(v) => fileUpload(v, 'feedback')"
        accept="image/jpeg,image/png,image/bmp"
        list-type="picture-card"
        :showUploadList="true"
      >
        <img src="@/assets/feedback_uploadimg.svg" alt="" />
      </Uploader>
    </div>
  </div>

  <!-- 意见反馈 筛选 -->
  <!-- 反馈区域 -->
  <van-popup
    v-model:show="state.isCategoryArea"
    position="bottom"
    :style="{ height: '50%' }"
    destroy-on-close
  >
    <div class="filterCon">
      <div class="filterCategory">
        <div class="filterFilter">反馈区域</div>
        <div class="fiterItem">
          <a-radio-group v-model:value="state.propsData.categoryAreaId">
            <a-radio
              class="width_half"
              v-for="item in state.propsData.categoryAreaList"
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
          @click="state.isCategoryArea = false"
        >
          取消
        </van-button>
        <van-button round block type="primary" @click="handleFilterArea"
          >确认</van-button
        >
      </div>
    </div>
  </van-popup>

  <!-- 反馈类型 -->
  <van-popup
    v-model:show="state.isCategoryType"
    position="bottom"
    :style="{ height: '50%' }"
    destroy-on-close
  >
    <div class="filterCon">
      <div class="filterCategory" v-if="state.isCategoryType">
        <div class="filterFilter">反馈类型</div>
        <div class="fiterItem">
          <a-radio-group v-model:value="state.propsData.categoryTypeId">
            <a-radio
              class="width_half"
              v-for="item in state.propsData.categoryTypeList"
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
          @click="state.isCategoryType = false"
        >
          取消
        </van-button>
        <van-button round block type="primary" @click="handleFilterType"
          >确认</van-button
        >
      </div>
    </div>
  </van-popup>

  <!-- 设备报修 类型 筛选 -->
  <van-popup
    v-model:show="state.isShowIlkType"
    position="bottom"
    :style="{ height: '50%' }"
    destroy-on-close
  >
    <div class="filterCon">
      <div class="filterCategory">
        <div class="filterFilter">报修类型</div>
        <div class="fiterItem">
          <a-radio-group v-model:value="state.propsData.ilkTypeId">
            <a-radio
              class="width_half"
              v-for="item in state.propsData.ilkTypeList"
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
          @click="state.isShowIlkType = false"
        >
          取消
        </van-button>
        <van-button round block type="primary" @click="handleFilterIlkType"
          >确认</van-button
        >
      </div>
    </div>
  </van-popup>

  <!-- 设备报修 区域 筛选 -->
  <van-popup
    v-model:show="state.isShowIlkArea"
    position="bottom"
    :style="{ height: '50%' }"
    destroy-on-close
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
          @click="state.isShowIlkArea = false"
        >
          取消
        </van-button>
        <van-button round block type="primary" @click="handleFilterIlkArea"
          >确认</van-button
        >
      </div>
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
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
        .ant-radio-wrapper,
        .ant-checkbox-wrapper {
          width: 29%;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
      .width_half {
        width: 42% !important;
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
</style>
