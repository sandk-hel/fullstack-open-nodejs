(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{18:function(e,n,t){e.exports=t(41)},23:function(e,n,t){},41:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(17),o=t.n(c),u=(t(23),t(6)),i=t(7),l=t(4),m=function(e){var n=e.searchText,t=e.onChange;return r.a.createElement("div",null,"filter shown with ",r.a.createElement("input",{value:n,onChange:t}))},f=function(e){var n=e.newPerson,t=e.handleNameChange,a=e.handlePhoneChange,c=e.addNewPerson;return r.a.createElement("form",{onSubmit:c},r.a.createElement("div",null,"name:",r.a.createElement("input",{value:n.name,onChange:t})),r.a.createElement("div",null,"number:",r.a.createElement("input",{value:n.number,onChange:a})),r.a.createElement("div",null,r.a.createElement("button",{type:"submit"},"add")))},d=function(e){var n=e.persons,t=e.onDelete;return n.map((function(e){return r.a.createElement("p",{key:e.name},e.name," ",e.number,r.a.createElement("button",{onClick:t(e.id)},"delete"))}))},s=t(3),h=t.n(s),b="/api/persons",v=function(){return h.a.get(b).then((function(e){return e.data}))},p=function(e){return h.a.post(b,e).then((function(e){return e.data}))},E=function(e,n){var t="".concat(b,"/").concat(e);return h.a.put(t,n).then((function(e){return e.data}))},g=function(e){return h.a.delete("".concat(b,"/").concat(e))},w=function(e){var n=e.message;if(null===n.text)return null;var t=n.isSuccess?"success":"error";return r.a.createElement("div",{className:t},n.text)},j=function(){var e=Object(a.useState)([]),n=Object(l.a)(e,2),t=n[0],c=n[1],o=Object(a.useState)(""),s=Object(l.a)(o,2),h=s[0],b=s[1],j=Object(a.useState)({name:"",number:""}),O=Object(l.a)(j,2),C=O[0],S=O[1],k=Object(a.useState)({isSuccess:!0,text:null}),x=Object(l.a)(k,2),P=x[0],y=x[1];Object(a.useEffect)((function(){v().then((function(e){c(e)}))}),[]);var N=0===h.length?Object(i.a)(t):t.filter((function(e){return e.name.toLowerCase().includes(h.toLowerCase())})),D=function(e,n){y({isSuccess:e,text:n}),setTimeout((function(){y(Object(u.a)({},P,{text:null}))}),5e3)};return r.a.createElement("div",null,r.a.createElement("h2",null,"Phonebook"),r.a.createElement(w,{message:P}),r.a.createElement(m,{searchText:h,onChange:function(e){return b(e.target.value)}}),r.a.createElement("h2",null,"add a new "),r.a.createElement(f,{newPerson:C,addNewPerson:function(e){e.preventDefault();var n=t.find((function(e){return e.name===C.name}));if(n)return window.confirm("".concat(C.name," is already added to phonebook, replace the old number with a new one?"))&&E(n.id,C).then((function(e){var a=t.filter((function(e){return e.id!==n.id})).concat(e);c(a),D(!0,"Updated ".concat(C.name))})).catch((function(){c(t.filter((function(e){return e.id!==n.id}))),D(!1,"Information of ".concat(C.name," has already been removed from server"))})),void S({name:"",number:""});p(C).then((function(e){S({name:"",number:""}),c([].concat(Object(i.a)(t),[e])),D(!0,"Added ".concat(C.name))})).catch((function(e){D(!1,e.response.data.error)}))},handleNameChange:function(e){S(Object(u.a)({},C,{name:e.target.value}))},handlePhoneChange:function(e){S(Object(u.a)({},C,{number:e.target.value}))}}),r.a.createElement("h2",null,"Numbers"),r.a.createElement(d,{persons:N,onDelete:function(e){return function(){var n=t.find((function(n){return n.id===e}));window.confirm("Delete ".concat(n.name))&&g(e).then((function(){c(t.filter((function(e){return n.id!==e.id}))),D(!0,"Deleted ".concat(n.name))})).catch((function(){c(t.filter((function(e){return n.id!==e.id}))),D(!1,"Information of ".concat(n.name," has already been removed from server"))}))}}}))};o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(j,null)),document.getElementById("root"))}},[[18,1,2]]]);
//# sourceMappingURL=main.238f23f2.chunk.js.map