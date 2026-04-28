// Індекс поточного слайду
var slideIndex = 1;
showSlides(slideIndex);

// Наступний слайд
function plusSlide() {
    showSlides(slideIndex += 1);
}

// Попередній слайд
function minusSlide() {
    showSlides(slideIndex -= 1);
}

// Відображення слайдів
function showSlides(n) {
    let slides = document.getElementsByClassName("item");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active");
    }
    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("active");
}
