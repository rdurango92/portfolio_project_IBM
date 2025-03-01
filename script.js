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
});

function initAnimations() {
  // Animar elementos cuando aparecen en el viewport
  const animatedElements = document.querySelectorAll('.skill, .project-card, .recommendation');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  animatedElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    observer.observe(el);
  });
  
  // Añadir estilos para la animación
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
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
    const name = nameInput.value.trim() !== "" ? nameInput.value : "Anonymous";
    
    element.innerHTML = `<span>&#8220;</span>${recommendation.value}<span>&#8221;</span><p class="author">- ${name}</p>`;
    
    // Add this element to the end of the list of recommendations
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
