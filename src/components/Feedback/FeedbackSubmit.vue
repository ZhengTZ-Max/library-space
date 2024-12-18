<script setup>
import { reactive, onMounted, computed } from "vue";
import Uploader from "@/components/Uploader.vue";
import {
  getMyFeedback,
  getFeedbackCategory,
  getFeedbackIlk,
  postFeedback,
  getIlkAddress,
} from "@/request/feedback";
import { message } from "ant-design-vue";
import FeedbackFilter from "@/components/FeedbackFilter.vue";

const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  propsData: {},
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
});
onMounted(() => {
  state.propsData = props?.data || {};
});

const handleCategoryChange = (value) => {
  let categoryList = state.propsData?.categoryList.find(
    (item) => item.id == value
  ).category;
  categoryList.forEach((item) => {
    let obj = {
      value: item.id,
      label: item.name,
    };
    state.propsData.categoryTypeList.push(obj);
  });
  console.log(state.propsData.categoryTypeList);
};

const handleIlkChange = (value) => {
  let ilk = state.propsData.ilkList.find((item) => item.id == value);
  fetchGetIlkAddress(ilk.is_region);
};

const handleIlkAreaClick = () => {
  if (state.propsData.ilkTypeId) {
    state.isShowIlkAreaDrawer = true;
  } else {
    message.warning("请选择报修类型");
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

const handleFilter = () => {
  console.log(state.filterSearch);
  let names = [];
  state.propsData.ilkAddressList.forEach((item) => {
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
  state.propsData.concatenatedNames = names.join("_"); // 使用逗号拼接名称
  console.log(state.propsData.concatenatedNames);
  state.isShowIlkAreaDrawer = false;
};

</script>
<template>
  <div class="feedback_submit">
    <div v-if="state.propsData?.submitType == '1'">
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>反馈区域：</div>
        <a-select
          style="flex: 1"
          v-model:value="state.propsData.categoryAreaId"
          @change="handleCategoryChange"
          placeholder="选择反馈区域"
        >
          <template
            v-for="item in state.propsData?.categoryAreaList"
            :key="item?.value"
          >
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
          v-model:value="state.propsData.categoryTypeId"
          @change="handleCategoryChange"
          placeholder="选择反馈类型"
        >
          <template
            v-for="item in state.propsData?.categoryTypeList"
            :key="item?.value"
          >
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
          v-model:value="state.propsData.categoryInputContent"
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
          <a-input
            v-model:value="state.propsData.phone"
            placeholder="请输入手机号"
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>邮箱：</div>
        <div style="flex: 1; margin-left: 15px">
          <a-input
            v-model:value="state.propsData.email"
            placeholder="请输入邮箱"
          />
        </div>
      </a-flex>
    </div>
    <div v-else>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>报修类型：</div>
        <a-select
          style="flex: 1"
          v-model:value="state.propsData.ilkTypeId"
          @change="handleIlkChange"
          placeholder="选择报修类型"
        >
          <template
            v-for="item in state.propsData?.ilkTypeList"
            :key="item?.value"
          >
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
          :class="{
            grayTextColor: state.propsData?.concatenatedNames?.length == 0,
          }"
          @click="handleIlkAreaClick"
        >
          {{
            state.propsData.concatenatedNames
              ? state.propsData.concatenatedNames
              : "请选择报修区域"
          }}
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>报修座位：</div>
        <div style="flex: 1">
          <a-input
            v-model:value="state.propsData.ilkSeat"
            placeholder="请输入报修座位"
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>报修区域是否暂停使用：</div>
        <div style="flex: 1">
          <a-radio-group v-model:value="state.propsData.ilkIsStop">
            <a-radio :value="0" :key="0">是</a-radio>
            <a-radio :value="1" :key="1">否</a-radio>
          </a-radio-group>
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>联系电话：</div>
        <div style="flex: 1">
          <a-input
            v-model:value="state.propsData.ilkMobile"
            placeholder="请输入联系电话"
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="top">
        <div>报修内容：</div>
        <a-textarea
          style="flex: 1"
          v-model:value="state.propsData.ilkContent"
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
