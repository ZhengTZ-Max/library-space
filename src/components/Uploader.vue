<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
const MODE = import.meta.env.MODE;
const baseURL = MODE === "production" ? "/" : "/api/v4/Upload/index";

const token = sessionStorage.getItem("token") || "";
const emits = defineEmits(["onFileUpload"]);

const props = defineProps({
  filePath: String,
});
const handleChange = (info) => {
  if (info.file.status !== "uploading") {
    console.log(info.file, info.fileList);
  }

  let { status, response } = info.file;

  if (status === "done" && response?.code == 0) {
    message.success(`文件上传成功~`);
    emits("onFileUpload", response?.data);
  } else if (info.file.status === "done" && response?.code != 0) {
    message.error(response?.message);
    fileList.value = [];
  } else if (info.file.status === "error") {
    message.error(`文件上传失败~`);
    fileList.value = [];
  }
};
const fileList = ref([]);

const headers = {
  authorization: `bearer${token}`,
};
</script>
<template>
  <div class="uploader">
    <a-upload
      v-bind="$attrs"
      v-model:file-list="fileList"
      name="file"
      :action="baseURL"
      :data="{
        path: filePath || '',
      }"
      :headers="headers"
      @change="handleChange"
    >
      <slot></slot>
    </a-upload>
  </div>
</template>
<style lang="less" scoped>
.uploader {
}
</style>
