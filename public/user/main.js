jQuery(document).ready(function($) {
	'use strict';

	$('.demo-filter a').on('click', function(e) {
		e.preventDefault();
		var filter = $(this).attr('href').replace('#', '');
		$('.demos').isotope({ filter: '.' + filter });
		$(this).addClass('active').siblings().removeClass('active');
	});

	$('.molla-lz').lazyload({
		effect: 'fadeIn',
		effect_speed: 400,
		appearEffect: '',
		appear: function(elements_left, settings) {
			
		},
		load: function(elements_left, settings) {
			$(this).removeClass('molla-lz').css('padding-top', '');
		}
	});

	// Mobile Menu Toggle - Show & Hide
	$('.mobile-menu-toggler').on('click', function (e) {
		$('body').toggleClass('mmenu-active');
		$(this).toggleClass('active');
		e.preventDefault();
	});

	$('.mobile-menu-overlay, .mobile-menu-close').on('click', function (e) {
		$('body').removeClass('mmenu-active');
		$('.menu-toggler').removeClass('active');
		e.preventDefault();
	});

	$('.goto-demos').on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: $('.row.demos').offset().top}, 600);
	});

	$('.goto-features').on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: $('.section-features').offset().top}, 800);
	});

	$('.goto-elements').on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: $('.section-elements').offset().top}, 1000);
	});

	$('.goto-support').on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: $('.section-support').offset().top}, 1200);
	});
});

jQuery(window).on('load', function() {
	jQuery('.demos').isotope({
		filter: '.homepages',
		initLayout: true,
		itemSelector: '.iso-item',
		layoutMode: 'masonry'
	}).on('layoutComplete', function(e) {
		jQuery(window).trigger('scroll');
	});
});


// otp page js

const inputs = document.querySelectorAll(".otp-field > input");
const button = document.querySelector(".btn");

window.addEventListener("load", () => inputs[0].focus());
button.setAttribute("disabled", "disabled");

inputs[0].addEventListener("paste", function (event) {
  event.preventDefault();

  const pastedValue = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  const otpLength = inputs.length;

  for (let i = 0; i < otpLength; i++) {
    if (i < pastedValue.length) {
      inputs[i].value = pastedValue[i];
      inputs[i].removeAttribute("disabled");
      inputs[i].focus;
    } else {
      inputs[i].value = ""; // Clear any remaining inputs
      inputs[i].focus;
    }
  }
});

inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input;
    const nextInput = input.nextElementSibling;
    const prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }

    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    if (e.key === "Backspace") {
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }

    button.classList.remove("active");
    button.setAttribute("disabled", "disabled");

    const inputsNo = inputs.length;
    if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
      button.classList.add("active");
      button.removeAttribute("disabled");

      return;
    }
  });
});

// otp timer

// function startCountdown(durationInSeconds) {
// 	const timerElement = document.getElementById("timer");
// 	let timeLeft = durationInSeconds;

// 	const countdownInterval = setInterval(function() {
// 		const minutes = Math.floor(timeLeft / 60);
// 		const seconds = timeLeft % 60;

// 		const minutesStr = String(minutes).padStart(2, '0');
// 		const secondsStr = String(seconds).padStart(2, '0');

// 		timerElement.textContent = `${minutesStr}:${secondsStr}`;

// 		if (timeLeft <= 0) {
// 			clearInterval(countdownInterval);
// 			timerElement.textContent = "00:00";
// 			timerElement.textContent="The OTP has expired"
// 		} else {
// 			timeLeft--;
// 		}
// 	}, 1000);
// }

// startCountdown(59);


// Add an event listener to the OTP form for submission
document.getElementById("otpForm").addEventListener("submit", function (event) {
	// Prevent the default form submission behavior
	event.preventDefault();

  
	// Reset the countdown storage
	resetCountdownStorage();

	this.submit();
  });




function startCountdown(durationInSeconds, redirectToURL) {
    const timerElement = document.getElementById("timer");
    let timeLeft = durationInSeconds;

    // Check if there is a stored timeLeft value in localStorage
    const storedTimeLeft = localStorage.getItem("timeLeft");

    if (storedTimeLeft) {
      timeLeft = parseInt(storedTimeLeft);
    }

    const countdownInterval = setInterval(function() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      const minutesStr = String(minutes).padStart(2, '0');
      const secondsStr = String(seconds).padStart(2, '0');

      timerElement.textContent = `${minutesStr}:${secondsStr}`;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        timerElement.textContent = "00:00";
        timerElement.textContent = "The OTP has expired";

        // Remove the stored timeLeft value from localStorage
        localStorage.removeItem("timeLeft");

        // Redirect to the specified URL
        window.location.href = redirectToURL;
      } else {
        timeLeft--;

        // Store the remaining time in localStorage
        localStorage.setItem("timeLeft", timeLeft.toString());
      }
    }, 1000);
  }

  function resetCountdownStorage() {
	localStorage.removeItem("timeLeft");
  }
