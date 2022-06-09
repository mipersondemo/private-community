// @ts-ignore
import { reactive, ref } from "vue";
import { useStore } from '~~/stores/userState';
import Paper from "~~/types/Paper";
import Question from "~~/types/Question";
import http from "~~/api/useHttp";

interface paperResult {
  id: number;
  name: string;
  registerTime: string;
  endTime: string;
  version: number;
  status: number;
  detail: string;
}

export default function () {
  // 加载的状态
  const loading = ref(true);
  // 数据
  let papers = reactive<Paper[]>([]);
  // 错误信息
  const errorMsg = ref("");
  //  缓存
  const store = useStore();
  // 发送请求
  http
    .get("/paper/publish/all")
    .then((response) => {
      // 改变加载状态
      loading.value = false;
      if (response.data.code === 200) {
        const result: paperResult = response.data.data;
        if (result instanceof Array) {
          for (let i = 0; i < result.length; i++) {
            const questions: Array<Question> = JSON.parse(result[i].detail);
            result[i].questions = questions;
            papers.push({
              id: result[i].id,
              name: result[i].name,
              registerTime: result[i].registerTime,
              endTime: result[i].endTime,
              version: result[i].version,
              questions: result[i].questions,
            });
          }
          store.setPapers(papers);
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
    papers,
    errorMsg,
  };
}
