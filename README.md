# 关于开发工具

内部开发工具，介绍还没想好，欢迎补充

# 技术栈

* Vue 3
* Typescript
* Vite
* ant-design-vue
* lodash-es
* axios

# 代码提交规范

为了团队协作，保证代码的一致性，代码提交加入了pre-commit钩子来约束,提交前会检查代码规范性，使用commit-msg来约束提交信息的格式，commit-msg格式：
```bash
type(scope?): subject
```
注意：scope代表影响范围，可以省略，如果有多个范围，可以使用","来分隔

type类型如下：

* build: 打包代码
* chore: 构建过程或辅助工具的变动
* ci: 修改CI配置
* docs: 文档改变
* feat: 新功能
* fix: 修复bug
* perf: 性能优化
* refactor: 某个已有功能重构
* revert: 撤销上一次的 commit
* style: 代码格式改变
* test: 测试

提交举例：
```
chore: run tests on travis ci
```
```
feat(blog): add comment section
```
```
fix(server,blog): send cors headers
```

参考：
```
https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```
# 关于LF和CRLF带来的冲突问题

crlf 和 lf 是文本换行的不同方式

crlf: "\r\n", windows 系统的换行方式

lf: "\n", Linux和MAC OS系统的换行方式

在你使用git拉取代码的时候，git会自动将代码当中与你当前系统不同的换行方式转化成你当前系统的换行方式，从而造成这种冲突

为了统一换行格式，基于当前业界标准，以lf为准，所以如果你当前使用的时windows系统，请在拉取项目之前，关闭git的自动转换，执行以下命令：
```bash
git config --global core.autocrlf false
```
# 使用YARN还是NPM

由于当前yarn的优势对比起npm已经相当微小，而yarn还需要单独安装，为了团队方便和统一，请一致使用npm作为包管理工具

# 更新依赖

全局安装npm-check
```bssh
npm install -g npm-check
```

更新全部依赖
```
npm-check
```

手动选择更新
```
npm-check -u
```
