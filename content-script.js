function getRelevantStyles(element, additional = null) {
    var styles = {}
    //console.log(element)
    CSSObj = getComputedStyle(element)
    if (CSSObj.length < 1) {
      return false
    }
    
    styles.font = CSSObj.getPropertyValue("font")
    styles.color = CSSObj.getPropertyValue("color")
    styles["font-family"] = CSSObj.getPropertyValue("font-family")
    styles["word-break"] = CSSObj.getPropertyValue("word-break")
    styles["word-wrap"] = CSSObj.getPropertyValue("word-wrap")
    styles["word-spacing"] = CSSObj.getPropertyValue("word-spacing")
    styles["font-synthesis"] = CSSObj.getPropertyValue("font-synthesis")
    styles["font-weight"] = CSSObj.getPropertyValue("font-weight")
    styles["font-style"] = CSSObj.getPropertyValue("font-style")
    styles["hyphens"] = CSSObj.getPropertyValue("hyphens")
    styles["font-size"] = CSSObj.getPropertyValue("font-size")
    styles["line-height"] = CSSObj.getPropertyValue("line-height")
    styles["background-color"] = CSSObj.getPropertyValue("background-color")
    styles["outline-color"] = CSSObj.getPropertyValue("outline-color")
    styles["white-space"] = CSSObj.getPropertyValue("white-space")
    styles["box-sizing"] = CSSObj.getPropertyValue("box-sizing")
    styles["tab-size"] = CSSObj.getPropertyValue("tab-size")
    if (additional !== null) {
      styles[`${additional}`] = CSSObj.getPropertyValue(`${additional}`)
    }
    return styles
  }
  
  function getRealElement(className = null, child) {
    if (className.length != 0)
      elems = document.getElementsByClassName(className)
    else { console.log("ISNULL") }
    if (elems.length > 1) {
      elem = elems[0]
    } else {
      elem = elems
    }
    if (String(Symbol(elem)).match("Element")) {
      styles = getRelevantStyles(elem)
      return styles
    } else {
      return }}
  
  function getRanges() {
    var selectedDocument = {
      "range": [],
      "selection": {},
      "clone": []
    } // injiser stiler hentet fra DOM
    var ranges = []
    const sel = window.getSelection()
    for (let i = 0; i < sel.rangeCount; i++) {
      selectedDocument.range[i] = sel.getRangeAt(i);
      selectedDocument.clone[i] = selectedDocument.range[i].cloneContents() }
    
    selectedDocument.selection = sel
    return selectedDocument }
  
  function allClones(cloneList) { 
    let nodeList = new DocumentFragment()
    for (const clone of cloneList) {
  
      allDescendants(clone)
      function allDescendants(clone) {
        clone.childNodes.forEach(function(child) {
                  allDescendants(child)
             setStyles(child) }) }
    }return nodeList }
  
  
  
  function setStyles(child) {
    const nodeType = child.nodeType
    
    const styleNode = document.createAttribute("style")
    for (const currentRange in selectedDocument.range) {
  
      if (child.getRootNode() === selectedDocument.clone[currentRange]) {
        selectedDocument["currentRange"] = selectedDocument.range[currentRange] }}
  
    switch (nodeType) {
      case 1: // 'Vanlig' node
        const className = child.className
        const CSSStyles = getRealElement(className)
    //    console.log(typeof CSSStyle === 'undefined')
        if (typeof CSSStyles !== 'undefined') {
          for (const [key, value] of Object.entries(CSSStyles)) {
            styleNode.value += (`${key}:${value};`)}
          child.setAttributeNode(styleNode)
          break;
        } else { //Hvis CSSStyle er undefined
          break; }
      case 3:																				//  Tekst-node
        const elemParent = selectedDocument.currentRange.commonAncestorContainer
        var parentElem = getRelevantStyles(elemParent, "display")
      //  console.log(parentElem)
        const spanNode = document.createElement("span")
        if (typeof parentElem !== 'undefined') {
          for (const [key, value] of Object.entries(parentElem)) {
            styleNode.value += (`${key}:${value};`) }}
        spanNode.setAttributeNode(styleNode)
        spanNode.wholeText = child.wholeText
        child = spanNode
        break; 
    }return }
  
  function getHTMLAndText(){
    plaintext = ''
    elem = document.createElement("pre")
    
    for (const doc of selectedDocument.clone) {
        elem.appendChild(doc)
      plaintext += doc.textContent
      
    }
  
    return {"html" :elem.outerHTML,"plaintext":selectedDocument.selection.toString()}
  }
  
  
  function initiate() {
    selectedDocument = getRanges()
    console.log(selectedDocument, "huh")
    allClones(selectedDocument.clone)
    console.log(selectedDocument.clone[0])
    var content = getHTMLAndText()
    
    
    console.log(content.html)
    //   console.log(body.outerHTML)
    return content
  }
  



  document.addEventListener('copy', function(event) {
    content = initiate();
    const htmlblob = new Blob([content.html], {
      type: "text/html"
    });
    const plainblob = new Blob([content.plaintext], {
      type: "text/plain"
    });
  
    
    const data = [new ClipboardItem({
      ["text/html"]: htmlblob,
      [plainblob.type]: plainblob,
    })];
  
    console.log(data[0])
   navigator.clipboard.write(data)
  })

  