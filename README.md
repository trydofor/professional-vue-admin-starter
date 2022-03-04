# Wings管理端

* [typescript 4.x](https://www.typescriptlang.org/)
* [vue 3.x](https://vuejs.org/)
* [element-plus 2.x](https://element-plus.org/)
* [vue-i18n 9.x](https://vue-i18n.intlify.dev/)

## 常用命令

```bash
# 包管理推荐顺序 pnpm > yarn1 > npm
npm install -g pnpm

# 初始安装 | npm install
pnpm install

# 本地代理 | npm run local
pnpm local
# 开发代理 | npm run serve
pnpm serve

# 编译打包 | npm run build
pnpm build

# 格式化代码 | npm run lint
pnpm lint
```

## 编码约定

以lint的规则和[vue style-guide](https://vuejs.org/style-guide/)为基础，
增加以下编辑约定，基本原则是强类型，可读性，一致性。

### Rule01. js类全驼峰，http类全烤串

驼峰指camelCase和PascalCase，烤串指kebab-case（全小写）。
基于html和http不区分大小写，mac和win默认不区分大小写。

* `*.vue`的文件名，一律驼峰，与java类和Vue官方一致。
* 目录和非vue的文件名，一律烤串，与`index.js` 保持一致。
* 文件内容，css中一律烤串，js中一律驼峰，html中烤串优先。
* 组件的props，在js中是camelCase，html中是kebab-case
* emit的事件名，必须kebab-case，因其仅做字符串处理，不自动转换。
* i18n统一使用js，key驼峰命名，段按页面划分，文件烤串

### Rule02. js中单引号，html中双引号

鉴于html中通常使用双引号，且在里面会有简单的js代码
* js类中，一律单引号。
* html类中，一律双引号。

### Rule03. 分号和逗号同主语言一致

分号，与主语言一致，否则随缘。
* java的，结尾保留分号。
* kotlin，scala等不带分号的，结尾不留。

尽量逗号收尾，方便修改。
* 数组，对象，ts等支持逗号结尾的地方，方便增减元素。

### Rule04. 组件名不要使用Index.vue

因在vue-dev-tool调试组件时，不希望看到组件名叫Index。

* 尽量使用全名，并通过index.ts进行import和export
* 使用name属性（不建议手工指定，建议自动推断）

### Rule06. 目录的单复数及路径缩写
与java 包名鼓励单数不同，根据vue官方模板中命名规则，大部分会是复数

* 使用时视为单一的完整的，使用单数，如 store, route
* 使用时仍是多个的碎片的，使用复数，如 views, compents
* import时尽量绝对路径 `xxx`, `@/`，相对时只能一级  `./`,  `../`

### Rule08. js/ts编码约定

* 若无特别需要，能用 `function`定义方法，尽量不要使用lambda箭头函数
* 尽量注明类型，尽量使用`unknow`代替`any`
* 无实体类的用`*.d.ts`，有实体内容的用`*.ts`
* 在无类型推导问题是，以`TypeX[]`代替`Array<TypeX>`
* 流程控制用`if`，表达式用`||`或`??`

### Rule09. vue编码约定

* emits，采用ts规范，事件名不必使用`on`前缀
* props，传递Function代替emit时，使用`do`前缀，表示`handle`
* SFC中的interface或type，可放到同名`*.d.ts`，enum等于`*.ts`
* scoped的样式尽量简短，够用；全局的要使用特定前缀如`wg`
    -  box：为容器类，只限定定位和布局，非具体内容
    - 其他带有意义的单词，都视为实体类

## 代码格式化

开发环境中大概存在4套格式化体系，其中有些规则会发生冲突，比如长代码断行始终是问题。
* 编辑器 - IDE(WebStorm)或Editor(VsCode)的本身的CodeStyle
* prettier - 分析AST全部重新输出源码，统一格式。不管如何都会格式化。
* eslint - 根据rule格式化源码，提高代码质量。只有触发规则才会警报，甚至fix。
* eslint-plugin-vue - Vue对EsLint的细分了很多细致规则。

尽管有4套体系，但在js界，使用Prettier格式化代码，EsLint提高代码质量是共识。
工程内采用 vue3-recommended，基于以下实践，在长代码断行上调整了默认值，使开发者
能够在120行内，自由选择如何断行，比如html是否每标签换行，ts对象是否每key换行。

* 现代显示器较大，通常一行120-160字符比较合适。
* 逻辑代码120比较舒服，而html的标签和属性长度超过180也可接受。
* html断行时每个属性一行，把横向痛苦，转化成纵向痛苦，更痛苦。

eslint规则覆盖规则为，truthy时全覆盖，而非merge，包括级别和配置项。
* https://eslint.org/docs/user-guide/configuring/configuration-files
* https://eslint.vuejs.org/rules/

在WebStorm中，如下设置Preferences`⌘,`，使其更好的格式化代码。

* Keymap
    - 取消`Reformat Code`的快捷键`⌥⌘L`
    - 新建`Fix ESLint Problems`快捷键 `⌥⌘L`
* Languages & Frameworks | JavaScript | Code Quality Tools | ESLint
    - Automatic ESLint configuration
    - Run eslint --fix on save

## 依赖说明

每增加一个依赖，要说明其作用，选择依据，版本要求和注意事项，以方便升级和维护。

### 运行依赖 Dependencies

* element-plus - 目前2.0.x，组件化完整，ts程度高
* axios - http api请求
* day.js - 日期格式化，取代moment.js
* qs - query string和json转化
* js-cookie - 保持登录token
* js-md5 - 密码hash，避开原文，增加复杂度
* mitt - eventbus，全局事件总线
* vue-i18n - 多国语，目前使用的是beta版

### 编译依赖 DevDependencies

* typescript - 与vue-cli一致。
* eslint-config-prettier - 关闭eslint中无用或与prettier冲突的规则，放置在extends最后
* eslint-plugin-prettier - 使用prettier作为eslint的rule
