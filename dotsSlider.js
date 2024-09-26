//  CS- DOTS SLIDER WITH GRABBER

document.addEventListener("DOMContentLoaded", function () {
  // Target both sections - add any slider sections you want dots on here in this format
  const sections = [
    document.querySelector(
      'section[data-section-id="66e951c94872df2949f5ee65"]'
    ),
    document.querySelector(
      'section[data-section-id="66e3b6fe1467954d4750e8c5"]'
    ),
  ];

  sections.forEach((section) => {
    if (!section) return;

    const slides = section.querySelectorAll(".user-items-list-carousel__slide");
    if (slides.length === 0) return;

    const dotContainer = document.createElement("div");
    dotContainer.className = "dot-indicators";

    slides.forEach((slide, index) => {
      const dot = document.createElement("div");
      dot.className = "dot-indicator";
      if (index === 0) {
        dot.classList.add("active");
      }
      dotContainer.appendChild(dot);
    });

    section
      .querySelector(".user-items-list-carousel__slideshow-holder")
      .appendChild(dotContainer);

    let currentSlideIndex = 0;

    const updateActiveDot = () => {
      const dots = section.querySelectorAll(".dot-indicator");
      dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    };

    const nextSlide = () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateActiveDot();
    };

    const prevSlide = () => {
      currentSlideIndex =
        (currentSlideIndex - 1 + slides.length) % slides.length;
      updateActiveDot();
    };

    // Arrow selectors for desktop
    const nextButton = section.querySelector(
      ".user-items-list-carousel__arrow-button--right"
    );
    const prevButton = section.querySelector(
      ".user-items-list-carousel__arrow-button--left"
    );

    // Arrow selectors for mobile
    const mobileNextButton = section.querySelector(
      ".mobile-arrow-button--right"
    );
    const mobilePrevButton = section.querySelector(
      ".mobile-arrow-button--left"
    );

    // Add event listeners for desktop arrow buttons
    if (nextButton) {
      nextButton.addEventListener("click", nextSlide);
    }
    if (prevButton) {
      prevButton.addEventListener("click", prevSlide);
    }

    // Add event listeners for mobile arrow buttons
    if (mobileNextButton) {
      mobileNextButton.addEventListener("click", nextSlide);
    }
    if (mobilePrevButton) {
      mobilePrevButton.addEventListener("click", prevSlide);
    }

    // GRABBER FUNCTIONALITY
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    const slideshowHolder = section.querySelector(
      ".user-items-list-carousel__slideshow-holder"
    );

    const setSliderPosition = () => {
      slideshowHolder.style.transform = `translateX(${currentTranslate}px)`;
    };

    const animation = () => {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    };

    const touchStart = (index) => {
      return function (event) {
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
      };
    };

    const touchMove = (event) => {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    };

    const touchEnd = () => {
      cancelAnimationFrame(animationID);
      isDragging = false;

      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -100) {
        nextSlide(); // swipe left to next slide
      } else if (movedBy > 100) {
        prevSlide(); // swipe right to previous slide
      }
      currentTranslate = 0;
      prevTranslate = 0;
    };

    const getPositionX = (event) => {
      return event.type.includes("mouse")
        ? event.pageX
        : event.touches[0].clientX;
    };

    // Add event listeners for grab-and-drag functionality (both mouse and touch events)
    slideshowHolder.addEventListener("mousedown", touchStart());
    slideshowHolder.addEventListener("mousemove", touchMove);
    slideshowHolder.addEventListener("mouseup", touchEnd);
    slideshowHolder.addEventListener("mouseleave", () => {
      if (isDragging) touchEnd();
    });

    slideshowHolder.addEventListener("touchstart", touchStart());
    slideshowHolder.addEventListener("touchmove", touchMove);
    slideshowHolder.addEventListener("touchend", touchEnd);
  });
});
