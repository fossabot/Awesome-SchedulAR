<template>
    <div id="class-list w-100">
        <div class="card-body p-0" tabindex="-1" @keyup.esc="$emit('close')">
            <div
                v-for="crs in courses"
                :key="crs.key"
                class="list-group list-group-flush w-100"
                @mouseenter="schedule.hover(crs.key)"
                @mouseleave="schedule.unhover(crs.key)"
            >
                <div class="list-group-item class-title py-1 px-0 w-100">
                    <div class="row flex-nowrap no-gutters justify-content-between">
                        <div class="col col-1 pl-1 align-self-center" @click="collapse(crs.key)">
                            <i class="fas click-icon" :class="expanded(crs.key)"></i>
                        </div>
                        <!-- push the last column to the right by mr-auto -->
                        <div
                            class="col-xs-auto mr-auto align-self-center"
                            style="cursor: pointer"
                            @click="collapse(crs.key)"
                        >
                            <h6 class="mb-1">
                                <span>{{ crs.department }} {{ crs.number }} {{ crs.type }} </span>
                            </h6>

                            <p
                                v-if="showClasslistTitle || isEntering"
                                style="font-size: 0.85rem; margin: 0;"
                            >
                                {{ crs.title }}
                            </p>
                        </div>
                        <div
                            class="col align-self-center"
                            :class="{
                                'text-center': showClasslistTitle,
                                'text-right': !showClasslistTitle,
                                'col-1': showClasslistTitle,
                                'col-xs-auto': !showClasslistTitle
                            }"
                        >
                            <i
                                data-toggle="modal"
                                data-target="#class-list-modal"
                                class="fas fa-info-circle click-icon"
                                :class="{ 'pr-2': !showClasslistTitle }"
                                title="View class description"
                                @click="$emit('trigger-classlist-modal', crs)"
                            ></i>
                            <br v-if="showClasslistTitle" />
                            <i
                                v-if="!isEntering"
                                class="fas fa-times click-icon"
                                :class="{ 'pr-1': !showClasslistTitle }"
                                title="Remove this class and all its sections from your schedule"
                                @click="$emit('remove_course', crs.key)"
                            ></i>
                        </div>
                    </div>
                </div>
                <Expand>
                    <div
                        v-if="expanded(crs.key) === 'fa-chevron-down'"
                        :id="`${crs.key}trans`"
                        class="trans"
                    >
                        <div
                            v-for="(sec, idx) in crs.sections"
                            :key="idx"
                            :class="{ show: isEntering && expandOnEntering }"
                        >
                            <a
                                v-if="!generated && idx === 0"
                                style="font-size: 1rem; padding: 0.5rem 0 0.5rem 1rem"
                                class="list-group-item list-group-item-action class-section"
                                :class="{ active: schedule.All[crs.key] === -1 }"
                                :title="
                                    schedule.All[crs.key] === -1
                                        ? 'click to unselect'
                                        : 'click to select'
                                "
                                @click="select(crs.key, -1)"
                            >
                                <div class="row no-gutters justify-content-between">
                                    <div class="col-md-auto">Any Section</div>
                                    <div class="col col-sm-1 align-self-center">
                                        <i
                                            v-if="schedule.All[crs.key] === -1"
                                            class="far fa-check-square"
                                        ></i>
                                        <i v-else class="far fa-square"></i>
                                    </div>
                                </div>
                            </a>
                            <!-- we want to reduce the number of schedule computations. so we use mouseenter instead of mouseover -->
                            <div
                                class="list-group-item list-group-item-action container-fluid class-section"
                                :class="{ active: isActive(crs.key, crs.sids[idx]) }"
                                :title="
                                    isActive(crs.key, crs.sids[idx])
                                        ? 'click to unselect'
                                        : 'click to select'
                                "
                                @click="select(crs.key, crs.sids[idx])"
                                @mouseenter="preview(crs.key, crs.sids[idx])"
                                @mouseleave="removePreview()"
                            >
                                <div class="row no-gutters justify-content-between">
                                    <div class="col-md-auto">
                                        <ul
                                            class="list-unstyled class-info"
                                            style="font-size: 0.75rem;"
                                        >
                                            <li>Section {{ sec.section }} {{ sec.topic }}</li>
                                            <template v-for="(meeting, j) in sec.meetings">
                                                <li :key="j">
                                                    {{ meeting.days }}
                                                </li>
                                            </template>
                                            <li>
                                                {{ sec.instructors.join(', ') }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col col-sm-1 align-self-center">
                                        <i
                                            v-if="isActive(crs.key, crs.sids[idx])"
                                            class="far fa-check-square"
                                        ></i>
                                        <i v-else class="far fa-square"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Expand>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./ClassList.ts"></script>

<style scoped>
.click-icon {
    color: #555555;
}

.trans {
    overflow: hidden;
}
.subtitle {
    font-size: 0.7rem;
    margin-top: 0;
    margin-bottom: 0;
}

.active {
    color: white !important;
}

.class-title {
    padding: 0.25rem;
}

.class-section {
    padding: 0.1rem 0 0.1rem 1rem;
    margin: 0;
    cursor: pointer;
}

.class-info {
    margin: 0;
}

.expand-icon {
    width: 10%;
}
</style>
