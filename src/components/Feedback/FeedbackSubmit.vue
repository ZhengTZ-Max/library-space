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
  propsData: {
    categoryList: [],
    submitType: "",
    categoryAreaList: [],
    categoryAreaId: "",
    categoryTypeList: [],
    categoryTypeId: "",
    categoryInputContent: "",
    
    phone: "",
    email: "",

    ilkList: [],
    ilkTypeList: [],
    ilkTypeId: "",
    ilkAreaID: "",
    ilkAddressList: [],

    concatenatedNames: "",
    ilkSeat: "",
    ilkIsStop: 0,
    ilkMobile: "",
    ilkContent: "",
    ilkTypeIsSpace: false,
    ilkTypeHaveRegion: false,


    fileList: [],
  },
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
  if (state.propsData?.categoryAreaId.length == 0) {
    state.propsData.categoryAreaId = null;
  }
  if (state.propsData?.categoryTypeId.length == 0) {
    state.propsData.categoryTypeId = null;
  }
  if (state.propsData?.ilkTypeId.length == 0) {
    state.propsData.ilkTypeId = null;
  }
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
  state.propsData.ilkTypeIsSpace = ilk.id == 10;
  if (ilk.is_region) {
    state.propsData.ilkTypeHaveRegion = true;
  } else {
    state.propsData.ilkTypeHaveRegion = false;
  }
  console.log(state.propsData.ilkTypeHaveRegion);

  fetchGetIlkAddress(ilk.is_region);
};

const handleIlkAreaClick = () => {
  if (state.propsData.ilkTypeId) {
    state.isShowIlkAreaDrawer = true;
  } else {
    message.warning("请选择报修类型");
  }
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

const handleFilter = () => {
  console.log(state.filterSearch);
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
  state.isShowIlkAreaDrawer = false;
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
</script>
<template>
  <div class="feedback_submit">
    <div v-if="state.propsData?.submitType == '1'">
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>{{$t("V4_feedback_area")}}：</div>
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
        <div>{{$t("feedback_type")}}：</div>
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
        <div>{{$t("Feedback_content")}}：</div>
        <a-textarea
          style="flex: 1"
          v-model:value="state.propsData.categoryInputContent"
          show-count
          class="edit_textarea"
          :placeholder="$t('Please_enter_TC')"
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
            @onFileUpload="(v) => fileUpload(v, 'feedback')"
            accept="image/jpeg,image/png,image/bmp"
            list-type="picture-card"
            :showUploadList="true"
          >
            <img src="@/assets/feedback_uploadimg.svg" alt="" />
          </Uploader>
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>{{$t("phone")}}：</div>
        <div style="flex: 1">
          <a-input
            v-model:value="state.propsData.phone"
            :placeholder="$t('Please_phone_number')"
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>{{$t("user_email")}}：</div>
        <div style="flex: 1; margin-left: 15px">
          <a-input
            v-model:value="state.propsData.email"
            :placeholder="$t('Please_Enter_Email')"
          />
        </div>
      </a-flex>
    </div>
    <div v-else>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>{{$t("type_of_repair")}}：</div>
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
        <div>{{$t("Repair_Area")}}：</div>
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
      <a-flex
        class="feedback_item"
        gap="middle"
        align="center"
        v-if="!state.propsData.ilkTypeIsSpace"
      >
        <div>{{$t("V4_report_a_seat")}}：</div>
        <div style="flex: 1">
          <a-input
            v-model:value="state.propsData.ilkSeat"
            placeholder="请输入报修座位"
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>{{$t("TRAI_suspended")}}：</div>
        <div style="flex: 1">
          <a-radio-group v-model:value="state.propsData.ilkIsStop">
            <a-radio :value="0" :key="0">{{$t("yes")}}</a-radio>
            <a-radio :value="1" :key="1">{{$t("no")}}</a-radio>
          </a-radio-group>
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="center">
        <div>{{$t("user_phone")}}：</div>
        <div style="flex: 1">
          <a-input
            v-model:value="state.propsData.ilkMobile"
            :placeholder="$t('Please_type_your_phone_number')"
          />
        </div>
      </a-flex>
      <a-flex class="feedback_item" gap="middle" align="top">
        <div>{{$t("Repair_Content")}}：</div>
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
            @onFileUpload="(v) => fileUpload(v, 'feedback')"
            accept="image/jpeg,image/png,image/bmp"
            list-type="picture-card"
            :showUploadList="true"
          >
            <img src="@/assets/feedback_uploadimg.svg" alt="" />
          </Uploader>
        </div>
      </a-flex>
    </div>

    <a-modal
      width="50%"
      v-model:open="state.isShowIlkAreaDrawer"
      :title="$t('Repair_Area')"
      @ok="handleFilter"
      destroyOnClose
      :okText="$t('visitor_Confirm')"
      :cancelText="$t('cancel')"
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
