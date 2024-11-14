/**
 * 用户主页链接
 * @param {*} user_id 用户ID
 */

import {__Root} from "@jx3box/jx3box-common/data/jx3box.json";

export default (user_id) => {
  return user_id ? `${__Root}author/?uid=${user_id}` : null;
}