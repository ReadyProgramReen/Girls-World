
// grab all the element 

const productDom = document.querySelector('.products');
const single_product = document.querySelector('.single_product');
const singleProductDom = document.querySelector('[data-singleProdut]');
const closeSinglepProduct = document.querySelector('.close');
const searchBar = document.querySelector('.searchBar');

// shop cart
const cartDom = document.querySelector('.shop_cart');
const cartIcon = document.querySelector('.shop_icon');
const shopCart = document.querySelector('[data_shopCart]');
const shopCount = document.querySelector('.shopCount');
const removeAll = document.querySelector('.remove_all');
const totalPrice = document.querySelector('.total');
// store in the localStorage
class Storage{
     static setStorage(product){
      return  localStorage.setItem('product',JSON.stringify(product));
    }

   static getStorage(){
        return JSON.parse(localStorage.getItem('product'));
      }
}

// cart 
let cart = Storage.getStorage() || [];


// fetch the data form api 


class fetchData{
    async getProducts(){
        try {
            const res = await fetch('http://localhost:50000/api/product')
            const data = await res.json()
            console.log(data)
            return data

        } catch (error) {
            console.log(error, 'something went wrong')
        }
    }
}
// display data
class displayData{
    displayProduct(data){
let products = data.map((product)=>{
    const {img_url,title,description,review,price,id} = product;
    return ` <div class="product">
    <div class='image'>
      <img src=${img_url}
      >
    </div>
    <!--         product see or add -->
    <div class='button'>
      <span class='addProduct'data-id=${id}><i class="fa-solid fa-plus"></i></span>
      <span data-id=${id} class='seeProduct'><i class="fa-regular fa-eye"></i></span>
    </div>
    <!--     product details     -->

    <div class='productBody'>
      <h3>${title}</h3>

      <div class='star'>
      ${Array(review).fill().map((_,i)=>`<span><i class="fa-sharp fa-solid fa-star"></i></span>`).join('')}
        
        
      </div>
      <span class='price'>$${price}</span>
      <p>
       ${description} </p>
    </div>
  </div>`
});
productDom.innerHTML = products.join('');
    }
    // all buttons
    getButton(data){
        productDom.addEventListener('click',({target})=>{
            // display single product
            if(target.classList.contains('seeProduct')){
                single_product.classList.add('active')
                console.log('clicked')
                const btnId = target.dataset.id;
               this. getSingleProduct(data,btnId);
            }
            // add to cart 
            if(target.classList.contains('addProduct')){
                cartDom.classList.add('active')
                const btnId =target.dataset.id;
                this.addToCart(data,btnId);
                this.updates();
            }

        })
        // close single Porduct

        closeSinglepProduct.addEventListener('click',()=>{
            single_product.classList.remove('active')
        });

    // open shoping cart
    cartIcon.addEventListener('click', ()=>{
        cartDom.classList.toggle('active');
    });

    shopCart.addEventListener('click',({target})=>{
        if(target.classList.contains('delete')){
            const btnId =target.dataset.id;
            cart = cart.filter(product => product.id !== +btnId);
            Storage.setStorage(cart);
            this.updates();
        }
    });
    // remove all button 
    removeAll.addEventListener('click',()=>{
        cart = [];
        Storage.setStorage(cart);
        this.updates()
    })

    }
    // display single product
    getSingleProduct(data,btnId){
        const newCart =data.find((product)=>product.id == +btnId);
        const {img_url,title,description,review,price,id} = newCart;
        console.log(newCart);
        const displaySingleProduct =`
        <img src=${img_url} alt="night gown">

        <div class='details'>
          <h3>${title}</h3>
          <div class='star'>
          ${Array(review).fill().map((_,i)=>`<span><i class="fa-sharp fa-solid fa-star"></i></span>`).join('')}
          </div>
          <span class='price'>$${price}</span>
          <p>
            ${description}
          </p>
          <div class="add">
            <button class="addProduct">Add to cart</button>
          </div>
        </div>
        `
        singleProductDom.innerHTML = displaySingleProduct
    }

    addToCart(data,btnId){
        const newProduct = data.find((product)=>product.id === +btnId)
        cart = [...cart,newProduct];
        Storage.setStorage(cart);
        this.updates();
    }

    // display cart 
    displayCart(){
        const cartProduct = cart.map((product)=>{
            const {img_url,description,title,price,id}=product
            return `
            <div class='product' >
            <img src=${img_url}>
            <div class='texts'>
              <h3>${title}</h3>
              <span >$${price}</span>

              <div class='remove'>
                <button data-id=${id} class= 'delete'>remove</button>
              </div>
            </div>
          </div> 
          `
        });
        shopCart.innerHTML = cartProduct.join('');
    }

    shopCounter(){
        shopCount.innerHTML = cart.length;
        
    }
    updates(){
        this.shopCounter();
    this.displayCart();
    this.getTotalPrice()

    if(cart.length <= 0){
        cartDom.classList.remove('active')
    }
    }

    // calculate the total price
    getTotalPrice(){
        let total = 0;
        cart.map((product)=>{
            total += product.price
        });
        totalPrice.innerHTML = `$${total.toFixed(2)}`
    }
    // search Product
    searchProduct(data){
        searchBar.addEventListener('input',({target})=>{
           const value = target.value;
           let newProduct= data.filter((product)=>{
               return product.description.toLowerCase().includes(value);
           });
            this.displayProduct(newProduct);
            this.updates();
        })
    }

}
// store in local storage 

// display in browswer
window.addEventListener('DOMContentLoaded',()=>{
    // make class instance

    const products = new fetchData();
    const UI = new displayData();
    UI.updates()

    products.getProducts().then((product) => {
        UI.displayProduct(product);
        UI.getButton(product);
        UI.searchProduct(product)
        Storage.getStorage(product)
    });
})