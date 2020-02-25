module.exports = {
  exportCode(configJson) {
    let iterator = (tree) => {
      let childCode = ''
      for (let slotName in tree.slot) {
        if (tree.slot[slotName] !== null) {
          childCode += `
  <template #${slotName}>
    ${iterator(tree.slot[slotName])}
  </template>
`
        } else {
          childCode += `
  <template #${slotName}></template>
`
        }
      }
      return `
<${tree.comName}>
  ${childCode}
</${tree.comName}>`
    }
    let code = iterator(configJson)
    let template = `
<template>
   ${code}  
</template>`

    let vueFile =
      `
${template}
<script>
  export default {
    
  }
</script>
  `
  return vueFile
  },
  exportLayout({columns, rows, columngap, rowgap, childarea,colArr,rowArr}) {
    const repetition = require('./repetition');

    const unitGroups1 = repetition.groupRepeatedUnits(colArr)
    let colTemplate =  repetition.createRepetition(unitGroups1)
    const unitGroups2 = repetition.groupRepeatedUnits(rowArr)
    let rowTemplate = repetition.createRepetition(unitGroups2)

    let parentCss = `
  .parent {
    display:grid;
    height: 100vh;
    width: 100vw;
    position: relative;
    grid-template-columns:${colTemplate};
    grid-template-rows:${rowTemplate};
    grid-column-gap:${columngap}px;
    grid-row-gap:${rowgap}px;
  }`

    let childCss = ''
    let areaItem = ''
    childarea.forEach((e, i) => {
      childCss +=
        `.div${i} {
    grid-area:${e};
    position:relative;
  }
  `
      areaItem +=
        `
    <div class="div${i}"><slot name="div${i}"></slot></div>
 `
    })

    let css = `<style scoped>
  ${parentCss}
  ${childCss}
</style>`


    let template = `
<template>
  <div class="parent">
    ${areaItem}  
  </div>
</template>`


    let vueFile =
      `
${template}
<script>
  export default {
    
  }
</script>
${css}
  `
    return vueFile

  }
}