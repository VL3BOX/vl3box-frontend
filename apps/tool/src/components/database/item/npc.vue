<template>
    <div class="m-database-item__npc">
        <div class="m-item">
            <div class="u-title">
                <div class="u-name">
                    <span class="u-name-primary">{{ data.Name }}</span>
                    <span class="u-name-secondary" v-if="data.BuffName"> ({{ data.BuffName }})</span>
                </div>
                <span class="u-name-add">
                    <span v-if="data.Title || data.Level">&lt;</span>
                    <span class="u-nick" v-if="data.Title">
                        {{ data.Title }}
                    </span>
                    <span v-if="data.Title && data.Level">·</span>
                    <b class="u-level" v-if="data.Level">{{ data.Level }}</b>
                    <span v-if="data.Title || data.Level">&gt;</span>
                </span>
                <div class="u-base">
                    <span class="u-map" v-if="data.MapName">
                        {{ data.MapName }}
                    </span>
                    <span class="u-intensity" v-if="data.Intensity">
                        <span>Cường độ</span>
                        <span>{{ data.Intensity }}</span>
                    </span>
                </div>
                <div>
                    <span v-if="refCount" class="u-ref-count">
                        <i class="el-icon-connection"></i> Chỉ số trích dẫn {{ refCount }}</span
                    >
                    <Mark
                        class="u-id"
                        BGL="#333"
                        :value="'ID:' + data.ID"
                        :key="data.ID"
                        title="Nhấn để sao chép nhanh"
                        @click.native.stop="copy('ID')"
                    />
                </div>
            </div>
            <div class="u-primary">
                <div class="u-life">
                    <img class="u-desc-icon u-desc-icon-life" svg-inline src="@/assets/img/database/energy.svg" />
                    <b>Máu (Huyết lượng)</b>
                    <em>MaxLife</em>
                    <strong>{{ data.MaxLife }}</strong>
                </div>
                <div class="u-mana">
                    <img class="u-desc-icon u-desc-icon-mana" svg-inline src="@/assets/img/database/energy.svg" />
                    <b>Nội lực</b>
                    <em>MaxMana</em>
                    <strong>{{ data.MaxMana }}</strong>
                </div>
                <div class="u-speed" v-if="data.RunSpeed || data.WalkSpeed">
                    <img class="u-desc-icon u-desc-icon-speed" svg-inline src="@/assets/img/database/speed.svg" />
                    <b>Tốc độ chạy</b>
                    <em>RunSpeed</em>
                    <strong>{{ data.RunSpeed || data.WalkSpeed }}</strong>
                </div>
                <div class="u-touch" v-if="data.TouchRange">
                    <img class="u-desc-icon u-desc-icon-touch" svg-inline src="@/assets/img/database/radar.svg" />
                    <b>Phạm vi</b>
                    <em>TouchRange</em>
                    <strong>{{ data.TouchRange }}</strong>
                </div>
                <div class="u-sense" v-if="data.Sense">
                    <img class="u-desc-icon u-desc-icon-sense" svg-inline src="@/assets/img/database/sight.svg" />
                    <b>Nhận diện (Thức phá)</b>
                    <em>Sense</em>
                    <strong>{{ data.Sense }}</strong>
                </div>
                <div class="u-dodge" v-if="data.Dodge">
                    <img class="u-desc-icon u-desc-icon-dodge" svg-inline src="@/assets/img/database/miss.svg" />
                    <b>Tránh né (Thiểm tỵ)</b>
                    <em>Dodge</em>
                    <strong>{{ data.Dodge }}</strong>
                </div>
                <div class="u-dodge" v-if="data.Parry">
                    <img class="u-desc-icon u-desc-icon-dodge" svg-inline src="@/assets/img/database/miss.svg" />
                    <b>Đỡ đòn (Chiêu giá)</b>
                    <em>Parry</em>
                    <strong>{{ data.ParryValue }}</strong>
                </div>
                <div class="u-shield">
                    <img class="u-desc-icon u-desc-icon-shield" svg-inline src="@/assets/img/database/shield.svg" />
                    <b>Phòng ngự</b>
                    <em>Shield</em>
                    <span class="u-prop-item">
                        外功Phòng ngự
                        <em>PhysicsShieldBase</em>
                        <span class="u-value">{{ ~~data.PhysicsShieldBase }}</span>
                    </span>
                    <span class="u-prop-item">
                        混元Phòng ngự
                        <em>NeutralMagicDefence</em>
                        <span class="u-value">{{ ~~data.NeutralMagicDefence }}</span>
                    </span>
                    <span class="u-prop-item">
                        阳性Phòng ngự
                        <em>SolarMagicDefence</em>
                        <span class="u-value">{{ ~~data.SolarMagicDefence }}</span>
                    </span>
                    <span class="u-prop-item">
                        阴性Phòng ngự
                        <em>LunarMagicDefence</em>
                        <span class="u-value">{{ ~~data.LunarMagicDefence }}</span>
                    </span>
                    <span class="u-prop-item">
                        毒性Phòng ngự
                        <em>PoisonMagicDefence</em>
                        <span class="u-value">{{ ~~data.PoisonMagicDefence }}</span>
                    </span>
                </div>
                <div class="u-critical">
                    <img class="u-desc-icon u-desc-icon-attack" svg-inline src="@/assets/img/database/attack.svg" />
                    <b>Bạo kích (Hội tâm)</b>
                    <em>Critical</em>
                    <span class="u-prop-item">
                        外功Bạo kích (Hội tâm)
                        <em>PhysicsCriticalStrike</em>
                        <span class="u-value">{{ ~~data.PhysicsCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        混元Bạo kích (Hội tâm)
                        <em>NeutralCriticalStrike</em>
                        <span class="u-value">{{ ~~data.NeutralCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        阳性Bạo kích (Hội tâm)
                        <em>SolarCriticalStrike</em>
                        <span class="u-value">{{ ~~data.SolarCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        阴性Bạo kích (Hội tâm)
                        <em>LunarCriticalStrike</em>
                        <span class="u-value">{{ ~~data.LunarCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        毒性Bạo kích (Hội tâm)
                        <em>PoisonCriticalStrike</em>
                        <span class="u-value">{{ ~~data.PoisonCriticalStrike }}</span>
                    </span>
                </div>
                <div class="u-attack">
                    <img class="u-desc-icon u-desc-icon-attack" svg-inline src="@/assets/img/database/target.svg" />
                    <b>Trúng đích (Mệnh trung)</b>
                    <em>Attack</em>
                    <span class="u-prop-item">
                        外功Trúng đích (Mệnh trung)
                        <em>PhysicsAttackHit</em>
                        <span class="u-value">{{ ~~data.PhysicsAttackHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        混元Trúng đích (Mệnh trung)
                        <em>NeutralMagicHit</em>
                        <span class="u-value">{{ ~~data.NeutralMagicHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        阳性Trúng đích (Mệnh trung)
                        <em>SolarMagicHit</em>
                        <span class="u-value">{{ ~~data.SolarMagicHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        阴性Trúng đích (Mệnh trung)
                        <em>LunarMagicHit</em>
                        <span class="u-value">{{ ~~data.LunarMagicHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        毒性Trúng đích (Mệnh trung)
                        <em>PoisonMagicHit</em>
                        <span class="u-value">{{ ~~data.PoisonMagicHit }}</span>
                    </span>
                </div>
            </div>
            <el-button
                v-if="showDetail"
                class="u-props-toggle"
                :class="{ 'is-active': showProps }"
                @click="toggleProps"
            >
                <i class="el-icon-view"></i>
                <span v-if="showProps">Thu gọn thuộc tính</span>
                <span v-else>Xem thuộc tính</span>
            </el-button>
        </div>
        <!-- 项目详情，仅在单页展示 -->
        <template v-if="showDetail">
            <!-- 详细字段列表 -->
            <div class="m-detail" v-if="showProps">
                <template v-for="(val, key) in data">
                    <span class="u-prop" :key="key" v-if="val">
                        <el-tooltip v-if="fieldLabel(key)" effect="dark" :content="key" placement="top">
                            <em>{{ fieldLabel(key) }}</em>
                        </el-tooltip>
                        <em v-else>{{ key }}</em>
                        {{ val }}
                    </span>
                </template>
            </div>
            <!-- 项目操作 -->
            <div class="m-operation" v-if="isLogin">
                <el-button
                    v-if="!star_id"
                    class="u-button u-star"
                    icon="el-icon-star-off"
                    plain
                    @click="star('npc', data.ID)"
                >
                    Lưu dữ liệu
                </el-button>
                <el-button
                    v-else-if="isLogin"
                    class="u-button u-stared"
                    icon="el-icon-star-on"
                    plain
                    @click="cancelStar"
                >
                    Hủy lưu
                </el-button>
                <el-button
                    class="u-button u-to-dbm"
                    icon="el-icon-connection"
                    plain
                    @click="toDbm('npc', data.ID, data.Level)"
                >
                    Xây dựng trực tuyến
                </el-button>
            </div>
        </template>
    </div>
</template>
<script>
import itemMixin from "./mixin";

export default {
    name: "ItemNpc",
    mixins: [itemMixin],
};
</script>
<style lang="less">
@import "~@/assets/css/database/item.less";
</style>
