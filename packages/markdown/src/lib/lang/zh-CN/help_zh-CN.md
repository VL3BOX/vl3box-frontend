@[toc](目录)

Markdown 语法简介
=============

## 目录
```
@[toc](目录)
```

## 粗体
```
**粗体**
__粗体__
```
## 斜体
```
*斜体*
_斜体_
```
## 下划线
```
++下划线++
```
## 删除线
```
~~删除线~~
```
## 上标下标
```
上角标 x^2^
下角标 H~2~0
```
x^2^  H~2~0

## 标记
```
==标记==
```
## 标题
```
一级标题
====
## 二级标题 ##
二级标题
----
### 三级标题 ###
#### 四级标题 ####
##### 五级标题 #####
###### 六级标题 ######
```
## 分割线
```
***
---
```
## 引用
```
> 一级
>> 二级
>>> 三级
```
## 列表
```
有序列表
1. 列表项
2. 列表项
3. 列表项
无序列表
+ 列表项
+ 列表项
待办列表
- [x] 已完成任务
- [ ] 未完成任务
```
## 链接
```
[JX3BOX](https://www.jx3box.com)
```
[JX3BOX](https://www.jx3box.com)
## 图片
```
![JX3BOX](https://img.jx3box.com/image/common/logo.png)
```
![JX3BOX](https://img.jx3box.com/image/common/logo.png)
## 脚注
```
见底部脚注[^hello]
[^hello]: 一个注脚
```
见底部脚注[^hello]
[^hello]: 一个注脚

## 代码
> 代码块
> \```lang
> code block
> \```
> 代码行
> \`code inline\`

```c++
int main()
{
    printf("hello world!");
}
```
## 表格
```
| 标题1 | 标题2 | 标题3 |
| :--  | :--: | ----: |
| 左对齐 | 居中 | 右对齐 |
| ---------------------- | ------------- | ----------------- |
```
| 标题1 | 标题2 | 标题3 |
| :--  | :--: | ----: |
| 左对齐 | 居中 | 右对齐 |
| ---------------------- | ------------- | ----------------- |

## 折叠
```
<details>
<summary>点击展开折叠</summary>
被折叠的文字
</details>
```
<details>
<summary>点击展开折叠</summary>
被折叠的文字
</details>

## 表情(emoji)
```
:laughing:
:blush:
:smiley:
:)
...
```
:laughing::blush::smiley::) [更多](https://www.webpagefx.com/tools/emoji-cheat-sheet/)

## $\KaTeX$公式
```
$x_i + y_i = z_i$ 和 $\sum_{i=1}^n a_i=0$
$$\sum_{i=1}^n a_i=0$$
```
我们可以渲染公式例如：$x_i + y_i = z_i$和$\sum_{i=1}^n a_i=0$
我们也可以单行渲染
$$\sum_{i=1}^n a_i=0$$
具体可参照[katex文档](http://www.intmath.com/cg5/katex-mathjax-comparison.php)和[katex支持的函数](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)以及[latex文档](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)

## 对齐
::: hljs-left
`::: hljs-left`
`居左`
`:::`
:::

::: hljs-center
`::: hljs-center`
`居中`
`:::`
:::

::: hljs-right
`::: hljs-right`
`居右`
`:::`
:::