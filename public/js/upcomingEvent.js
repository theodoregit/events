const filter_bar = document.querySelector(".filter_bar");
// const filterOutput = document.querySelector(".output");
const filter = document.querySelector(".filter");
const apply_btn = document.querySelector(".apply_filter");
const filterCloseBtn = document.querySelector(".filter-close-btn")

filter_bar.addEventListener("click", () =>{
   
    filter.classList.toggle("showFilter");
    
    // output.classList.add("hideOutput");

    // filter_bar.style.display = "none";

});

apply_btn.addEventListener("click", ()=>{
    filter.classList.remove("showFilter");
    // filterOutput.classList.remove("hideOutput");
    // filter_bar.style.display = "block";
});

filterCloseBtn.addEventListener("click", ()=>{
    filter.classList.remove("showFilter")
})

// filter.addEventListener("click", function(event) {
   
//     let target = e.target;
//     console.log(target);
// }, false);

function dropdown(event){
    
    let content = event.target.nextElementSibling;
    content.classList.toggle("form_item_hide_show");
}



