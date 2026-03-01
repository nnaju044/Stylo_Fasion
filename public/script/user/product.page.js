// Size filter toggle
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Swatch selection highlight
document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', function () {
        this.style.boxShadow = this.style.boxShadow ? '' : '0 0 0 3px rgba(139,26,26,0.4)';
    });
});


document.addEventListener("DOMContentLoaded", function () {

    const categoryId = window.categoryId;

    let filters = {
        size: null,
        metal: null,
        min: null,
        max: null
    };

    async function fetchProducts() {
        try {
            const response = await axios.get(
                `/api/category/${categoryId}`,
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
          <p class="text-gray-400 text-lg">No products found</p>
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

    // Size filter
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            filters.size = this.dataset.size;
            fetchProducts();
        });
    });

    // Metal filter
    document.querySelectorAll(".swatch[data-metal]").forEach(sw => {
        sw.addEventListener("click", function () {
            filters.metal = this.dataset.metal;
            fetchProducts();
        });
    });

    // Price filter
    document.querySelectorAll("[data-min]").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            filters.min = this.dataset.min;
            filters.max = this.dataset.max;
            fetchProducts();
        });
    });

});
