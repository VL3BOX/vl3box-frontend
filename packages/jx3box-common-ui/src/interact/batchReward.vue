<template>
  <div class="w-boxcoin-user">
      <el-button @click="openBoxcoinPop" type="primary" size="mini">Tặng thưởng hàng loạt</el-button>
      <el-dialog
          title="Đánh giá phẩm"
          :visible.sync="visible"
          custom-class="w-boxcoin-pop"
          :close-on-click-modal="false"
          append-to-body
      >
          <div class="w-boxcoin-admin-content">
              <div class="u-left">
                  <em class="u-label">Tình trạng tháng này</em>
                  Đã sử dụng<b>{{ this.used }}</b> Còn lại<b>{{ this.left }}</b> Tổng cộng<b>{{ this.total }}</b>
                  <el-progress
                      :percentage="this.total ? 100 - (this.used * 100 / this.total) : 0"
                      :stroke-width="15"
                      :text-inside="true"
                  ></el-progress>
              </div>
              <div class="u-list">
                  <em class="u-label">❤️ Phẩm</em>
                  <Contributors v-if="authors && authors.length" :authors="authors" @chosen="handleChosen" />
                  <div class="u-points">
                      <el-radio-group v-model="count">
                          <el-radio :label="item" v-for="item in fitPoints" :key="item" border>
                              <b>{{ item }}</b
                              >Hộp tiền
                          </el-radio>
                      </el-radio-group>
                  </div>
              </div>
              <div class="u-msg">
                  <em class="u-label">📝 Lời nhắn</em>
                  <div class="u-input">
                      <el-input
                          v-model="remark"
                          placeholder="请输入Lời nhắn（必填）"
                          :minlength="2"
                          :maxlength="30"
                          show-word-limit
                      ></el-input>
                      <el-button :disabled="fetchingCurrentRelease" @click="insertCurrentRelease"
                          >Chèn phiên bản hiện tại</el-button
                      >
                  </div>
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="visible = false">Hủy bỏ</el-button>
              <el-button type="primary" @click="submit" :disabled="!ready || submitting">Xác nhận</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
import { batchReward } from "../../service/thx.js";
import Contributors from "./Contributors.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";

export default {
  name: "BatchReward",
  props: [
      "boxcoin",
      "postType",
      "items",
      "own",
      "points",
      "authors",
      "client",
      "postId",
      "total",
      "max",
      "min",
      "category"
  ],
  components: {
      Contributors,
  },
  data: function () {
      return {
          visible: false,
          count: 0,

          remark: "辛苦，感谢！",
          left: this.own,
          chargeLink: "/vip/boxcoin?redirect=" + location.href,
          chosen: "", // 被选中的人

          submitting: false,
          fetchingCurrentRelease: false,
      };
  },
  computed: {
      used: function () {
          return this.total - this.left;
      },
      ready: function () {
          return this.isEnough && this.count && this.remark;
      },
      isEnough: function () {
          return this.left && this.left >= this.count;
      },
      allowBoxcoin: function () {
          return this.postType && this.authors && this.authors.length;
      },
      hostClient: function () {
          return location.href.includes("origin") ? "origin" : "std";
      },
      fitPoints: function () {
          return this.points.filter((item) => item <= this.left);
      },
  },
  watch: {
      own: function (val) {
          this.left = val;
      },
  },
  methods: {
      openBoxcoinPop: function () {
          if (!(this.items && this.items.length))
              return this.$message({ message: `请选择需要打赏的作品`, type: "warning" });
          this.visible = true;
      },
      // 选择要打赏的对象
      handleChosen(userId) {
          this.chosen = userId;
      },
      submit: function () {
          this.submitting = true;
          let client = this.client || this.hostClient;
        if (!['std', 'origin', 'all'].includes(client)) {
            client = 'std'
        }
          batchReward(this.postType, this.count, {
              items: this.items,
              remark: this.remark,
              client: client,
              redirect: this.category ? `/${this.category}/${this.postId}` : undefined,
          })
              .then((res) => {
                  return res.data.data;
              })
              .then((data) => {
                  // 1.扣除额度
                  data.success.map((item) => {
                      this.$message({
                          message: `作品${this.items[item.index].article_id}打赏成功`,
                          type: "success",
                      });
                      this.left -= this.count;
                  });
                  data.fail.map((item) => {
                      this.$message({
                          message: `作品${this.items[item.index].article_id}打赏失败,原因：${item.msg}`,
                          type: "error",
                      });
                  });
              })
              .finally(() => {
                  this.submitting = false;
                  this.visible = false;
              });
      },
      insertCurrentRelease: function () {
          this.fetchingCurrentRelease = true;
          getBreadcrumb(`current-release-${this.hostClient}`)
              .then((res) => {
                  this.remark += res;
              })
              .catch((err) => {
                  this.$message({
                      message: "获取失败",
                      type: "error",
                  });
              })
              .finally(() => {
                  this.fetchingCurrentRelease = false;
              });
      },
  },
};
</script>
