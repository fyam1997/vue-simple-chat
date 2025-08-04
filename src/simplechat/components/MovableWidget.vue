<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import { clamp, useElementBounding } from "@vueuse/core"

// TODO add option to snap or not
// TODO add drag handle, maybe with a class

const widgetTop = ref(0)
const widgetLeft = ref(0)

const dragAreaRef = useTemplateRef<HTMLElement>("dragArea")
const dragAreaBounding = useElementBounding(dragAreaRef)

const widgetRef = useTemplateRef<HTMLElement>("widget")
const widgetBounding = useElementBounding(widgetRef)

/**
 * offset to get widget's top left position from mouse position
 */
const mousePositionOffset = computed(() => {
    return {
        x: dragAreaBounding.x.value + widgetBounding.width.value / 2,
        y: dragAreaBounding.y.value + widgetBounding.height.value / 2,
    }
})

/**
 * boundary of widget's top left position, relative to area
 */
const boundary = computed(() => {
    const areaWidth = dragAreaBounding.width.value
    const areaHeight = dragAreaBounding.height.value
    const widgetWidth = widgetBounding.width.value
    const widgetHeight = widgetBounding.height.value

    return {
        top: 0,
        left: 0,
        bottom: areaHeight - widgetHeight,
        right: areaWidth - widgetWidth,
    }
})
watch([dragAreaBounding.width, dragAreaBounding.height], () => {
    snap(false)
})

/**
 * @param position - new top left position of the widget
 */
function setWidgetPosition(position: { x: number; y: number }) {
    const boundaryValue = boundary.value
    widgetLeft.value = clamp(
        position.x,
        boundaryValue.left,
        boundaryValue.right,
    )
    widgetTop.value = clamp(position.y, boundaryValue.top, boundaryValue.bottom)
}

function mouseToWidgetPosition(event: MouseEvent | Touch) {
    const offset = mousePositionOffset.value
    return {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
    }
}

function snap(isLeft: boolean) {
    const padding = 32
    if (isLeft) {
        setWidgetPosition({
            x: padding,
            y:
                dragAreaBounding.height.value -
                widgetBounding.height.value -
                padding,
        })
    } else {
        setWidgetPosition({
            x:
                dragAreaBounding.width.value -
                widgetBounding.width.value -
                padding,
            y:
                dragAreaBounding.height.value -
                widgetBounding.height.value -
                padding,
        })
    }
}

function handleMouseDown(event: TouchEvent | MouseEvent) {
    event.preventDefault()
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchmove", handleMouseMove)
    window.addEventListener("touchend", handleMouseUp)
}

function handleMouseMove(event: TouchEvent | MouseEvent) {
    if (event instanceof MouseEvent) {
        setWidgetPosition(mouseToWidgetPosition(event))
    } else {
        if (event.touches.length > 0) {
            setWidgetPosition(mouseToWidgetPosition(event.touches[0]))
        }
    }
}

function handleMouseUp(event: TouchEvent | MouseEvent) {
    if (event instanceof MouseEvent) {
        snap(
            event.clientX <
                dragAreaBounding.x.value + dragAreaBounding.width.value / 2,
        )
    } else {
        if (event.touches.length === 0 && event.changedTouches.length > 0) {
            const touch = event.changedTouches[0]
            snap(
                touch.clientX <
                    dragAreaBounding.x.value + dragAreaBounding.width.value / 2,
            )
        }
    }
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
    window.removeEventListener("touchmove", handleMouseMove)
    window.removeEventListener("touchend", handleMouseUp)
}
</script>
<template>
    <div ref="dragArea" class="movable-area">
        <div
            ref="widget"
            class="movable-widget"
            @mousedown="handleMouseDown"
            @touchstart="handleMouseDown"
        >
            <slot />
        </div>
    </div>
</template>
<style scoped>
.movable-area {
    pointer-events: none;
    position: relative;
}

.movable-widget {
    pointer-events: auto;
    position: absolute;
    top: v-bind(widgetTop + "px");
    left: v-bind(widgetLeft + "px");
}
</style>
