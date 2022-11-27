/**
 * A DomElement is the main constructor for objects that represent
 * the Dom hierarchy.
 */
 function DomElement(type, childrenDefinition) {
    this.type = type;
    this.styles = {};
    this.children = []; //childrens del DOM

    for (let index = 0; index < (childrenDefinition || []).length; index++) {
        var definition = childrenDefinition[index];
        var newElement = new DomElement(definition.type, definition.children);
        newElement.__proto__ = this;
        this.children.push(newElement);
    }
}

/**
 * All Dom elements know how to print themselves
 */
 DomElement.prototype.toString = function(indent) {
    if (!indent) {
        indent = 0;
    }
    var result = ' '.repeat(indent);
    result = result + 'Node ' + this.type + ' {';
    var styleKeys = Object.keys(this.styles);
    for (let index = 0; index < styleKeys.length - 1; index++) {
        var styleKey = styleKeys[index];
        result = result + styleKey + ':' + this.styles[styleKey] + ', '
    }
    if (styleKeys.length > 0) {
        result = result + styleKeys[styleKeys.length - 1] + ':' + this.styles[styleKeys[styleKeys.length - 1]];
    }
    result = result + '}'
    for (let index = 0; index < this.children.length; index++) {
        var element = this.children[index];
        result = result + "\n" + element.toString(indent+2);
    }
    return result;
}


var definition = {
    type: 'html',
    children: [{
        type: 'head' 
    }, {
        type: 'body', 
        children: [{
            type: 'div',
            children: [{
                type: 'div', 
                children: [{
                    type: 'h1', 
                    //contents: "Soy H1",
                }, {
                    type: 'p',  
                   // contents: "Soy P 1",
                }, {
                    type: 'p',  
                    //contents: "Soy P 2",
                }]
            }, {
                type: 'section', 
                children: [{
                    type: 'h1',  
                    //contents: "Soy H1   4",
                }, {
                    type: 'p',   
                  //  contents: "Soy p   24",
                }, {
                    type: 'p'   
                }]
            }]
        }, {
            type: 'aside', 
            children: [{
                type: 'h1',  
                contents: "Soy H1  5",
            }, {
                type: 'p'   
            }, {
                type: 'p'   
            }]
        }]
    }]
}

/*
 * La raiz del dom será el primer elemento de nuestras definiciones.
 */
var dom = new DomElement(definition.type, definition.children);

/*
Podemos probar añadir unos estilos y ver que sucede
*/

dom.children[1].styles = {
    background: 'red',
    color: 'blue'
};

dom.children[1].children[0].children[0].styles = {
    size: 17,
    color: 'green'
};

console.log(' ')
//console.log(dom.toString(), "toString");
/**************** PUNTO 1 ******************************/

/*
Queremos poder contar con una definición de estilos como a la siguiente.
*/
var styles = {
    'body section': {
        color: 'green',
        size: 25
    },
    'body': {
        background: 'black'
    },
    'h1': {
        size: 50,
        color: 'red'
    },
    'aside h1': {
        size: 30
    }
};

/*
El objetivo, es poder aplicar esos estilos a cada elemento del dom
según indique la regla asociada.
Ej. si la regla es "h1", entonces el estilo se aplica a todos los elementos
de tipo h1, pero si es "body h1" entonces se aplica a los h1 que están
dentro de body.

Más aún, los estilos se heredan según jerarquía. Si por ejemplo, si
"body" tiene color "red", entonces todos los hijos de body también
tendrán color "red", salvo que haya una regla que indique lo contrario.

Se pide entonces que implemente el comportamiento de getStyle
para que se le pueda preguntar a cualquier elemento del dom por sus
estilos completos, que incluyen tanto los declarados como los heredados.

Luego cree un metodo "viewStyleHierarchy" que imprima todos los nodos
con sus estilos completos (los propios y heredados), de forma similar a
toString (pero con tooooooodos los estilos).
*/
DomElement.prototype.getStyle = function (type){
    var result = '';
    if (this.type == type){
       return this.styles;
    }else{
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].type == type){                
                result = this.children[i];
            }else{
                result += this.children[i].getStyle(type);
            };
        };
    };
    return result;
};
console.log(dom.getStyle('div'))

