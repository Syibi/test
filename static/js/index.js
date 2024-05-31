const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mobileMenu = document.querySelector("#mobileMenu");
const mobileMenuIcons = mobileMenuButton.querySelectorAll('svg');
const nav = document.querySelector('#mainNav');

mixpanel.init('cc865e939d6e0ba0134f17a4508e7264', {debug:true});
mixpanel.track_links('.feature-link', "feature_link_clicked");
mixpanel.track_links('.blog-link', "blog_link_clicked");
mixpanel.track_links('.reservasi-link', "reservasi_link_clicked");
mixpanel.track_links('.register-link', "register_link_clicked");
mixpanel.track_links('.pricing-link', "pricing_link_clicked");
mixpanel.track_links('.faq-link', "faq_link_clicked");

function toogleBurger() {
  mobileMenuIcons.forEach((mmi) => {
    if(mmi.classList.contains('hidden')){
      mmi.classList.remove('hidden');
    } else {
      mmi.classList.add('hidden');
    }
  })
}

mobileMenuButton.addEventListener("click", (e) => {
  e.preventDefault();

  if(mobileMenu.classList.contains('hidden')){
    mobileMenu.classList.remove('hidden');
  } else {
    mobileMenu.classList.add('hidden');
  }

  toogleBurger();
});

function showModal() {
  const card_panel = document.getElementById('card_panel')
  card_panel.classList.remove('hidden')
  card_panel.classList.add('block')
  const card_close = document.getElementById('card_close')
  const close = ()=>{
    card_panel.classList.add('hidden')
    card_panel.classList.remove('block')
  }
  card_close.addEventListener('click', close);
  card_panel.addEventListener('click', close);
  // document.body.addEventListener('keypress', (e) => { if (e.key == "Escape") { close(); } });
}

function showVideoModal() {
  const card_panel = document.getElementById('video_card_panel')
  card_panel.classList.remove('hidden')
  card_panel.classList.add('block')
  const card_close = document.getElementById('video_card_close')
  const close = ()=>{
    card_panel.classList.add('hidden')
    card_panel.classList.remove('block')
  }
  card_close.addEventListener('click', close);
  card_panel.addEventListener('click', close);
  document.body.addEventListener('keypress', (e) => { if (e.key == "Escape") { close(); } });
}

function getParam(p) {
  const match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * @read: https://support.google.com/google-ads/answer/2998031?hl=en
 */

function getGoogleClickId() {
  const gclid = JSON.parse(localStorage.getItem('gclid'));
  const isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;
  if (isGclidValid) {
    return gclid.value;
  }
  return null
}

function getMicrosoftClickId() {
  const msclkid = JSON.parse(localStorage.getItem('msclkid'));
  const isMsclkidValid = msclkid && new Date().getTime() < msclkid.expiryDate;
  if (isMsclkidValid) {
    return msclkid.value;
  }
  return null
}

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-985705934');

function getAnalyticsId() {
  return new Promise((resolve, reject) => {
    gtag('get', 'G-CP82STVQ6V', 'client_id', (client_id) => {
      resolve(client_id);
    })
  })
}

async function getFingerPrintId() {
  const fp = await FingerprintJS.load();
  return (await fp.get()).visitorId;
}

async function validatePhoneNumber(phoneNumber) {
  if (phoneNumber) {
    phoneNumber = phoneNumber.replace(RegExp("^08"), "628")
    const response = await fetch("//apilayer.net/api/validate?access_key=ae38fc0e8c7ec6408411653168f13092&number="+String(phoneNumber));
    const responseJson = await response.json();
    return responseJson.valid && responseJson.line_type == "mobile" && responseJson.country_code == "ID";
  }
  return false
}

async function submitLead(phoneNumber, type) {   
  await fetch("//api.ehealth.co.id/new-lead/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceFingerprint: await getFingerPrintId(),
      googleClickId: await getGoogleClickId(),
      googleAnalyticsId: await getAnalyticsId(),
      microsoftClickId: await getMicrosoftClickId(),
      phoneNumber: phoneNumber,
      type: type,
    }),
  });
  mixpanel.track('subscribe_form', {
    deviceFingerprint: await getFingerPrintId(),
    googleClickId: await getGoogleClickId(),
    googleAnalyticsId: await getAnalyticsId(),
    microsoftClickId: await getMicrosoftClickId(),
    phoneNumber: phoneNumber,
    type: type,
  });
  gtag('event', 'submit', { 'event_category': 'Demo Form' });
  fbq('track', 'Lead');
}

function initOmnichannelWidget() {
  if (typeof Qismo === "undefined") {
    return setTimeout(initOmnichannelWidget, 100);
  }
  return new Qismo('xui-vg3kx20d3ww1nyqxm', {
    options: {
      channel_id: 119498,  
      extra_fields: [], 
    },
    async onLoginSuccess(data) {
      await submitLead(data.user.email, "Web Chat");
    }
  });
}

$(function () {
  "use strict";

  initOmnichannelWidget();
  
  $('#subscribe-form').submit(async function (e) {
    e.preventDefault();
    let form = $('form#subscribe-form')
    let submitButton = $('button[type=submit]')
    let phoneInput = $('#phone')

    let phoneNumber = phoneInput.val();
    submitButton.disabled = true;
    form.removeClass('error');
    form.addClass('loading');

    const isValid = await validatePhoneNumber(phoneNumber)
    console.log("valid:" + isValid);
    if (isValid) {
      await submitLead(phoneNumber, "Form");
      showModal();
      form.removeClass('loading');
      phoneInput.val('');
      submitButton.disabled = false;
      return;
    }
    form.addClass('error');
    form.removeClass('loading');
    submitButton.disabled = false;
  });

  
  $('.btn-play').click(function(e) {
    e.preventDefault();

    function closeVideoModal(e) {
      e.preventDefault();
      $("body").removeClass("show-video-modal noscroll");
      $("#youtube").attr('src', '');
      $(".video-modal").addClass("hidden");
      $(".video-modal").removeClass("flex");
    }

    $('body').on('click', '.close-video-modal, .video-modal .overlay', closeVideoModal);

    $('body').keyup(function(e) {
      if (e.keyCode == 27) { 
        closeVideoModal(e);
      }
    });

    var id = $(this).attr('data-youtube-id');
    var autoplay = '?autoplay=1';
    var relatedNo = '&rel=0';
    var src = '//www.youtube.com/embed/' + id + autoplay + relatedNo;
    $("#youtube").attr('src', src);
    $("body").addClass("show-video-modal noscroll");
    $(".video-modal").removeClass("hidden");
    $(".video-modal").addClass("flex");
  });

  $('.contact-us').click(async function(e) {
    mixpanel.track('contact_us')
    gtag('event', 'submit', { 'event_category': 'Contact' });
    fbq('track', 'Lead');

    const googleClickId = (await getGoogleClickId()) || "";
    const googleAnalyticsId = (await getAnalyticsId()) || "";
    const microsoftClickId = (await getMicrosoftClickId()) || "";
    
    const text = `Halo,\nkami tertarik untuk mencoba demo ehealth.co.id.\nterima kasih\n\nkode kupon: ${googleClickId}#${googleAnalyticsId}#${microsoftClickId}`;
    window.open(`https://wa.me/622150858844?text=${encodeURIComponent(text)}`);
    return false;
  })
  
  const question = document.getElementsByClassName("question");
  for (let i = 0; i < question.length; i++) {
    question[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
});