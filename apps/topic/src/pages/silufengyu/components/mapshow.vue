<template>
    <div class="m-mapshow">
        <div class="u-mapbox" v-for="(item, i) in list" :key="i" ref="mapbox">
            <img :src="buildImageUrl(item)" alt="地图" class="u-pic" />
            <div class="u-textbox">
                <span class="u-title">{{ item.title }}</span>
                <span class="u-desc">{{ item.desc }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Mapshow",
    inject: ["__imgRoot"],
    props: [],
    components: {},
    data: function () {
        return {
            list: [
                {
                    url: "002/mainpic1.png",
                    title: "河西瀚漠",
                    desc: "视线从中原转向有着沙漠和雪山的西域之地，打造前所未有的西域开放大世界！",
                },
                {
                    url: "002/mainpic2.png",
                    title: "西域！",
                    desc: "携手敦煌博物馆和非遗保护中心的赵虎主任细细雕琢出原汁原味的“丝绸之路”",
                },
                {
                    url: "002/mainpic3.png",
                    title: "开放！",
                    desc: "敦煌石窟、汉长城遗址、沙尘暴、哈密瓜田……独属于丝绸之路的风土人情将一幕幕展开，等你自由探索！",
                },
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {
        buildImageUrl(item) {
            return this.__imgRoot + item.url;
        },
        slideShow() {
            // 获取所有图片元素
            const mapbox_list = this.$refs.mapbox;
            // 当前显示的图片序号
            let currentIndex = 0;

            // 显示第一张图片
            showImage(currentIndex);

            // 每3秒切换一次图片
            setInterval(() => {
                // 隐藏当前图片
                hideImage(currentIndex);

                // 计算下一张图片的序号
                currentIndex = currentIndex === mapbox_list.length - 1 ? 0 : currentIndex + 1;

                // 显示下一张图片
                showImage(currentIndex);
            }, 3000);

            // 显示图片的函数
            function showImage(index) {
                mapbox_list[index].style.display = "block";
                // 短暂延迟后改变透明度，保过渡效果生效
                setTimeout(() => {
                    mapbox_list[index].style.opacity = "1";
                }, 50);
            }

            // 隐藏图片的函数
            function hideImage(index) {
                mapbox_list[index].style.opacity = "0";
                // 等待淡出动画完成后，将图片隐藏
                setTimeout(() => {
                    mapbox_list[index].style.display = "none";
                }, 300);
            }
        },
    },
    created: function () {},
    mounted: function () {
        this.slideShow();
    },
};
</script>

<style lang="less">
.m-mapshow {
    @w: 1000px;
    @h: 492px;
    .size(@w,@h);
    .auto(x);

    .u-mapbox {
        .size(@w,@h);
        position: absolute;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        transition-behavior: allow-discrete;
    }

    .u-pic {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .u-textbox {
        .size(480px,130px);
        background-color: #fdf5df;
        border: 1px solid #bb9031;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
        position: absolute;
        bottom: 33px;

        left: 50%;
        // margin-left:-240px;
        transform: translateX(-50%);

        text-align: center;
        color: #7a1f17;
    }

    .u-title {
        display: block;
        font-weight: 700;
        font-size: 24px;
        padding: 15px 0;
    }

    .u-desc {
        width: 390px;
        display: block;
        .auto(x);
    }

    // @keyframes mapFadeIn {
    //     from {
    //         opacity: 0;
    //     }
    //     to {
    //         opacity: 1;
    //     }
    // }
    // .fadeIn {
    //     animation: mapFadeIn 0.4s ease-in-out forwards;
    // }
}
</style>
