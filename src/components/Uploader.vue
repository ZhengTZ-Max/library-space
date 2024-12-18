<script setup>
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { getFileExtension } from "@/utils";

import PDFICON from "@/assets/common/pdfIcon.png";
import DOCICON from "@/assets/common/docIcon.png";

const MODE = import.meta.env.MODE;
const baseURL = MODE === "production" ? "/v4/Upload/index" : "/api/v4/Upload/index";

const token = sessionStorage.getItem("token") || "";
const emits = defineEmits(["onFileUpload"]);

const props = defineProps({
  filePath: String,
  initFileList: Array,
  showUploadList: Boolean,
});
const fileList = ref([]);

console.log(props.showUploadList);
watch(
  () => props.initFileList,
  (v) => {
    fileList.value = v?.map((e) => {
      return {
        ...e,
        status: "done",
        name: e?.file_name,
      };
    });
    initFileList();
    console.log(fileList);
  }
);

watch(
  () => fileList.value,
  (v) => {
    emits("onFileUpload", v);
  }
);

const handleChange = (info) => {
  if (info.file.status !== "uploading") {
    console.log(info.file, info.fileList);
  }

  let { status, response } = info.file;

  if (status === "done" && response?.code == 0) {
    message.success(`文件上传成功~`);
    // emits("onFileUpload", fileList?.value);
  } else if (info.file.status === "done" && response?.code != 0) {
    message.error(response?.message);
    fileList.value = [];
  } else if (info.file.status === "error") {
    message.error(`文件上传失败~`);
    fileList.value = [];
  }
  initFileList();
};

const headers = {
  authorization: `bearer${token}`,
};

const initFileList = () => {
  let list = fileList?.value;
  list = list.map((e) => {
    let type = getFileExtension(e?.name);
    if (type == "PDF") {
      e.url = PDFICON;
      e.thumbUrl = PDFICON;
    } else if (type == "WORD") {
      e.url = DOCICON;
      e.thumbUrl = DOCICON;
    } else if (type == "IMG") {
      e.url = e?.thumbUrl;
    }
    return e;
  });
  // console.log("fileList", fileList?.value);
};
</script>
<template>
  <div class="uploader" :class="{ noShowList: !showUploadList }">
    <a-upload
      v-bind="$attrs"
      v-model:file-list="fileList"
      name="file"
      :action="baseURL"
      :data="{
        path: filePath || '',
      }"
      :show-upload-list="showUploadList"
      :headers="headers"
      @change="handleChange"
    >
      <slot></slot>
    </a-upload>
  </div>
</template>
<style lang="less" scoped>
.uploader {
  &.noShowList {
    :deep(.ant-upload-list-item) {
      height: 48px !important;
      width: 75%;
      .ant-upload-list-item-image,
      .ant-upload-list-item-thumbnail {
        width: 32px !important;
        height: 32px !important;
      }
    }
  }
}
</style>
