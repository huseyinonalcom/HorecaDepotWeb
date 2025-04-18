import { Children, cloneElement, isValidElement } from "react";

export function TriggerMenu({
  children,
  triggerMenu,
}: {
  children: React.ReactNode;
  triggerMenu: (show: boolean) => void;
}) {
  const enhancedChildren = Children.map(children, (child) =>
    isValidElement(child) ? cloneElement(child, { triggerMenu }) : child,
  );

  return <div>{enhancedChildren}</div>;
}