DomElement.prototype.viewStyleHierarchy = function (){
    DomElement.prototype.makeHierarchy = function (){
        for (let i = 0; i < this.children.length; i++) {         
                for(key in this.styles){
                    this.children.forEach( child => {
                        console.log("", child.styles.hasOwnProperty(key))
                        if(!child.styles.hasOwnProperty(key)){                           
                            child.styles[key] = this.styles[key]
                        };
                    });
                } 
            this.children[i].makeHierarchy();
        };
    };
    this.makeHierarchy();
    return this.toString();
};

console.log(dom.viewStyleHierarchy())

//-------------------

DomElement.prototype.addStyle = function(defNodos, styles){
    var nodos = defNodos.split(' ')
    let self = this
    const put = (nodos, nodo, toCompare = ' ', search = true) => {
        nodo.children.forEach(function(el){
            nodos.forEach(function(ref_el){
                if(ref_el == el.type && search){
                    toCompare += el.type + " ";
                }
            })
            if(defNodos == toCompare.trim()){
                el.styles = styles;
                search = false
            }               
            put(nodos, el, toCompare, search); 
        })
    }
    put(nodos, self);
}
//---------TEST----------
 dom.addStyle('body section', {
     color: 'green',
     size: 25
 })
 dom.addStyle('body section p', {
     color: 'red',
     size: 17
 })
 console.log(dom.toString())


 DomElement.prototype.getStyles = function (type){
    let self = this
    this.getStyle();
    const get = (type, node, result = '') => {
        node.children.forEach(function(nod){
        
            if (nod.type == type){
                result += nod.type + ":" + JSON.stringify(nod.styles) + "\n";
            }
            result = get(type, nod, result);
        })      
       return result
    }
    let fullStyle = get(type, self)
    return fullStyle;
};
//----------------
console.log(dom.getStyles('h1'))

DomElement.prototype.viewStyleHierarchy = function (){
    this.getStyle();
    return this.toString();
};
//----------------
console.log(dom.viewStyleHierarchy())







/**************** PUNTO 2 ******************************/

/*
Queremos agregar la idea de eventos, para que distintos elementos
del DOM puedan reaccionar ante diversos eventos.
Cada elemento del dom debe entender tres metodos más:

* on(nombreDeEvento, handler)
* off(nombreDeEvento)
* handle(nombreDeEvento)

Por ejemplo, podemos decir

dom.children[1].children[0].children[0].on('click', function() {
    console.log('Se apretó click en html body div div');
    return true;
})

El código de la función queda asociado al evento 'click' para ese
elemento del dom, y se activará cuando se haga el handle del evento.

dom.children[1].children[0].children[0].handle('click');


El tema es que queremos poder usar 'this' en la función para referirnos
al objeto que acaba de hacer el "handle" de la función. Ej.

dom.children[1].children[0].children[0].on('click', function() {
    console.log('Se apretó click en un ' + this.type);
    return true;
})

Por otro lado, cuando se hace el handling de un evento, este realiza
el proceso de bubbling-up, es decir, todo padre que también sepa manejar
el evento del mismo nombre debe activar el evento.

Por ejemplo, si activamos 'click' en dom.children[1].children[0].children[0]
y dom.children[1] también sabe manejar 'click', entonces, luego de ejecutar
el 'click' para dom.children[1].children[0].children[0], se deberá hacer el
bubbling-up para que dom.children[1] maneje 'click'. Hay una excepción, sin
embargo. Cuando el handler de un hijo describe falso luego de ejecutar,
el bubbling-up se detiene.

off por su parte, desactiva el handler asociado a un evento.

Se pide entonces que realice los cambios pertinentes para que los elementos
del dom puedan tener este comportamiento.
*/


