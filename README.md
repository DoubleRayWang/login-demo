#gulp-engineered

本工程适合小型H5开发，`css`使用`less/sass`，`JavaScript`可使用大部分`ES6`新特性并配置`babel`。

> 建议使用[less](http://less.bootcss.com/)，避免sass环境的配置（windows需安装ruby），参见[Sass中文网](https://www.sass.hk/)

具体配置可参见gulpfile.js及package.json

### 开始

执行 `npm install` 安装所有依赖，`npm start`开始开发，so easy。

### 特点：

- 开发过程工程化，只需关注原始的文件，其他的全部可以交由gulp处理；
- 可自定义输出目录，无需开发工程中各服务器文件目录不同而频繁更改配置；
- `less/sass`自由选择
- 发布版会自动加上`name.js?v=md5`的版本号，解决浏览器缓存的问题的同时不会更改文件名称，适应一部分需求（如不需要可自己更改）
- 所有插件都是最新的，大幅度提高开发效率

> 建议使用webstorm或其他IED进行开发，所以本功能未增加服务器环境配置（webstrom已实现服务器环境）

### 命令

```
# gulp default
```
> 执行一遍所有操作，生成发布目录（先删除），并继续监控`less/sass`及`ES6`进行实时编译

```
# gulp zip
```
> 将发布目录打包成zip

```
# gulp start
```
> 开始监控`less/sass`及`ES6`文件进行实时编译，可开始正常开发调试

其余命令均为单个功能，可自由尝试 `gulp name`

### Licence

Released under [CC BY-NC-SA 3.0 CN 许可协议](https://creativecommons.org/licenses/by-nc-sa/3.0/cn/)  @doubleRay

© 2017 - 2018 CTR 