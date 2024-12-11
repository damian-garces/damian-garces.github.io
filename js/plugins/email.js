(function() {
  emailjs.init("yEBL7t5_0M1T4Krsb"); // Replace with your EmailJS user ID
})();

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const loader = document.getElementById("email-loader"); // Get the loader element
    loader.style.display = "flex"; // Show the loader
  
    if (document.getElementById('consent').checked) {
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message
      };
  
      emailjs.send('service_9kjjemm', 'template_mdiyi2l', templateParams)
        .then(function(response) {
          document.getElementById("contact-form").reset();
          alert('Message sent successfully!');
        }, function(error) {
          alert('Failed to send message. Please try again later.');
        })
        .finally(() => {
          // Hide the loader
          loader.style.display = "none";
        });
    } else {
      loader.style.display = "none"; // Hide the loader
      alert('You must consent to the processing of your data');
    }

    return false; // Explicitly stop default behavior for older browsers
  });
});

  

