<script setup lang="ts">
import {computed, ref, useTemplateRef, watch} from "vue"
import {useElementBounding} from "@vueuse/core"

// TODO add boundary
// TODO add option to snap

const widgetTop = ref(0)
const widgetLeft = ref(0)

const dragAreaRef = useTemplateRef<HTMLElement>('dragArea')
const dragAreaBounding = useElementBounding(dragAreaRef)

const widgetRef = useTemplateRef<HTMLElement>('widget')
const widgetBounding = useElementBounding(widgetRef)

/**
 * offset to get widget's position from mouse position
 */
const mousePositionOffset = computed(() => {
    return {
        x: dragAreaBounding.x.value + widgetBounding.width.value / 2,
        y: dragAreaBounding.y.value + widgetBounding.height.value / 2,
    }
})

watch([dragAreaBounding.width, dragAreaBounding.height], ([width, height]) => {
    setWidgetPosition(width - 64, height - 32)
})

function setWidgetPosition(centerX: number, centerY: number) {
    const offset = mousePositionOffset.value
    widgetLeft.value = centerX - offset.x
    widgetTop.value = centerY - offset.y
}

function handleMouseDown(event: MouseEvent) {
    event.preventDefault()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(event: MouseEvent) {
    setWidgetPosition(event.clientX, event.clientY)
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
