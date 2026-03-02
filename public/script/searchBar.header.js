
document.getElementById("searchInput")
.addEventListener("keyup",function(e){
    if(e.key === "Enter"){
        searchProducts();
    }
})

// async function searchProducts() {
//     console.log("searchProduct excicuted");
//     const query = document.getElementById("searchInput").value;   

//     if(!query) return;

//     try {
//         const res = await axios.get(`/user/search?q=${query}`);

//         const products = res.data;
//         const resultContainer = document.getElementById("searchResults");

//         resultContainer.innerHTML = "";

//         if(products.length === 0) {
//             resultContainer.innerHTML = "<p>No products found</p>";
//             return ;
//         }

//         products.forEach(product => {
//             resultContainer.innerHTML +=`
//             <div class="border p-4 rounded-lg">
//                     <h3 class="font-bold">${product.name}</h3>
//                     <p class="text-sm text-gray-500">
//                         ${product.categoryId?.name || ""}
//                     </p>
//                     <p class="text-sm">${product.description || ""}</p>
//                 </div>
//             `;
//         });

//     } catch (error) {
//         console.log(error);
        
       
        
//     }
// }