window.onload = function() {
  console.log("Swagger Custom JS Loaded");
  
  const injectToken = (authInput, token) => {
      const bearerToken = 'Bearer ' + token;
      authInput.value = bearerToken;
      const event = new Event('input', { bubbles: true });
      authInput.dispatchEvent(event);
      console.log("Token injected into Swagger UI");
  };

  const observer = new MutationObserver((mutations, obs) => {
      const authInput = document.querySelector('input[type="text"][placeholder="Bearer token"]');
      if (authInput) {
          const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
          if (token) {
              console.log("Token found:", token);
              injectToken(authInput, token);
          } else {
              console.log("No token found in storage.");
          }
          obs.disconnect(); // Stop observing once the input is found
      }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
