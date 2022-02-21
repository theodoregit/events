const closeBtn = document.querySelector(".close-btn")
const burger = document.querySelector(".menu-bar");
const navLinks = document.querySelector(".nav-links");

const sideNav = () =>{
    

    burger.addEventListener("click", ()=>{
        navLinks.classList.toggle("nav-active");
    })
}

const app = () =>{
    sideNav();
}

app();

// ****************** Testimonial Slider **************//

var slideNumber = 1;
showTestimonial(slideNumber);

function changeSlide(n){
  showTestimonial(slideNumber += n);
}

function showTestimonial(n) {
  var i;
  var testimonials = document.getElementsByClassName("testimonial");
  if (n > testimonials.length) {slideNumber = 1}
  if (n < 1) {slideNumber = testimonials.length}
  for (i = 0; i < testimonials.length; i++) {
      testimonials[i].style.display = "none";
  }
  testimonials[slideNumber-1].style.display = "block";

}

closeBtn.addEventListener("click", ()=>{
  navLinks.classList.remove("nav-active")
})