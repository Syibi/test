$(function() {
  const params = (new URL(window.location)).searchParams;
  const isShown = sessionStorage.getItem('popup-ask-visitor-needs-is-shown');
  if(params.get("experiment") === 'popup-ask-visitor-needs' && !isShown) {
    const overlay = document.querySelector("#pop-up-overlay");
    overlay.classList.remove('hidden');
    overlay.classList.add('block');
    const clinicSoftware = document.querySelector("#clinic-software");
    const medicalrecordSoftware = document.querySelector("#medicalrecord-software");
    const close = () => {
      overlay.classList.add('hidden');
      overlay.classList.remove('block');
      sessionStorage.setItem('popup-ask-visitor-needs-is-shown', true);
    }
    clinicSoftware.addEventListener('click', close);
    medicalrecordSoftware.addEventListener('click', close);
  }
});