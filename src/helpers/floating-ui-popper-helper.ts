// 1. popper를 만든다
// 만들 때 옵션 - popper element, reference element, position, update 여부

import {
  autoUpdate,
  computePosition,
  ComputePositionConfig,
  ComputePositionReturn,
} from "@floating-ui/dom";
import { AutoUpdateOptions } from "@floating-ui/dom/src/autoUpdate";

type CleanUpPopper = () => void;

interface CreateFloatingUIPopperReturnModel {
  positionReturn: ComputePositionReturn;
  destroy: CleanUpPopper;
}

export async function createFloatingUIPopper(
  referenceElement: HTMLElement,
  popperElement: HTMLElement,
  options?: Partial<ComputePositionConfig>,
  updateOptions?: AutoUpdateOptions,
): Promise<CreateFloatingUIPopperReturnModel> {
  if (!referenceElement) {
    return Promise.reject("Reference element is not valid");
  }
  if (!popperElement) {
    return Promise.reject("Popper element is not valid");
  }

  const createPopper = () =>
    computePosition(referenceElement, popperElement, options);
  const positionReturn = await createPopper();
  let cleanUpPopper: CleanUpPopper = () => undefined;
  if (updateOptions) {
    cleanUpPopper = autoUpdate(
      referenceElement,
      popperElement,
      createPopper,
      updateOptions,
    );
  }
  return { positionReturn, destroy: cleanUpPopper };
}
