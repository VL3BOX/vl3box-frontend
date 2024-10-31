import axios from "axios";
import { $cms, $next } from "@jx3box/jx3box-common/js/https_v2.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

function getMsg() {
    return $next({ mute: true }).get("/api/letter/unread/count");
}

function getNav(client = "std") {
    let file = client == "origin" ? "header_nav_origin.json" : "header_nav.json";
    return axios.get(JX3BOX.__dataPath + `data/box/${file}`);
}

function getPanel() {
    return axios.get(JX3BOX.__dataPath + "data/box/header_panel.json");
}

function getBox(client = "std") {
    let filename = client == "origin" ? "box_origin.json" : "box.json";
    return axios.get(JX3BOX.__dataPath + "data/box/" + filename);
}

function getMenu(key) {
    return $cms().get(`/api/cms/config/menu/${key}`);
}

function getGames() {
    return axios.get(JX3BOX.__dataPath + "data/product/games.json");
}

export { getMsg, getNav, getPanel, getBox, getMenu, getGames };
