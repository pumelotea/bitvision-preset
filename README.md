# vue-cli-plugin-bitvision
数据可视化项目创建插件，适用于vue-cli3脚手架。

### 注意
必须使用bitvision-designer设计器导出的json作为输入参数


### 引导
1. 该预设模板会只适用于创建新项目，请勿在已有项目中添加该插件，因为该插件会删除并替换一些文件
2. 确保你的开发环境中已经安装git，该模板会自动创建git版本库，而且该模板在构建的时候会自动把版本信息插入构建结果中

### 使用preset创建项目
```
vue create --preset pumelotea/vue-cli-plugin-bitvision my-app
```

### 特性
1. 生产环境自动移除console
2. 构建信息（版本号，git hash等）自动编入构建结果,插入`index.html`
3. 构建后自动打包为zip
4. 预设编译命令`build-prod`,`build-test`
5. 支持打包成docker

### 常见问题

#### 如何扩展自定义构建命令
以下以alpha版本作为例子
在package.json中添加
```
"build-alpha": "vue-cli-service build --mode alpha --dest=dist-alpha"
```
在项目根目录下新建一个
`.env.alpha`,内容如下：  
```
NODE_ENV = 'alpha'
```
还可以编写其他的变量，请查看文档。

