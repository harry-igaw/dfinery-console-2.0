import { reactive, ref } from "vue";
import { DfnFormInstance } from "@/components/dfn-form/dfn-form";

export function useDfnForm<T>(defaultFormModel: T) {
  const dfnFormRef = ref<DfnFormInstance<T>>();

  const formModel = reactive<{ value: T }>({ value: defaultFormModel });

  function submit(): Promise<T> {
    if (dfnFormRef.value) {
      return dfnFormRef.value?.submit();
    }
    return Promise.reject("FormRef is undefined");
  }

  return {
    dfnFormRef,
    formModel: formModel.value,
    submit,
  };
}
