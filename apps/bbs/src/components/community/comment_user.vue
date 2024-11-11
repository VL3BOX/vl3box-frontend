<template>
    <div class="m-comment-user c-author">
        <AuthorInfo :uid="uid" @ready="installModules" />
        <template v-if="data">
            <div class="u-interact">
                <AuthorFollow v-if="!isMaster" style="margin-right: 8px" :uid="uid" />
                <AuthorRss v-else style="margin-right: 8px" :uid="uid" />
                <!-- <AuthorGift :uid="uid" /> -->
                <el-button icon="el-icon-message" class="u-btn" size="mini" @click="onMessage">私信</el-button>
            </div>
            <!-- <AuthorMsg :uid="uid" /> -->
            <!-- <AuthorLink class="u-block u-links" :uid="uid" :data="data" /> -->
            <AuthorMedals class="u-block u-trophy" :uid="uid" />
            <!-- <AuthorTeams class="u-block u-teams" :uid="uid" /> -->
            <!-- <AuthorFans class="u-block u-fans" :uid="uid" /> -->
            <slot></slot>
            <!-- <AuthorPosts class="u-block u-posts" :uid="uid" /> -->
        </template>
    </div>
</template>

<script>
import AuthorInfo from "@jx3box/jx3box-common-ui/src/author/AuthorInfo.vue";
// import AuthorLink from "@jx3box/jx3box-common-ui/src/author/AuthorLink.vue";
import AuthorFollow from "@jx3box/jx3box-common-ui/src/author/AuthorFollow.vue";
// import AuthorMsg from "@jx3box/jx3box-common-ui/src/author/AuthorMsg.vue";
// import AuthorGift from "@jx3box/jx3box-common-ui/src/author/AuthorGift.vue";
// import AuthorFans from "@jx3box/jx3box-common-ui/src/author/AuthorFans.vue";
import AuthorMedals from "@jx3box/jx3box-common-ui/src/author/AuthorMedals.vue";
// import AuthorTeams from "@jx3box/jx3box-common-ui/src/author/AuthorTeams.vue";
// import AuthorPosts from "@jx3box/jx3box-common-ui/src/author/AuthorPosts.vue";
import AuthorRss from "@jx3box/jx3box-common-ui/src/author/AuthorRss.vue";
export default {
    props: ["uid", "isMaster"],
    data: function () {
        return {
            data: "",
        };
    },
    methods: {
        installModules: function (data) {
            this.data = data;
        },
        onMessage: function () {
            window.open("/dashboard/letter?receiver=" + this.uid, "_blank");
        },
    },
    components: {
        AuthorInfo,
        // AuthorLink,
        AuthorFollow,
        // AuthorMsg,
        // AuthorGift,
        AuthorMedals,
        // AuthorTeams,
        // AuthorPosts,
        // AuthorFans,
        AuthorRss,
    },
};
</script>

<style lang="less">
.m-comment-user {
    position: sticky;
    top: 130px;
}

@media screen and (max-width: @ipad) {
    .m-comment-user {
        position: unset;
        .c-author-honor,
        .u-bio,
        .c-author-medals,
        .u-interact {
            display: none;
        }
        .u-info {
            height: 48px;
        }
        .c-avatar.s {
            .c-avatar-pic {
                width: 48px;
                height: 48px;
            }
            .c-avatar-frame {
                width: 58px;
                height: 58px;
                left: 40px;
                top: 40px;
            }
        }

        .u-avatar {
            width: 48px;
            height: 48px;
        }
    }
}
</style>
