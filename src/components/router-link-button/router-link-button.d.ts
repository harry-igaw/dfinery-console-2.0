import { NavigationFailure } from "vue-router";

export type RouterLinkButtonSize = "mini" | "small" | "medium" | "large";
export type RouterLinkButtonType =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "danger";

export interface RouterLinkButtonProps {
  routeName: string;
  size?: RouterLinkButtonSize;
  type?: RouterLinkButtonType;
  replace?: boolean;
  disabled?: boolean;
}

export interface RouterLinkButtonEmits {
  (e: "clicked", routePromise: Promise<NavigationFailure | void | undefined>): void;
}
