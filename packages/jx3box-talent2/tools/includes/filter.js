//对数据库查询的desc字段进行数据加工
const _ = require("lodash");
const axios = require("axios");

function Filter(desc, datas) {
    if (!desc) return desc;
    //处理sub
    desc = filterBySub(desc, datas);

    //处理buff描述
    desc = filterByBuffDesc(desc, datas);

    //处理buff时间
    desc = filterByBuffTime(desc, datas);

    //处理其他类型的buff -- 基于skill@22635改进,2019/11/8
    desc = filterByBuffAt(desc);

    //处理额外附加攻击   -- 基于skill@22635改进,2019/11/8
    desc = filterByAdd(desc);

    //过滤其它<>
    desc = desc.replace(/\<.*?\>/g, "");

    //处理undefined
    desc = filterUndefined(desc);

    //替换回车符
    desc = desc.replace(/\\n/g, "<br/>");

    return desc;
}

function get_resource(type, query, datas) {
    let id_map = {
        skill: "SkillID",
        buff: "BuffID",
    };
    let primaryKey = id_map[type];
    if (!primaryKey) return [];
    return datas[type].filter((item) => item[primaryKey] == query);
}

function filterBySub(desc, datas) {
    let reg = new RegExp(/\<SUB (\d+?) (\d)\>/g);
    let subreg = new RegExp(/\<SUB (\d+?) (\d)\>/);
    let hasMatched = reg.test(desc);

    if (hasMatched) {
        let arr = desc.match(reg);
        for (let i = 0; i < arr.length; i++) {
            let capture = subreg.exec(arr[i]);
            let id = capture[1];
            let level = capture[2];

            let result = get_resource("skill", id, datas);
            let skill = {};
            _.each(result, function (obj, i) {
                if (obj.Level == level) {
                    skill = obj;
                    return;
                }
            });

            if (skill.Desc) {
                desc = desc.replace(arr[i], skill.Desc);
            }
        }
    }
    return desc;
}
function filterByBuffDesc(desc, datas) {
    let reg = new RegExp(/\<BUFF (\d+?) \d?\ desc>/);
    let hasMatched = reg.test(desc);
    if (hasMatched) {
        let capture = reg.exec(desc);
        let id = capture[1];
        //let level = capture[2]

        let result = get_resource("buff", id, datas);
        let buff = result.find((item) => item.Desc);

        if (buff) {
            desc = desc.replace(reg, buff.Desc);
        }
    }
    return desc;
}
function filterByBuffTime(desc, datas) {
    let reg = new RegExp(/\<BUFF (\d+?) (\d?)\ time>/);
    let buffTimeReg = new RegExp(/\<BUFF (\d+?) (\d?)\ time>/g);
    let hasMatched = reg.test(desc);
    if (hasMatched) {
        let capture = reg.exec(desc);
        let id = capture[1];

        let result = get_resource("buff", id, datas);

        // buff 持续时间 示例 持续1秒-5秒
        const _capture = desc.match(buffTimeReg);

        _capture.forEach((cap) => {
            const tmp = reg.exec(cap);

            let buff = result.find((item) => item.Level === Number(tmp[2])) || result[0];
            if (!buff.Interval) buff = result[1];
            let time = (parseInt(buff.Interval) / 16) * parseInt(buff.Count) + "秒";
            desc = desc.replace(reg, time);
        });
    }
    return desc;
}
//(+<SKILLEx {D0} {TotalPhysicsAP 0.3906}>)
function filterByAdd(desc) {
    let reg = new RegExp(/\(\+\<SKILLEx.*?\>\)/g);
    let hasMatched = reg.test(desc);

    if (hasMatched) {
        desc = desc.replace(reg, "");
    }
    return desc;
}
//<BUFF atCallPhysicsDamage>
function filterByBuffAt(desc) {
    let reg = new RegExp(/<BUFF at.*?>/g);
    let hasMatched = reg.test(desc);

    if (hasMatched) {
        desc = desc.replace(reg, "");
    }
    return desc;
}

function filterUndefined(desc) {
    return desc.replace(/undefined/g, "*");
}

module.exports = Filter;
