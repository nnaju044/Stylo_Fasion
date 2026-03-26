let filters = {
    size: null,
    metal: null,
    min: null,
    max: null
};

document.addEventListener("DOMContentLoaded",async () =>{
    // ================== FAVORITES ==================
const favButtons = document.querySelectorAll(".fav-btn");

if (favButtons.length) {

  let favoriteCache = new Set();

  try {
    const res = await axios.get("/user/api/favorites");

    const favorites = res.data?.favorites || [];

    favoriteCache = new Set(
      favorites.map(item => item._id.toString())
    );

    favButtons.forEach(btn => {
      if (favoriteCache.has(btn.dataset.id)) {
        btn.classList.add("active");
      }
    });

  } catch (err) {
    console.error("Error loading favorites:", err);
  }

 

}
})

 // TOGGLE
  async function toggleFavorite(btn) {
  const productId = btn.dataset.id;
  const icon = btn.querySelector("i");

  try {
        
    const res = await axios.post(`/user/api/favorites/${productId}`);


    if (res.data.isFavorite) {
      icon.classList.remove("text-gray-400");
      icon.classList.add("text-red-600");
    } else {
      icon.classList.remove("text-red-600");
      icon.classList.add("text-gray-400");
    }

  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const categoryId = window.categoryId;
    console.log("before fetch", categoryId);

    if (!categoryId) {
        console.log("Category filters disabled (search page)");
        return;
    }

    async function fetchProducts() {
        try {
            const response = await axios.get(
                `/user/api/category/${categoryId}`,
                { params: filters }
            );

            if (response.data.success) {
                renderProducts(response.data.products);
            }
        } catch (error) {
            console.log("Axios error:", error);
        }
    }

    function renderProducts(products) {
        const grid = document.querySelector(".grid.grid-cols-3");

        grid.innerHTML = "";

        if (!products.length) {
            grid.innerHTML = `
                <div class="col-span-3 text-center py-20">
                    <p class="text-gray-500 text-lg">No products found</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            grid.innerHTML += `
        <div class="product-card group relative cursor-pointer">

          <div class="w-full aspect-square rounded-lg overflow-hidden mb-3">
            <img src="${product.image}" 
                 alt="${product.name}"
                 class="w-full h-full object-cover"/>
          </div>

          <h3 class="text-sm font-medium text-gray-800 mb-1">
            ${product.name}
          </h3>

          <p class="text-sm font-semibold text-gray-900">
            ₹${product.price}
          </p>

        </div>
      `;
        });
    }

   
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            filters.size = this.dataset.size;
            fetchProducts();
        });
    });

   
    document.querySelectorAll(".swatch[data-metal]").forEach(sw => {
        sw.addEventListener("click", function () {

            if (filters.metal === this.dataset.metal) {
                filters.metal = null;
                this.style.boxShadow = "";
            } else {
                filters.metal = this.dataset.metal;

                document.querySelectorAll(".swatch[data-metal]")
                    .forEach(s => s.style.boxShadow = "");

                this.style.boxShadow = "0 0 0 3px rgba(139,26,26,0.4)";
            }

            fetchProducts();
        });
    });

    document.querySelectorAll("[data-min]").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            if (
                filters.min === this.dataset.min &&
                filters.max === this.dataset.max
            ) {
                filters.min = null;
                filters.max = null;
            } else {
                filters.min = this.dataset.min;
                filters.max = this.dataset.max;
            }

            fetchProducts();
        });
    });


    
});
