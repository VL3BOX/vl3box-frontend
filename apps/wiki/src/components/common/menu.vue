<template>
    <div>
        <div class="m-menus">
            <a
                class="u-menu"
                :class="pathname.indexOf(menu.value) > -1 && 'is-active'"
                v-for="menu in menus"
                :key="menu.value"
                :href="`/${menu.value}`"
            >
                {{ menu.label }}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "CommonMenu",
    data() {
        return {
            menus: [
                {
                    label: "Thành tựu",
                    value: "cj",
                },
                {
                    label: "Vật phẩm",
                    value: "item",
                },
                {
                    label: "Nhiệm vụ",
                    value: "quest",
                },
                {
                    label: "Kiến thức chung",
                    value: "knowledge",
                },
            ],
        };
    },
    computed: {
        pathname() {
            return location.pathname;
        },
    },
};
</script>
