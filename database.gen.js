var products = [];
for (element of document.querySelector('.listing').children) if(element.nodeName === 'DIV') products.push({
  name: element.children[0].children[1].children[2].textContent.trim(),
  img: element.children[0].children[1].children[0].children[0].children[0].children[0].srcset, 
  prize: element.children[0].children[1].children[4].children[1].children[0].textContent.replace('*', '').trim(), 
  comPrize:  parseFloat(element.children[0].children[1].children[4].children[1].children[0].textContent.replace(',', '.').trim())
});
var textarea = document.createElement('TEXTAREA');
document.body.append(textarea);
textarea.value = JSON.stringify(products, 0, 2);