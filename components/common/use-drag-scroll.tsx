import { useState, useCallback, useEffect, SetStateAction } from "react";

export const useDragScroll = () => {
  const [node, setNode] = useState<HTMLElement>(null!);

  const ref = useCallback((nodeEle: SetStateAction<HTMLElement>) => {
    setNode(nodeEle);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (!node) {
        return;
      }
      const startPos = {
        left: node.scrollLeft,
        top: node.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        node.scrollTop = startPos.top - dy;
        node.scrollLeft = startPos.left - dx;
        updateCursor(node);
      };

      const handleMouseUp = () => {
        e.preventDefault();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        resetCursor(node);
      };

      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });
    },
    [node],
  );

  // const handleTouchStart = useCallback(
  //   (e: TouchEvent) => {
  //     if (!node) {
  //       return;
  //     }
  //     const touch = e.touches[0];
  //     const startPos = {
  //       left: node.scrollLeft,
  //       top: node.scrollTop,
  //       x: touch.clientX,
  //       y: touch.clientY,
  //     };

  //     const handleTouchMove = (e: TouchEvent) => {
  //       const touch = e.touches[0];
  //       const dx = touch.clientX - startPos.x;
  //       const dy = touch.clientY - startPos.y;
  //       node.scrollTop = startPos.top - dy;
  //       node.scrollLeft = startPos.left - dx;
  //       updateCursor(node);
  //     };

  //     const handleTouchEnd = () => {
  //       document.removeEventListener("touchmove", handleTouchMove);
  //       document.removeEventListener("touchend", handleTouchEnd);
  //       resetCursor(node);
  //     };

  //     document.addEventListener("touchmove", handleTouchMove, {
  //       passive: true,
  //     });
  //     document.addEventListener("touchend", handleTouchEnd, { passive: true });
  //   },
  //   [node],
  // );

  const updateCursor = (ele: HTMLElement) => {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";
  };

  const resetCursor = (ele: HTMLElement) => {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");
  };

  useEffect(() => {
    if (!node) {
      return;
    }
    node.addEventListener("mousedown", handleMouseDown, { passive: true });
    // node.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      node.removeEventListener("mousedown", handleMouseDown);
      // node.removeEventListener("touchstart", handleTouchStart);
    };
  }, [node]);

  return [ref];
};
