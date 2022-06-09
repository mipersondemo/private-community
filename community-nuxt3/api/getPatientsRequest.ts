// @ts-ignore
import { reactive, ref } from "vue";
import Patient from "~~/types/Patient";
import http from "~~/api/useHttp";

export default function () {
  // 加载的状态
  const loading = ref(true);
  // 数据
  let patients = reactive<Patient[]>([]);
  // 错误信息
  const errorMsg = ref("");
  // 发送请求
  http
    .get("/patient/all")
    .then((response) => {
      // 改变加载状态
      loading.value = false;
      if (response.data.code === 200) {
        const result: Patient = response.data.data;
        if (result instanceof Array) {
          for (let i = 0; i < result.length; i++) {
            patients.push({
              id: result[i].id,
              name: result[i].name,
              sex: result[i].sex,
              age: result[i].age,
              contactName: result[i].contactName,
              contactPhone: result[i].contactPhone,
              createTime: result[i].createTime,
              lastUpdateTime: result[i].lastUpdateTime,
            });
          }
        }
      } else {
        errorMsg.value = response.data.message || "未知错误";
      }
    })
    .catch((error) => {
      // 改变加载状态
      loading.value = false;
      errorMsg.value = error.message || "未知错误";
    });
  return {
    loading,
    patients,
    errorMsg,
  };
}
