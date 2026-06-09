// script.js — main entry point for the public-facing site
import { supabase }   from './js/supabase.js';
import { showToast }  from './js/toast.js';
import { validateEmail, validatePhone, runValidation, clearErrors } from './js/validation.js';

/* ================================================
   NAVBAR — scroll + hamburger
   ================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  })
);

/* ================================================
   SCROLL REVEAL
   ================================================ */
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

/* ================================================
   RESERVATION FORM
   ================================================ */
const resForm = document.getElementById('reservation-form');

if (resForm) {
  // Set minimum date to today
  const dateInput = resForm.querySelector('#res-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  resForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(resForm);

    const name    = resForm.querySelector('#res-name');
    const email   = resForm.querySelector('#res-email');
    const phone   = resForm.querySelector('#res-phone');
    const date    = resForm.querySelector('#res-date');
    const time    = resForm.querySelector('#res-time');
    const guests  = resForm.querySelector('#res-guests');
    const notes   = resForm.querySelector('#res-notes');

    const valid = runValidation([
      { field: name,   rules: [{ test: v => v.trim().length >= 2,    msg: 'Please enter your full name (min 2 characters).' }] },
      { field: email,  rules: [{ test: v => validateEmail(v),         msg: 'Please enter a valid email address.' }] },
      { field: phone,  rules: [{ test: v => validatePhone(v),         msg: 'Enter a valid 10-digit mobile number.' }] },
      { field: date,   rules: [{ test: v => !!v,                      msg: 'Please select a date.' }] },
      { field: time,   rules: [{ test: v => !!v,                      msg: 'Please select a time.' }] },
      { field: guests, rules: [{ test: v => +v >= 1 && +v <= 20,     msg: 'Guests must be between 1 and 20.' }] },
    ]);

    if (!valid) {
      resForm.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const btn = resForm.querySelector('.submit-btn');
    setLoading(btn, true);

    const { error } = await supabase.from('reservations').insert({
      customer_name:    name.value.trim(),
      email:            email.value.trim().toLowerCase(),
      phone:            phone.value.trim(),
      date:             date.value,
      time:             time.value,
      guests:           parseInt(guests.value, 10),
      special_requests: notes.value.trim() || null,
    });

    setLoading(btn, false);

    if (error) {
      console.error('Reservation error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } else {
      resForm.reset();
      showToast('🎉 Reservation confirmed! We\'ll send you a confirmation shortly.', 'success', 6000);
    }
  });
}

/* ================================================
   CONTACT FORM
   ================================================ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(contactForm);

    const name    = contactForm.querySelector('#ct-name');
    const email   = contactForm.querySelector('#ct-email');
    const subject = contactForm.querySelector('#ct-subject');
    const message = contactForm.querySelector('#ct-message');

    const valid = runValidation([
      { field: name,    rules: [{ test: v => v.trim().length >= 2,    msg: 'Please enter your name.' }] },
      { field: email,   rules: [{ test: v => validateEmail(v),         msg: 'Please enter a valid email.' }] },
      { field: subject, rules: [{ test: v => v.trim().length >= 3,    msg: 'Please enter a subject.' }] },
      { field: message, rules: [{ test: v => v.trim().length >= 10,   msg: 'Message must be at least 10 characters.' }] },
    ]);

    if (!valid) {
      contactForm.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const btn = contactForm.querySelector('.submit-btn');
    setLoading(btn, true);

    const { error } = await supabase.from('contact_messages').insert({
      name:    name.value.trim(),
      email:   email.value.trim().toLowerCase(),
      subject: subject.value.trim(),
      message: message.value.trim(),
    });

    setLoading(btn, false);

    if (error) {
      console.error('Contact error:', error);
      showToast('Failed to send message. Please try again.', 'error');
    } else {
      contactForm.reset();
      showToast('✉️ Message sent! We\'ll get back to you soon.', 'success', 5000);
    }
  });
}

/* ================================================
   UTIL: button loading state
   ================================================ */
function setLoading(btn, state) {
  if (!btn) return;
  btn.disabled = state;
  btn.classList.toggle('loading', state);
  const textEl = btn.querySelector('.btn-text');
  if (textEl) textEl.textContent = state ? 'Sending…' : btn.dataset.defaultText || 'Submit';
}

// Store default btn text on page load
document.querySelectorAll('.submit-btn').forEach(btn => {
  const t = btn.querySelector('.btn-text');
  if (t) btn.dataset.defaultText = t.textContent;
});
