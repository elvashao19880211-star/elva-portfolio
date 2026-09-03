"use client"

import { useEffect } from "react"

/**
 * 图片防保存（防君子不防小人）：
 * - 禁用图片上的右键菜单（"图片另存为"入口）
 * - 禁止拖拽图片（拖到桌面/文件夹保存）
 * 配合 globals.css 中的 -webkit-touch-callout / user-drag 处理移动端长按保存。
 * 仅拦截 <img> 元素，不影响页面其它右键功能（复制文字、新标签打开链接等）。
 */
export default function ImageProtect() {
  useEffect(() => {
    const isImage = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (!t) return false
      return t.tagName === "IMG" || !!t.closest?.("img")
    }

    const onContextMenu = (e: Event) => {
      if (isImage(e)) e.preventDefault()
    }
    const onDragStart = (e: Event) => {
      if (isImage(e)) e.preventDefault()
    }

    document.addEventListener("contextmenu", onContextMenu)
    document.addEventListener("dragstart", onDragStart)
    return () => {
      document.removeEventListener("contextmenu", onContextMenu)
      document.removeEventListener("dragstart", onDragStart)
    }
  }, [])

  return null
}
