 
const express=require("express"); 
const store=express();
const files=require("node:fs"); 
const css=require("./scripts/css code.js");
let selectedProducts=[];  
const product=require("./scripts/products.js");
const BUY_CLICK=`<script>document.getElementById("buy").addEventListener("click", function(){
         let selected="";
          
         for(let item of document.getElementById("products").children){
             if(item.children[1].checked)
                 selected+=item.children[0].textContent+",";
         
        }
        if(selected.length>0)  
          window.location.href="/buy/"+selected;
});
  </script>`
;
function Find(productList, desiredProduct){
    for(let position=0; position<productList.length; position++)
        if(productList[position].name==desiredProduct)
            return position;
}
function GetSelectedProductsInfo(request, response, next){
    selectedProducts=[];
    const items=request.params.items.split(",");
    
    for(let item of items){    
        for(let current of product.products){
            
            if(current.name==item){
                 selectedProducts.push(current);
                 break;
            }
        }
    }
    next();
}
 
 


store.get("/", async function(request, response){
   
    response.send(`${css.BODY}${css.LIST}${product.Product.CreateProductList(product.products)}<button id="buy" >Buy</button>${BUY_CLICK}`);
    
}); 

store.get("/productInfo/:name", function(request, response){
    for(let current of product.products){
        if(current.name==request.params["name"])
            response.send(`${current.toString()}<button onclick="window.location.href='/'">Back</button>`);
    }
    
});
store.use("/buy/:items", GetSelectedProductsInfo);
function CalculateTotal(){
  let total=0;
  for(let current of selectedProducts)
      total+=current.price;
  return total;
}

store.set("views", "./templates");
store.set("view engine", "sum");
store.use(function(request, response, next){
      if(selectedProducts.length==1)
        console.log(`${selectedProducts.length} product selected.`);
      else
        console.log(`${selectedProducts.length} products selected.`);
      next();
});
store.get("/buy/:items", function(request, response){
    if(selectedProducts.length>0)
       response.render("summary.sum", selectedProducts);
    else
        response.send("<h1>You do not have any products you selected to buy.</h1><br> <a href='/'>Click here to return to the home page</a>");
}); 
 
store.engine("sum", function(path, options, callback){
    const fileContent=files.readFile(path, function(error){
        try{
            let content=`${css.BODY}${css.TABLE}${css.ORDER_COMPLETION}<table><tr><th colspan='3'>Shopping Summary</th></tr><tr><th>Product Name</th><th>Price</th><th>Delete</th></tr>`;
            for(let current of selectedProducts){
                content+=`<tr>${current.ToRow()}<td><button onclick="const item=this.parentElement.parentElement.children[0].textContent; window.location.href='/delete/'+item">Delete</button></td></tr>`;
            }
            content+=`<tr><th>Total Price:</th><th colspan='2'>$${CalculateTotal()}</th></tr></table><br><div id="order-completion"><button id="finish" onclick="window.location.href='/finishedBuying'">Finish Buying</button><button id="cancel" onclick="window.location.href='/'">Cancel</button></div>`;
            return callback(null, content);
        }
        catch(ex){
            return "Unable to display bought items.";
        }
    });
});
function ProductsToString(){
    let productString="";
   if(selectedProducts.length>0){
    productString=selectedProducts[0].name;
      for(let position=1; position<selectedProducts.length; position++){
         productString+=","+selectedProducts[position].name;
      }
   }
   return productString;

}
 
function NoProductsSelected(error, request, response, next){
    if(selectedProducts.length==0)
        response.send(`<h1>Successfully bought ${itemList}.</h1><br> <button onclick="window.location.href='/'">Continue Shopping</button>`);
    next();
}
store.use(NoProductsSelected);
store.get("/finishedBuying", function(request, response){
    if(selectedProducts.length>0){
    let itemList=selectedProducts[0].name;
      for(let position=1; position<selectedProducts.length; position++) 
         itemList+=","+selectedProducts[position].name;
         response.send(`<h1>Successfully bought ${itemList}.</h1><br> <button onclick="window.location.href='/'">Continue Shopping</button>`);
    }
    else
        response.send("<h1>No products bought</h1><br><a href='/'>Click here to return to the home page</a>");
     
    
}); 
store.post("/finishedBuying", function(request, response){
  response.send(selectedProducts);
   
});

store.put("/finishedBuying", function(request, response){
   
   response.send(ProductsToString());
    
});
 
store.get("/delete/:item", function(request, response){
   
   response.send(`<h1>Removing ${request.params.item} from shopping list</h1><button onclick="window.location.href='/buy/${request.params.items}'">Go Back</button>`);
  
});
store.delete("/delete/:item", function(request, response){
    const location=Find(selectedProducts, request.params.item);
    selectedProducts.splice(location, 1);
})

store.listen(4000);


