<template>
    <div
        class="courseBlock"
        :class="{ 'block-strong': scheduleBlock.strong }"
        :style="{
            'margin-top': startPx + 'px',
            height: endPx - startPx + 'px',
            'background-color': scheduleBlock.backgroundColor
        }"
        @click="showModal"
    >
        <div v-if="!mobile">
            <div v-if="isSection">
                <div class="mt-2 ml-2" style="color:white; font-size:13px">
                    {{ firstSec.department }} {{ firstSec.number }}-{{ firstSec.section }}
                    {{ firstSec.type }}
                </div>
                <div v-if="showInstructor" class="ml-2 crs-info">
                    {{ firstSec.instructors.join(', ') }}
                </div>
                <div v-if="showRoom && room" class="ml-2 crs-info">
                    {{ room }}
                </div>
                <template v-if="showTime">
                    <div v-for="(meeting, idx) in firstSec.meetings" :key="idx">
                        <div v-if="showTime" class="ml-2 crs-info">
                            {{ meeting.days }}
                        </div>
                    </div>
                </template>
            </div>
            <div v-if="isCourse">
                <div class="mt-2 ml-2" style="color:white; font-size:13px">
                    {{ firstSec.department }}
                    {{ firstSec.number }}-{{ firstSec.section }} +{{
                        scheduleBlock.section.sections.length - 1
                    }}
                    {{ firstSec.type }}
                </div>
                <template v-if="showTime">
                    <div v-for="(meeting, idx) in firstSec.meetings" :key="idx">
                        <div v-if="showTime" class="ml-2 crs-info">
                            {{ meeting.days }}
                        </div>
                    </div>
                </template>
                <div v-if="showInstructor" class="ml-2 crs-info">
                    {{ firstSec.instructors.join(', ') }} and
                    {{
                        scheduleBlock.section.sections.reduce(
                            (acc, x) => acc + x.instructors.length,
                            0
                        ) - 1
                    }}
                    more
                </div>
                <div v-if="showRoom" class="ml-2 crs-info">
                    {{ firstSec.meetings[0].room }} and
                    {{ scheduleBlock.section.sections.length - 1 }} more
                </div>
            </div>
            <div v-if="isEvent">
                <div class="ml-2 mt-2">
                    {{ scheduleBlock.section.title }}
                </div>
                <div class="ml-2 crs-info">
                    {{ scheduleBlock.section.days }}<br />
                    {{ scheduleBlock.section.room }}
                </div>
                <div class="ml-2 crs-info" v-html="scheduleBlock.section.description"></div>
            </div>
        </div>
        <div v-else class="mt-2 ml-2" style="color:white; font-size:10px">
            <div v-if="isSection">
                {{ firstSec.department }} <br />
                {{ firstSec.number }} <br />
                {{ firstSec.section }}
            </div>
            <div v-if="isCourse">
                {{ firstSec.department }} <br />
                {{ firstSec.number }} <br />
                {{ firstSec.section }} +{{ scheduleBlock.section.length - 1 }}
            </div>
            <div v-if="isEvent">
                {{ scheduleBlock.section.days }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./CourseBlock.ts"></script>

<style scoped>
.courseBlock {
    z-index: 2;
    color: white;
    cursor: pointer;
    overflow-y: hidden;
    overflow-x: hidden;
    position: absolute;
}

.block-strong {
    box-shadow: 0 4px 12px 4px rgba(0, 0, 0, 0.5);
}

.courseBlock:hover {
    box-shadow: 0 4px 12px 4px rgba(0, 0, 0, 0.5);
}

.crs-info {
    color: #eaeaea;
    font-size: 11px;
}
</style>
