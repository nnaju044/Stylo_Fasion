let loaderTimer;

function showLoader(){
  loaderTimer = setTimeout(()=>{
    const loader = document.getElementById("globalLoader");
    if(loader) loader.style.display="flex";
  },200);
}

function hideLoader(){
  clearTimeout(loaderTimer);
  const loader = document.getElementById("globalLoader");
  if(loader) loader.style.display="none";
}

axios.interceptors.request.use(config => {
  showLoader();
  return config;
});

axios.interceptors.response.use(
  response => {
    hideLoader();
    return response;
  },
  error => {
    hideLoader();
    return Promise.reject(error);
  }
);