//recibe evento
DomElement.prototype.handle = function(event){
    let proto = this.__proto__;   
    if (this.type == 'html' && this.handlerEvent.event == event){       
        this.handlerEvent.code.bind(this)(); 
    }else if(proto.type != null && this.handlerEvent.event == event){
       
        if(this.handlerEvent.code.bind(this)()){  
            proto.handlerEvent = this.handlerEvent;
            proto.handle(event); 
         };
    };
};
DomElement.prototype.off = function(event){
    if (this.handlerEvent.event == event) {
        this.handlerEvent = {}
    };
};

DomElement.prototype.on = function(event, code){
    this.handlerEvent = { event, code };
};

//  dom.children[1].children[0].children[0].on('click', 
//      function(){console.log("me hizo click: " + this.type); return true})

    
//  console.log(dom.children[1].children[0].children[0].handle('click'))

//  dom.children[1].children[0].children[0].on('click', 
//      function(){console.log("me hizo click: " + this.type); return false})

//  console.log(dom.children[1].children[0].children[0].handle('click'))

//  dom.children[1].children[0].children[0].off('click')
//  console.log(dom.children[1].children[0].children[0].eventElement)


/*



dom.children[1].children[0].children[0].on('click', 
    function(){console.log("a"); return true})

debugger;
console.log(dom.children[1].children[0].children[0].handle('click'))

*/





/**************** PUNTO 3 ******************************/

/*
Queremos poder mostrar los nodos del dom de forma bonita
en la terminal, mediante el metodo display.

dom.display()

No todo nodo es visible sin embargo. Solo los elementos del body
deben mostrarse en este caso, ya que el head y html son solo
contenedores. Lo mismo ocurre con div, section y aside, que son
elementos invisibles.

Así, en este caso, solo vamos a mostrar los elementos h1 y p.
Pero ¿Qué mostramos de ellos? Para hacer la cosa más divertida, vamos
a agregar un atributo "contents" que nos permita agregar un texto
a esos elementos como contenido. Ese texto será el que se muestre
cuando llamemos a display.

Más aún, cada elemento se muestra de forma distinta según su tipo.
p muestra contents tal cual, pero h1 lo muestra todo en mayúscula, siempre.
Además el color del texto y del fondo depende del estilo del elemento,
(Ver https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color)
*/

var clc = require("cli-color");


DomElement.prototype.display = function(){
    function printeable(dis){

        let color = dis.styles.color || 'black';
        let background = dis.styles.background || 'white';
        let addBg = 'bg' + background.charAt(0).toUpperCase() + background.slice(1);
       if(dis.type == 'p' && dis.contents){

           console.log("Print P: ", clc[`${color}`][`${addBg}`](dis.contents))
       }else if(dis.type == 'h1'  && dis.contents){
           console.log("Print h: ", clc[`${color}`][`${addBg}`](dis.contents))
           
       }
       dis.children.forEach(function(_dis){
          printeable(_dis);
       })
    }
     let dis = this;
     if(dis.type == 'html'){
         dis = dis.children[1];
     }
     printeable(dis);
       
   }

//    dom.children[1].children[0].children[1].children[0].contents = 'Soy una etiqueta h1'
//    dom.children[1].children[0].children[1].children[0].styles = {color: 'white'}
   
//    dom.children[1].children[0].children[1].children[1].contents = 'Soy una etiqueta p'
//    dom.children[1].children[0].children[1].children[1].styles = {color: 'red', background: 'redBright'}
   
//    dom.children[1].children[0].children[1].children[2].contents = 'Soy la etiqueta p siguiente'
//    dom.children[1].children[0].children[1].children[2].styles = {color: 'white'}

//   dom.display();

   //console.log("Test")