Xendit.setPublishableKey('xnd_public_production_lI5wSz4Oo5V1iy1lAcHo0ogRqt46MAKhiSkgPNZGWnK9QQOqh8AsX70lcvMvhF');
let is_use_generated_namespace = true
const temp = {}
const adminHost = 'https://admin.ehealth.co.id'

document.querySelectorAll('input[type="tel"]').forEach((element) => {
  element.onchange = () => {
    if(!element.checkValidity() && (element.validity.patternMismatch === true)){
      element.setCustomValidity(
        "● Starts with +62 or 0\n● Length must be 8-13 digits" 
      )
    }else {
      element.setCustomValidity('')
    }
    element.reportValidity()
  }
})

function showModal(
  title = 'Terima kasih',
  message = 'Klinik Anda sedang dalam proses konfigurasi. Kami akan menghubungi Anda setelah proses konfigurasi selesai.',
  image = {
    'data-src': '/static/images/contact_soon.webp',
    class: 'w-50 lazyload',
    alt: 'Contact Soon'
  }
) {
  const card_panel = document.getElementById('card_panel')
  card_panel.classList.remove('hidden')
  card_panel.classList.add('block')
  
  $('#card_panel_title').text(title)
  $('#card_panel_message').text(message)
  $('#card_panel_image').attr('data-src', image['data-src'])
  $('#card_panel_image').attr('class', image['class'])
  $('#card_panel_image').attr('alt', image['alt'])
  
  const card_close = document.getElementById('card_close')
  const close = ()=>{
    card_panel.classList.add('hidden')
    card_panel.classList.remove('block')
  }
  card_close.addEventListener('click', close);
  card_panel.addEventListener('click', close);
  // document.body.addEventListener('keypress', (e) => { if (e.key == "Escape") { close(); } });
}

function formattedNamespace(clinicName){  
  return clinicName.toLowerCase().replaceAll(" ", "-");
}

