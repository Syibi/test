function searchFaq() {
  // Declare variables
  let input = document.getElementById('search-input');
  let cardColumn = document.getElementsByClassName("faq-card-container");
  let faqListContainer = document.getElementsByClassName("faq-list-container");
  // let question = document.getElementsByClassName('question');
  let filter = input.value.toLowerCase();
  cardList = [];
  for (const card of cardColumn) {
    const faqCard = card.getElementsByClassName("faq-card");
    for (const question of faqCard) {
      const questionElement = question.getElementsByClassName("question")[0];
      const textValue = questionElement.textContent || questionElement.innerHTML;
      if (textValue.toLowerCase().indexOf(filter) > -1) {
        question.style.display = "";
        faqListContainer[0].classList.remove("md:flex-row");
        faqListContainer[0].classList.add("items-center");
      } else {
        question.style.display = "none";
        faqListContainer[0].classList.remove("md:flex-row");
        faqListContainer[0].classList.add("items-center");
      }
    }
  }
  if (!filter.length) {
    faqListContainer[0].classList.add("md:flex-row");
    faqListContainer[0].classList.remove("items-center");
  }
} 