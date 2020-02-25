function renderFiles(api, opts) {

  const fs = require('fs')
  const ep = require('./export-data')
  const path = require('path')
  const req = require('./request')
  const readlineSync = require('readline-sync')

  let token = null
  while (true) {
    let username = readlineSync.question('bitvision username:');
    let password = readlineSync.question('bitvision password:');
    token = req.login(username, password)
    if (!token) {
      console.log('[ERROR] login failed')
      continue
    }
    break
  }

  let list = req.getList(token)
  if (list.length === 0) {
    console.log('[ERROR] you project list is empty')
    process.exit()
  }

  let config = ''
  while (true) {
    console.log('select project:')
    console.log('----------------------------')
    list.forEach(e => {
      console.log(`[${e.id}] `, e.name)
    })
    console.log('----------------------------')
    let chooseId = readlineSync.question('select project id:');
    let choose = list.filter(e => e.id === chooseId)
    if (choose.length === 0) {
      console.log('[ERROR] please choose id from list')
      continue
    }
    config = JSON.parse(choose[0].config_json)
    break
  }


  //写入文件
  api.onCreateComplete(() => {
    let json = config
    console.log('\n')
    console.log('📄  Generating ', `${api.resolve('src')}/views/vision.vue`)
    console.log('📄  Generating ', `${api.resolve('src')}/components/Layout.vue`)
    //创建文件
    let code = ep.exportCode(json.comTree)
    let layoutCode = ep.exportLayout(json.layout)
    let fdCode = fs.openSync(`${api.resolve('src')}/views/vision.vue`, 'w');
    let fdLayoutCode = fs.openSync(`${api.resolve('src')}/components/Layout.vue`, 'w');
    fs.writeSync(fdCode, code);
    fs.writeSync(fdLayoutCode, layoutCode);
    fs.closeSync(fdCode);
    fs.closeSync(fdLayoutCode);
  })


  const filesToDelete = [
    'src/assets/logo.png',
    'src/views/About.vue',
    'src/views/Home.vue',
    'src/components/HelloWorld.vue',
  ]


  api.render(files => {
    Object.keys(files)
      .filter(name => filesToDelete.indexOf(name) > -1)
      .forEach(name => delete files[name])
  })
  api.render('./templates/base')


}

function addDependencies(api, projectName) {
  api.extendPackage({
    scripts: {
      "build-prod": "vue-cli-service build",
      "build-test": "vue-cli-service build --mode=test --dest=dist-test",
      "build-docker": "vue-cli-service build && docker build . -t " + projectName + " && docker save > " + projectName + ".img " + projectName + ":latest"
    },
    dependencies: {
      "axios": "^0.18.0",
      "core-js": "^2.6.5",
      "cropperjs": "^1.5.1",
      "jsbarcode": "^3.11.0",
      "qrcode": "^1.3.3",
      "url-search-params-polyfill": "^6.0.0",
      "vconsole": "^3.3.0",
      "vue": "^2.6.6",
      "vue-router": "^3.0.1",
      "vue-scroller": "^2.2.4",
      "vuex": "^3.0.1"
    },
    devDependencies: {
      "@babel/polyfill": "^7.6.0",
      "@vue/cli-plugin-babel": "^4.0.4",
      "@vue/cli-plugin-eslint": "^4.0.4",
      "@vue/cli-service": "^4.0.4",
      "babel-eslint": "^10.0.1",
      "eslint": "^5.8.0",
      "eslint-plugin-vue": "^5.0.0",
      "filemanager-webpack-plugin": "^2.0.5",
      "stylus": "^0.54.5",
      "stylus-loader": "^3.0.2",
      "vue-template-compiler": "^2.5.21",
      "squirrelzoo-build-plugin": "^1.0.1",
      "babel-plugin-transform-remove-console": "^6.9.4"
    }
  })
}

module.exports = (api, options, rootOpts) => {
  options.BASE_URL = '<%= BASE_URL %>'
  options.VUE_APP_BUILD_TIME = '<%= VUE_APP_BUILD_TIME %>'
  options.VUE_APP_BUILD_VER = '<%= VUE_APP_BUILD_VER %>'
  options.VUE_APP_BUILD_REPO_VER = '<%= VUE_APP_BUILD_REPO_VER %>'
  options.projectName = api.generator.originalPkg.name


  addDependencies(api, api.generator.originalPkg.name)
  renderFiles(api, options)
}
