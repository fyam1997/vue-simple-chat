<script setup lang="ts">
import {computed, ref, useTemplateRef, watch} from "vue"
import {clamp, useElementBounding} from "@vueuse/core"

// TODO add option to snap
// TODO handle touch

const widgetTop = ref(0)
const widgetLeft = ref(0)

const dragAreaRef = useTemplateRef<HTMLElement>('dragArea')
const dragAreaBounding = useElementBounding(dragAreaRef)

const widgetRef = useTemplateRef<HTMLElement>('widget')
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


watch([dragAreaBounding.width, dragAreaBounding.height], ([width, height]) => {
    setWidgetPosition({x: width - 64, y: height - 64})
})

/**
 * @param position - new top left position of the widget
 */
function setWidgetPosition(position: { x: number, y: number }) {
    const boundaryValue = boundary.value
    widgetLeft.value = clamp(position.x, boundaryValue.left, boundaryValue.right)
    widgetTop.value = clamp(position.y, boundaryValue.top, boundaryValue.bottom)
}

function mouseToWidgetPosition(event: MouseEvent) {
    const offset = mousePositionOffset.value
    return {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
    }
}

function handleMouseDown(event: MouseEvent) {
    event.preventDefault()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(event: MouseEvent) {
    setWidgetPosition(mouseToWidgetPosition(event))
}

function handleMouseUp() {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
}
</script>
<template>
    <div
        ref="dragArea"
        class="movable-area"
    >
        <div ref="widget"
             class="movable-widget"
             @mousedown="handleMouseDown"
        >
            <slot/>
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
    top: v-bind(widgetTop+ 'px');
    left: v-bind(widgetLeft+ 'px');
}
</style>
