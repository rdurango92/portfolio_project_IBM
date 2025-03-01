document.addEventListener('DOMContentLoaded', function() {
  // Inicializar animaciones
  initAnimations();
  
  // Añadir evento para el botón de volver arriba con scroll suave
  document.querySelector('.iconbutton').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Inicializar eventos para las tarjetas de habilidades
  initSkillCards();
  
  // Añadir navegación suave para todos los enlaces de la navegación
  document.querySelectorAll('.topmenu').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Mostrar/ocultar el botón de volver arriba según el scroll
  window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.iconbutton');
    if (window.scrollY > 300) {
      scrollButton.style.opacity = '1';
      scrollButton.style.pointerEvents = 'all';
    } else {
      scrollButton.style.opacity = '0';
      scrollButton.style.pointerEvents = 'none';
    }
  });
  
  // Añadir efecto de typing al título principal
  const titleElement = document.getElementById('main-title');
  if (titleElement) {
    const text = titleElement.innerText;
    titleElement.innerHTML = '';
    
    setTimeout(() => {
      typeEffect(titleElement, text);
    }, 500);
  }
  
  // Añadir efecto de resaltado para la navegación activa
  highlightActiveSection();
  window.addEventListener('scroll', highlightActiveSection);
});

function typeEffect(element, text, speed = 50) {
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      // Añadir el cursor parpadeante al final
      element.insertAdjacentHTML('beforeend', '<span class="cursor">|</span>');
      
      // Agregar animación CSS para el cursor
      const style = document.createElement('style');
      style.textContent = `
        .cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      // Remover el cursor después de 3 segundos
      setTimeout(() => {
        const cursor = element.querySelector('.cursor');
        if (cursor) cursor.remove();
      }, 3000);
    }
  }, speed);
}

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.topmenu');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = '#' + section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === currentSection) {
      item.classList.add('active');
    }
  });
}

function initAnimations() {
  // Añadir clase para animación flotante
  const profileImage = document.querySelector('.profile_image');
  if (profileImage) {
    profileImage.classList.add('floating');
  }
  
  // Animar elementos cuando aparecen en el viewport
  const animatedElements = document.querySelectorAll('.skill, .project-card, .recommendation, #about-me h1, #about-me p');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  animatedElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    observer.observe(el);
  });
}

function initSkillCards() {
  // Añadir efecto de hover 3D a las tarjetas de habilidades
  const skillCards = document.querySelectorAll('.skill');
  
  skillCards.forEach(card => {
    card.addEventListener('mousemove', handleSkillCardHover);
    card.addEventListener('mouseleave', resetSkillCard);
  });
}

function handleSkillCardHover(e) {
  const card = this;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetSkillCard() {
  this.style.transform = '';
}

function addRecommendation() {
  // Get the message of the new recommendation
  let recommendation = document.getElementById("new_recommendation");
  let nameInput = document.getElementById("name_input");
  
  // If the user has left a recommendation, display a pop-up
  if (recommendation.value != null && recommendation.value.trim() != "") {
    console.log("New recommendation added");
    
    // Create a new 'recommendation' element and set it's value to the user's message
    var element = document.createElement("div");
    element.setAttribute("class", "recommendation");
    
    // Si hay un nombre, añadirlo al final
    const name = nameInput.value.trim() !== "" ? nameInput.value : "Anónimo";
    
    element.innerHTML = `<span>&#8220;</span>${recommendation.value}<span>&#8221;</span><p class="author">- ${name}</p>`;
    
    // Add this element to the beginning of the list of recommendations
    document.getElementById("all_recommendations").prepend(element);
    
    // Mostrar popup con animación
    showPopup(true);
    
    // Reset the value of the inputs
    recommendation.value = "";
    nameInput.value = "";
    
    // Aplicar animación de entrada
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    
    setTimeout(() => {
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 10);
  } else {
    // Indicar al usuario que debe ingresar un mensaje
    recommendation.style.borderColor = 'red';
    recommendation.style.boxShadow = '0 0 0 2px rgba(255, 0, 0, 0.1)';
    
    setTimeout(() => {
      recommendation.style.borderColor = '';
      recommendation.style.boxShadow = '';
    }, 2000);
  }
}

function showPopup(bool) {
  const popup = document.getElementById('popup');
  
  if (bool) {
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      showPopup(false);
    }, 3000);
  } else {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.style.visibility = 'hidden';
    }, 300);
  }
}