function getParam(p) {
  const match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getNumberOnly(string) {
      return string
        .replace(/\s+/g, '')
        .replace(/[^0-9]/g, '')
    }

function getExpiryRecord(value) {
  const expiryPeriod = 90 * 24 * 60 * 60 * 1000; // masa berlaku 90 hari dalam milidetik
  const expiryDate = new Date().getTime() + expiryPeriod;
  return {
    value: value,
    expiryDate: expiryDate
  };
}

/**
 * @read: https://support.google.com/google-ads/answer/2998031?hl=en
 */

function setGoogleClickId() {
  let gclidParam = getParam('gclid');
  let gclidRecord = null;

  let gclsrcParam = getParam('gclsrc');
  let isGclsrcValid = !gclsrcParam || gclsrcParam.indexOf('aw') !== -1;

  if (gclidParam && isGclsrcValid) {
    gclidRecord = getExpiryRecord(gclidParam);
    localStorage.setItem('gclid', JSON.stringify(gclidRecord));
  }
}

function getGoogleClickId() {
  let gclid = JSON.parse(localStorage.getItem('gclid'));
  let isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;

  if (isGclidValid) {
    return gclid.value;
  }
  return null
}

$(function() {
    "use strict";

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
      return fp.get().visitorId;
    }

    const displayNamespaceMessage = (type, message) => {
      $('#message-namespace').removeClass("text-yellow-500");
      $('#message-namespace').removeClass("text-green-500");
      $('#message-namespace').removeClass("text-red-500");
      $('#namespace').removeClass("border-yellow-500");
      $('#namespace').removeClass("border-green-500");
      $('#namespace').removeClass("border-red-500");

      switch (type) {
        case "success":
          $('#namespace').addClass("border-green-500");
          $('#message-namespace').addClass("text-green-500");
          break;
        case "error":
          $('#namespace').addClass("border-red-500");
          $('#message-namespace').addClass("text-red-500");
          break;
        case "warning":
          $('#namespace').addClass("border-yellow-500");
          $('#message-namespace').addClass("text-yellow-500");
          break;
        default:
          break;
      }

      $('#message-namespace').html(message);
    }

    async function validateNamespace(namespace){
      if (namespace == ""){
        displayNamespaceMessage("error", "Subdomain harus diisi");
        return false;
      }

      const rightSubdomainPattern = /^[a-z0-9]+([-][a-z0-9]+)*$/
      if(rightSubdomainPattern.test(namespace)){
        try {
          const response = await fetch("https://admin.ehealth.co.id/api/check_namespace/" + namespace);
          
          if (response.status != 200) {
            displayNamespaceMessage("warning", "Gagal mengecek ketersediaan domain");
            return false;
          }

          const responseJson = await response.json();
          if (responseJson.is_exists){
            displayNamespaceMessage("error", "Subdomain \"" + namespace + "\" sudah terpakai");
            return false;
          }

          displayNamespaceMessage("success", "Subdomain \"" + namespace + "\" tersedia");
          return true;

        } catch (e) {
          displayNamespaceMessage("warning", "Gagal mengecek ketersediaan domain");
          return false;
        }
        
      } else {
        displayNamespaceMessage("error", "Subdomain tidak valid");
        return false;
      }
    
    };

    function validatePassword(password, passwordConfirmation) {
      $('#password').removeClass("border-red-500");
      $('#c_password').removeClass("border-red-500");

      if(password == '') {
        mixpanel.track('register_form_error_empty_password');
        $('#message').html("Please choose a password.");
        $('#password').addClass("border-red-500");
        return false;
      }

      if(password != passwordConfirmation) {
        mixpanel.track('register_form_error_password_confirm_error');
        $('#message').html("Password tidak sama.");
        $('#password').addClass("border-red-500");
        $('#c_password').addClass("border-red-500");
        return false;
      }

      return true;
    }

    function validatePaymentCardNumber(cardNumber) {
      $('#payment-card-number').removeClass("border-red-500");

      if (!Xendit.card.validateCardNumber(cardNumber)){
        $('#payment-card-number').addClass("border-red-500");
        $('#payment-card-number')[0].setCustomValidity('Nomor kartu tidak valid')
        return false;
      }

      $('#payment-card-number')[0].setCustomValidity('')
      $('#payment-card-number').removeClass("border-red-500");
      return true;
    }

    function validatePaymentCardExpiry(cardExpiry) {
      const cardExpirySplitted = cardExpiry.split('/')
      $('#payment-card-expiry').removeClass("border-red-500")

      if (!Xendit.card.validateExpiry(cardExpirySplitted?.[0], cardExpirySplitted?.[1])){
        $('#payment-card-expiry').addClass("border-red-500");
        $('#payment-card-expiry')[0].setCustomValidity('Masa berlaku tidak valid')
        return false;
      }

      $('#payment-card-expiry')[0].setCustomValidity('')
      $('#payment-card-expiry').removeClass("border-red-500");
      return true;
    }

    function validatePaymentCardCvn(cardCvn) {
      $('#payment-card-cvn').removeClass("border-red-500");

      if (!Xendit.card.validateCvn(cardCvn)){
        $('#payment-card-cvn').addClass("border-red-500");
        $('#payment-card-cvn')[0].setCustomValidity('Kode cvn tidak valid')
        $('#payment-card-cvn')[0].reportValidity()
        return false;
      }

      $('#payment-card-cvn')[0].setCustomValidity('')
      $('#payment-card-cvn').removeClass("border-red-500");
      return true;
    }

    setGoogleClickId();

    $('#form').submit(async function (e) {
      e.preventDefault();

      const namespace = $('#namespace').val()
      const password = $('#password').val();
      const passwordConfirmation = $('#c_password').val();

      $('#message').html(" ");
      if (!validateNamespace(namespace) || !validatePassword(password, passwordConfirmation)) {
        $('form').addClass('error');
        return false;
      }
      
      // Simpan isian form sementara untuk digunakan pada POST payment
      Object.assign(temp, {
        contactName: $('#clientName').val(),
        deviceFingerprint: await getFingerPrintId(),
        microsoft_click_id: null,
        googleClickId: await getGoogleClickId(),
        googleAnalyticsId: await getAnalyticsId(),
        namespace: $('#namespace').val(),
        name: $('#clinicName').val(),
        address: $('#clinicAddress').val(),
        city: $('#city').val(),
        phone: $('#Whatsapp').val(),
        email: $('#email').val(),
      })

      const request = await fetch(`${adminHost}/api/register/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/form+json'
        },
        body: JSON.stringify({
          contactName: $('#clientName').val(),
          deviceFingerprint: await getFingerPrintId(),
          microsoft_click_id: null,
          googleClickId: await getGoogleClickId(),
          googleAnalyticsId: await getAnalyticsId(),
          namespace: $('#namespace').val(),
          name: $('#clinicName').val(),
          address: $('#clinicAddress').val(),
          city: $('#city').val(),
          phone: $('#Whatsapp').val(),
          email: $('#email').val(),
        }),
      });

      mixpanel.track('signup_clinic', {'clinicName':$('#clinicName').val(), 'clientName':$('#clientName').val()});
      gtag('event', 'register', { 'event_category': 'Register Now' });
      fbq('track', 'Register');
      return true;
    });

    $('#payment-form').submit(async function (e) {
      e.preventDefault();

      const paymentCardNumber = getNumberOnly($('#payment-card-number').val())
      const paymentCardExpiry = $('#payment-card-expiry').val()
      const paymentCardCvn = $('#payment-card-cvn').val()

      if (!$('#payment-form')[0].reportValidity()
        || !validatePaymentCardNumber(paymentCardNumber)
        || !validatePaymentCardExpiry(paymentCardExpiry)
        || !validatePaymentCardCvn(paymentCardCvn)
      ) {
        $('payment-form').addClass('error');
        return false;
      }

      const cardExpirySplitted = $('#payment-card-expiry')
        .val()
        .split('/')

      Xendit.card.createToken({
        amount: parseInt(getNumberOnly($('#payment-amount').text())),
        card_number: getNumberOnly($('#payment-card-number').val()),
        card_exp_month: cardExpirySplitted[0],
        card_exp_year: cardExpirySplitted[1],
        card_cvn: $('#payment-card-cvn').val(),
        is_multiple_use: false,
        should_authenticate: true
      }, xenditResponseHandler);
    })

    async function xenditResponseHandler (err, creditCardToken) {
      if (err) {
        showModal("Error", err.message, {
          "data-src": "/static/images/exclamation-mark.svg",
          class: "block w-16 mx-auto mb-8 lazyload",
          alt: "Error",
        });
        $("#register-button").prop("disabled", false); // Re-enable submission
        return false;
      }
    
      switch (creditCardToken?.status) {
        case "VERIFIED":
          const token = creditCardToken.id;
          
          const request = await fetch(`${adminHost}/api/register/`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/form+json'
            },
            body: JSON.stringify({
              ...temp,
              token,
              cc_holder_name: $('#payment-card-holder').val(),
              masked_card_number: creditCardToken.masked_card_number,
              cc_brand: creditCardToken.card_info.brand,
              product_id: 1
            }),
          });
          
          showModal()
          
          $('#form').find('input').each((index, input) => $(input).val(''));
          $('#payment-form').find('input').each((index, input) => $(input).val(''));
          
          $("#three-ds-container").hide();
          $("body").removeClass("overflow-hidden");
          $("#register-button").prop("disabled", false);
          return true;
        case "IN_REVIEW":
          window.open(creditCardToken.payer_authentication_url, "three-ds-frame");
          $("#three-ds-container").show();
          $("body").addClass("overflow-hidden");
    
          $("#three-ds-button").click(function (e) {
            $("#three-ds-container").hide();
            $("body").removeClass("overflow-hidden");
          });
          $("#register-button").prop("disabled", false);
          return false;
        case "FAILED":
          $("#three-ds-container").hide();
          $("body").removeClass("overflow-hidden");
          showModal("Error", creditCardToken.failure_reason, {
            "data-src": "/static/images/exclamation-mark.svg",
            class: "block w-16 mx-auto mb-8 lazyload",
            alt: "Error",
          });
          $("#register-button").prop("disabled", false);
          return false;
        default:
          showModal("Error", creditCardToken?.status, {
            "data-src": "/static/images/exclamation-mark.svg",
            class: "block w-16 mx-auto mb-8 lazyload",
            alt: "Error",
          });
          $("#register-button").prop("disabled", false);
          return false;
      }
    }

    $('#clinicName').on("input", function() {
      if (is_use_generated_namespace){
        const suggestedNamespace = formattedNamespace($(this).val())
        $('#namespace').val(suggestedNamespace);
        validateNamespace(suggestedNamespace);
      }
    });

    $('button.to-page-button').click(async function (e) {
      const currentForm = $(e.target)
        .parent()
        .parent()
      const currentPageIndex = $(e.target)
        .parent()
        .parent()
        .attr('class')
        .match(/(?<=page-)\d+/)[0]
      const nextPageIndex = $(e.target)
        .attr('data-to-page')

      if( nextPageIndex > currentPageIndex  ){
        if(!currentForm[0].checkValidity()) return currentForm[0].reportValidity()

        $(`.page-${currentPageIndex}`).submit()
        if(!await $(`.page-${currentPageIndex}`).triggerHandler('submit')) return currentForm[0].reportValidity()
      }

      $('*[class^="page-"]').each(function (e) { 
        $(this).addClass('hidden')
      });

      $(`.page-${nextPageIndex}`).removeClass('hidden')
    })

    $('#payment-card-number').on('keyup', function(e){
      const sanitizedValue = getNumberOnly($(this).val())
      const formattedValue = sanitizedValue
        .match(/.{1,4}/g)
        ?.join(' ')

      $(this).val(formattedValue);

      validatePaymentCardNumber(sanitizedValue)
    });

    $('#payment-card-expiry').on('keyup', function(e){
      const sanitizedValue = getNumberOnly($(this).val())
      const formattedValue = sanitizedValue.length > 2
        ? `${sanitizedValue.substring(0,2)}/${sanitizedValue.substring(2)}`
        : sanitizedValue
      
      $(this).val(formattedValue);

      validatePaymentCardExpiry(formattedValue)
    })

    $('#payment-card-cvn').on('keyup', function(e){
      validatePaymentCardCvn($(this).val())
    })

    $('#register-button').click(function (e) {
      $(this).prop('disabled', true)
      $('#payment-form').submit()
      
      $(this).prop('disabled', false)
    })

    // $('#clinicName').change(function(){
    //   if (is_use_generated_namespace){
    //     validateNamespace($(this).val());
    //   }
    // });

    $('#namespace').on("input", function() {
      $('#message-namespace').html("");
      $('#namespace').removeClass("border-red-500");
      $('#namespace').removeClass("border-green-500");
    });

    $('#namespace').change(function(){
      validateNamespace($(this).val());
    });

    $('#namespace').click(function(){
      is_use_generated_namespace = false
    });

});