
function Find(product){
    for(let position=0; position<selected.length; position++)
         if(selected[position].name==product.name)
            return position;
    return -1;
}
 class Product{
    constructor(name, price){
        this.name=name;
        this.price=price;
    }
    static CreateProductList(products){
        let productList="<ul id='products'>";
        for(let product of products){
           
            productList+=`<li> <span>${product.name}</span> <input type="checkbox" ><button style="background-color:orange; color:green;" onclick="window.location.href='/ProductInfo/${product.name}'">View Info</button></li>`;   
        }
        productList+="</ul>";
        return productList;
    }
   
    toString(){
        return `Name ${this.name}\nPrice $${this.price}`;
    }
     ToRow(){
        return `<td>${this.name}</td><td>$${this.price}</td>`;
    }
}

const products=[new Product("Bag", 20), new Product("Shirt", 10), new Product("Blanket", 15), new Product("Mattress",50)];
module.exports={Product, products};
