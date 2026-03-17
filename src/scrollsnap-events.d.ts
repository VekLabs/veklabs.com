declare module "scrollsnap-events/core" {
  export function getSnapTargetVertical(
    container: HTMLElement,
  ): HTMLElement | null;
  export function getSnapTargetHorizontal(
    container: HTMLElement,
  ): HTMLElement | null;
}
