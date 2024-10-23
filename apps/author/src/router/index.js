import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    { path: "/:id(\\d+)", name: "index", component: () => import("@/views/Index.vue") },
    { path: "/birthday", name: "birthday", component: () => import("@/views/Birthday.vue") },
    { path: "/:uid(\\d+)/certificate/:id(\\d+)", name: "certificate", component: () => import("@/views/certificate.vue") },
    { path: "/:uid(\\d+)/groupCertificate/:id(\\d+)", name: "groupCertificate", component: () => import("@/views/groupCertificate.vue") },
];

const router = new VueRouter({
    routes,
    mode: "history",
    base: "/author"
});

export default router;
