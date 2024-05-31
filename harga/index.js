// pricing card elements
const accordionElement = document.getElementsByClassName("featured-accordion-title");
const monthlyButton = document.getElementById("monthly-button");
const yearlyButton = document.getElementById("yearly-button");
const individualPrice = document.getElementById("individual-price");
const individualDuration = document.getElementById("individual-duration");
const teamPrice = document.getElementById("team-price");
const teamDuration = document.getElementById("team-duration");
const discountPrice = document.getElementsByClassName("discount-price");

// calculator elements
const doctorInputField = document.getElementById("doctor-value");
const doctorSlider = document.getElementById("doctor-slider");
const transactionInputField = document.getElementById("transaction-value");
const transactionSlider = document.getElementById("transaction-slider");
const inpatientCheckbox = document.getElementById("inpatient-checkbox");

const monthlyIndividualElement = document.getElementById("monthly-individual");
const monthlyTeamElement = document.getElementById("monthly-team");
const yearlyIndividualElement = document.getElementById("yearly-individual");
const yearlyTeamElement = document.getElementById("yearly-team");

const doctorBasePrice = 250000;
const transactionIncludedPackage = 1000;
const transactionMinimumPrice = 1000000;
const yearlyDiscount = 0.10; // 10%
const transactionExtraPrice = 2000;
const inpatientAddonPrice = 250000;

function getElementValue(element) {
  return element.value;
}

function resetEstimationPriceElement() {
  monthlyIndividualElement.innerText = 0;
  yearlyIndividualElement.innerText = 0;
  monthlyTeamElement.innerText = 0;
  yearlyTeamElement.innerText = 0;
}

function calculatePriceByDoctorCount(doctorCountInput) {
  return doctorCountInput * doctorBasePrice;
}

function calculatePriceByTransactionCount(transactionCountInput) {
  const extraTransactionCount = Math.max(0, transactionCountInput-transactionIncludedPackage);
  return transactionMinimumPrice + extraTransactionCount*transactionExtraPrice;
}

function calculateYearlyPrice(monthlyPrice) {
  const priceRate = (1 - yearlyDiscount);
  return monthlyPrice * 12 * priceRate;
}

function hookUpdateValue(element) {
  switch (element.id) {
    case 'doctor-slider':
      doctorInputField.value = element.value;
      break;
    case 'doctor-value':
      doctorSlider.value = element.value;
      break;
    case 'transaction-slider':
      transactionInputField.value = element.value;
      break;
    case 'transaction-value':
      transactionSlider.value = element.value;
      break;
  }
}

function onStateChangeListener(element) {
  hookUpdateValue(element);
  
  // infrastructure
  const doctorCount = doctorInputField.value;
  const transactionCount = transactionInputField.value;
  const useInpatientAddons = inpatientCheckbox.checked;

  // domain
  const addonExtraPrice = useInpatientAddons?inpatientAddonPrice:0;

  const priceByDoctor = calculatePriceByDoctorCount(doctorCount);
  const monthlyIndividualPlan = priceByDoctor + addonExtraPrice;
  const yearlyIndividualPlan = calculateYearlyPrice(monthlyIndividualPlan);
  
  const priceByTransactionCount = calculatePriceByTransactionCount(transactionCount);
  const monthlyTeamPlan = priceByTransactionCount + addonExtraPrice;
  const yearlyTeamPlan = calculateYearlyPrice(monthlyTeamPlan);

  // infrastructure
  monthlyIndividualElement.innerText = numberWithPeriod(monthlyIndividualPlan);
  yearlyIndividualElement.innerText = numberWithPeriod(yearlyIndividualPlan);
  monthlyTeamElement.innerText = numberWithPeriod(monthlyTeamPlan);
  yearlyTeamElement.innerText = numberWithPeriod(yearlyTeamPlan);
}


monthlyButton.addEventListener("click", function() {
  this.classList.add("active");
  yearlyButton.classList.remove("active");
  individualPrice.style.opacity = 0;
  teamPrice.style.opacity = 0;
  individualDuration.style.opacity = 0;
  teamDuration.style.opacity = 0;
  setTimeout(function() {
    individualPrice.innerHTML = "Rp250.000";
    individualDuration.innerHTML = "/Dokter/Bulan";
    teamPrice.innerHTML = "Rp1.000.000";
    teamDuration.innerHTML = "/Bulan";
    for (const element of discountPrice) {
      element.style.display ="none";
    }
    individualPrice.style.opacity = 1;
    teamPrice.style.opacity = 1;
    individualDuration.style.opacity = 1;
    teamDuration.style.opacity = 1;
  }, 500);
});

yearlyButton.addEventListener("click", function() {
  this.classList.add("active");
  monthlyButton.classList.remove("active");
  individualPrice.style.opacity = 0;
  teamPrice.style.opacity = 0;
  individualDuration.style.opacity = 0;
  teamDuration.style.opacity = 0;

  setTimeout(function() {
    individualPrice.innerHTML = "Rp2.700.000";
    individualDuration.innerHTML = "/Dokter/Tahun";
    teamPrice.innerHTML = "Rp10.800.000";
    teamDuration.innerHTML = "/Tahun";
    for (const element of discountPrice) {
      element.style.display ="block";
    }
    individualPrice.style.opacity = 1;
    teamPrice.style.opacity = 1;
    individualDuration.style.opacity = 1;
    teamDuration.style.opacity = 1;
  }, 500)
});

for (const element of accordionElement) {
  element.addEventListener("click", function() {
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  })
}

function numberWithPeriod(x) {
  return x.toLocaleString('id-ID', {maximumFractionDigits:2});
}

function removePeriod(x) {
  return x.replace(/\./g, "")
}