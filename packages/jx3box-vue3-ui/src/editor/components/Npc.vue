<template>
    <div class="w-npc" v-if="data">
        <div class="w-npc-wrapper">
            <div class="w-npc-content">
                <div class="u-npc">
                    <div class="u-title">
                        <span class="u-name">{{ data.Name }}</span>
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
                            <span class="u-atmap" v-if="data.MapName">
                                {{ data.MapName }}
                            </span>
                            <span class="u-intensity" v-if="data.Intensity">
                                Cường độ
                                {{ data.Intensity }}
                            </span>
                        </div>
                    </div>
                    <div class="u-primary">
                        <div class="u-life">
                            <img class="u-descicon u-descicon-life" svg-inline src="../../../assets/img/npc/energy.svg" />
                            <b>Máu</b>
                            <em>MaxLife</em>
                            <strong>{{ data.MaxLife }}</strong>
                        </div>
                        <div class="u-mana">
                            <img class="u-descicon u-descicon-mana" svg-inline src="../../../assets/img/npc/energy.svg" />
                            <b>Nội lực</b>
                            <em>MaxMana</em>
                            <strong>{{ data.MaxMana }}</strong>
                        </div>
                        <div class="u-touch" v-if="data.TouchRange">
                            <img class="u-descicon u-descicon-touch" svg-inline src="../../../assets/img/npc/radar.svg" />
                            <b>Phạm vi</b>
                            <em>TouchRange</em>
                            <strong>{{ data.TouchRange }}</strong>
                        </div>
                        <div class="u-sense" v-if="data.Sense">
                            <img class="u-descicon u-descicon-sense" svg-inline src="../../../assets/img/npc/sight.svg" />
                            <b>Thức phá</b>
                            <em>Sense</em>
                            <strong>{{ data.Sense }}</strong>
                        </div>
                        <div class="u-dodge" v-if="data.Dodge">
                            <img class="u-descicon u-descicon-dodge" svg-inline src="../../../assets/img/npc/miss.svg" />
                            <b>Né tránh</b>
                            <em>Dodge</em>
                            <strong>{{ data.Dodge }}</strong>
                        </div>
                        <div class="u-dodge" v-if="data.Parry">
                            <img class="u-descicon u-descicon-dodge" svg-inline src="../../../assets/img/npc/miss.svg" />
                            <b>Đỡ đòn</b>
                            <em>Parry</em>
                            <strong>{{ data.ParryValue }}</strong>
                        </div>
                        <div class="u-shield">
                            <img class="u-descicon u-descicon-shield" svg-inline src="../../../assets/img/npc/shield.svg" />
                            <b>Phòng thủ</b>
                            <em>Shield</em>
                            <span class="u-sitem">
                                外功Phòng thủ
                                <em>PhysicsShieldBase</em>
                                <span class="u-value">{{ ~~data.PhysicsShieldBase }}</span>
                            </span>
                            <span class="u-sitem">
                                混元Phòng thủ
                                <em>NeutralMagicDefence</em>
                                <span class="u-value">{{ ~~data.NeutralMagicDefence }}</span>
                            </span>
                            <span class="u-sitem">
                                阳性Phòng thủ
                                <em>SolarMagicDefence</em>
                                <span class="u-value">{{ ~~data.SolarMagicDefence }}</span>
                            </span>
                            <span class="u-sitem">
                                阴性Phòng thủ
                                <em>LunarMagicDefence</em>
                                <span class="u-value">{{ ~~data.LunarMagicDefence }}</span>
                            </span>
                            <span class="u-sitem">
                                毒性Phòng thủ
                                <em>PoisonMagicDefence</em>
                                <span class="u-value">{{ ~~data.PoisonMagicDefence }}</span>
                            </span>
                        </div>
                        <div class="u-critical">
                            <img class="u-descicon u-descicon-attack" svg-inline src="../../../assets/img/npc/attack.svg" />
                            <b>Hội tâm</b>
                            <em>Critical</em>
                            <span class="u-sitem">
                                外功Hội tâm
                                <em>PhysicsCriticalStrike</em>
                                <span class="u-value">{{ ~~data.PhysicsCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                混元Hội tâm
                                <em>NeutralCriticalStrike</em>
                                <span class="u-value">{{ ~~data.NeutralCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                阳性Hội tâm
                                <em>SolarCriticalStrike</em>
                                <span class="u-value">{{ ~~data.SolarCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                阴性Hội tâm
                                <em>LunarCriticalStrike</em>
                                <span class="u-value">{{ ~~data.LunarCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                毒性Hội tâm
                                <em>PoisonCriticalStrike</em>
                                <span class="u-value">{{ ~~data.PoisonCriticalStrike }}</span>
                            </span>
                        </div>
                        <div class="u-attack">
                            <img class="u-descicon u-descicon-attack" svg-inline src="../../../assets/img/npc/target.svg" />
                            <b>Chính xác</b>
                            <em>Attack</em>
                            <span class="u-sitem">
                                外功Chính xác
                                <em>PhysicsAttackHit</em>
                                <span class="u-value">{{ ~~data.PhysicsAttackHit }}</span>
                            </span>
                            <span class="u-sitem">
                                混元Chính xác
                                <em>NeutralMagicHit</em>
                                <span class="u-value">{{ ~~data.NeutralMagicHit }}</span>
                            </span>
                            <span class="u-sitem">
                                阳性Chính xác
                                <em>SolarMagicHit</em>
                                <span class="u-value">{{ ~~data.SolarMagicHit }}</span>
                            </span>
                            <span class="u-sitem">
                                阴性Chính xác
                                <em>LunarMagicHit</em>
                                <span class="u-value">{{ ~~data.LunarMagicHit }}</span>
                            </span>
                            <span class="u-sitem">
                                毒性Chính xác
                                <em>PoisonMagicHit</em>
                                <span class="u-value">{{ ~~data.PoisonMagicHit }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="u-id">
                        ID : {{id}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getNpc } from "../../../service/database.js";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { iconLink } = utilModule;
export default {
    name: "NpcComponent",
    props: ["client", "id"],
    data: () => ({
        data: null,
    }),
    computed: {
        params: function() {
            return [this.client, this.id];
        },
    },
    watch: {
        params: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) {
                    let [client, id] = val;
                    // 读取本地数据
                    const cache = sessionStorage.getItem(`npc-${client}-${id}`);
                    if (cache) {
                        this.data = JSON.parse(cache);
                        // 没有缓存则发起请求获取数据
                    } else {
                        id &&
                            getNpc(...this.params).then((res) => {
                                let data = res.data?.list?.[0];
                                this.data = data;

                                // 将数据放入 sessionStorage
                                sessionStorage.setItem(`npc-${client}-${id}`, JSON.stringify(data));
                            });
                    }
                }
            },
        },
    },
    methods: {
        iconLink: function(id) {
            return iconLink(id, this.client);
        },
    },
};
</script>

<style lang="less">
@import "../../../assets/css/module/npc.less";
</style>
