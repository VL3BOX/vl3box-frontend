数据上报
----------------

## 安装

```
npm install @jx3box/reporter
```

## 使用

所有上报通用数据：【sdk已自动加入】

- timestamp: 上报时间戳
- remain: 页面停留时间 【从sdk初始化完成到上报的时间差值】

通用上报

```typescript
import R from "@jx3box/reporter"
R.setOptions({
    caller: "业务代号A",
    use_query: true; // 上报当前页面中url中的参数 默认false
    userId: 8; // 当前登录用户id
}) // 可选
R.p({xxx:xxxx})
```

或者

```typescript
import R from "@jx3box/reporter"
R.setOptions({
    userId: 8; // 当前登录用户id
}) // 可选
R.p({xxx:xxxx}， "业务代号A")
```


分业务上报

```typescript
import { Reporter } from "@jx3box/reporter"

const globalR = new Reporter({
    caller: "业务代号A",
    use_query: true; // 上报当前页面中url中的参数 默认false
    userId: 8; // 当前登录用户id
}) // new 操作尽量在页面初始化时执行，避免重复创建。 内部用其new时的时间戳和上报时的时间戳做差值，作为页面跳转时的停留时间
globalR.p({xxx:xxxx}) // 一般业务上报
globalR.j({xxx:xxxx}) // 跳转类型上报
```

## 文档

### class JX3Reporter

#### 构造函数

```typescript
constructor(options?: JX3ReporterOptions)
```

#### 成员函数

```typescript
// 一般上报使用
p(data: any, caller?: string): void
// 跳转上报使用
j(data: any, caller?: string): void
```

### interface JX3ReporterOptions

```typescript
{
    caller: string; // 调用方 用于区分不同的调用方，使用不同的清洗规则
    api?: string; // 上报地址
    use_query?: boolean; // 上报当前url中的参数 默认false
    useId?: number; // 用户id
}
```


## 开发

```
npm run dev
```

## 编译

```
npm run build
```