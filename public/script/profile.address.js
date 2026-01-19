
/* -------------------- ADD ADDRESS MODULE -------------------- */

    function openModal() {
      document.getElementById("openAddessModal").style.display = "flex";
      document.body.classList.add("modal-open");
    }

    function closeModal() {
      document.getElementById("openAddessModal").style.display = "none";
      document.body.classList.remove("modal-open");
    }
    
    const pincodeInput = document.getElementById("pincode");

    pincodeInput.addEventListener("blur", fetchPincodeDetails);

    async function fetchPincodeDetails() {
      const pincode = document.getElementById("pincode").value;

      // Basic validation
      if (pincode.length !== 6) return;

      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await res.json();

        if (data[0].Status !== "Success") {
          alert("Invalid pincode");
          return;
        }

        const postOffice = data[0].PostOffice[0];

        document.getElementById("city").value = postOffice.District;
        document.getElementById("state").value = postOffice.State;
      } catch (error) {
        console.error("Pincode fetch failed", error);
      }
    }
  