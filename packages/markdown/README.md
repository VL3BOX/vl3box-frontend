# Markdown

基于mavonEditor，等以后有机会了，我一定基于mdit重写，这玩意属实太shishan了，侧边目录的实现给我整麻了。

## Usage
### 引入
```javascript
import editor from '@jx3box/markdown/src/editor.vue'
import render from '@jx3box/markdown/src/render.vue'
```

### 使用
```javascript
<editor ref="md" v-model="data"></render>
<render ref="md" v-model="data"></render>
```

## Dev
`npm run dev` open [localhost:9090]

## 主要修改
1. 第三方的github markdown style、highlight、katex等资源使用jx3box cdn资源。

## 开发事项
1. 第三方插件的包/样式替换请修改resources重新发版后，更新对应CDN。

