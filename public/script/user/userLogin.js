


    document.getElementById("loginSubmit").addEventListener("click",(e) =>{
    e.preventDefault();
    console.log("loginSubmit rinning")
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const emailErr = document.getElementById("emailErr");
    const passErr = document.getElementById("passwordErr");
    let isValid = true;

    emailErr.innerText = "";
    passErr.innerText = "";

    if(!email.value.trim()){
        emailErr.innerText = "Email required";
        isValid = false;
    }

     if(!password.value.trim()){
        passErr.innerText = "Password required";
        isValid = false;
    }

     if (isValid) {
        document.getElementById("loginForm").submit();
    }
});
