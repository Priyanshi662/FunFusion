const faq = [
    {
      "question": "What is Fun Fusion?",
      "answer": "Fun Fusion is a compilation of web applications developed for entertainment purposes, offering various games and creative tools to engage users in interactive experiences."
    },
    {
      "question": "What technologies does Fun Fusion primarily focus on?",
      "answer": "Fun Fusion primarily focuses on JavaScript, HTML, and CSS, which are fundamental technologies in web development."
    },
    {
      "question": "What can users expect from the projects within Fun Fusion?",
      "answer": "Users can expect a range of interactive games and creative tools designed to entertain and engage them. These projects cover activities such as drawing, gaming, information exploration, and more."
    },
    {
      "question": "How are the projects organized within Fun Fusion?",
      "answer": "The projects are organized using visually appealing cards featuring an image, title, and navigation button. Users can easily explore different projects through these interactive cards."
    },
    {
      "question": "Is Fun Fusion responsive to different devices and screen sizes?",
      "answer": "Yes, Fun Fusion is designed with a responsive layout, ensuring seamless functionality across various devices and screen sizes."
    },
    {
      "question": "What interactive features are available within Fun Fusion's projects?",
      "answer": "Fun Fusion's projects offer a variety of interactive features such as drawing boards, games like Tic-Tac-Toe and Whack-A-Mole, utilities like Text-to-Speech conversion, and more."
    },
    {
      "question": "Can you provide examples of some projects within Fun Fusion?",
      "answer": "Examples of projects within Fun Fusion include a Drawing Board, Analog Clock, Tic-Tac-Toe game, City Search tool, Drum Kit, Pokemon Generator, Text-to-Speech utility, Whack-A-Mole game, Typing Speed Test, Memory Card Game, and more."
    },
    {
      "question": "How is the project structure organized?",
      "answer": "The project structure includes an HTML file (index.html) for the webpage structure, internal CSS styles for layout and appearance, and a small JavaScript script for handling sidebar functionality and enhancing user experience."
    },
    {
      "question": "How can I get started with contributing to Fun Fusion?",
      "answer": "To get started with contributing, you can fork the repository, clone it to your local machine, make changes or improvements, and then open a pull request to submit your contributions."
    },
    {
      "question": "What are the steps to open a pull request for Fun Fusion?",
      "answer": "The steps to open a pull request involve making changes in your forked repository, committing the changes, pushing them to your forked repository, and then comparing and pulling the changes using GitHub in the main repository."
    },
    {
      "question": "What license is Fun Fusion released under?",
      "answer": "Fun Fusion is released under the MIT License."
    },
    {
      "question": "Is there a code of conduct for contributors to follow?",
      "answer": "Yes, contributors are advised to follow the Code of Conduct to maintain a safe and inclusive space for learning and growth."
    },
    {
      "question": "Are there specific guidelines for contributing to Fun Fusion?",
      "answer": "While there may not be specific guidelines mentioned, contributors are encouraged to follow best practices in software development and adhere to the project's standards."
    },
    {
      "question": "Who maintains Fun Fusion and how can I contact them for further inquiries?",
      "answer": "The project maintainer is typically mentioned in the repository. You can contact them through GitHub by visiting their profile or sending them a message."
    },
    {
      "question": "Can I suggest new projects or improvements to Fun Fusion?",
      "answer": "Yes, contributions such as suggesting new projects or improvements are welcome. You can submit your ideas through pull requests or by reaching out to the project maintainer."
    }
];
  
  /**
   *
   * @param {MouseEvent} e
   */
  
  // The Function to toggle the FAQ Content
  function toggleContent(e) {
    const content = e.currentTarget.faqContent;
    content.show = !content.show;
  
    content.style.height = content.show
      ? content.scrollHeight + 20 + `px`
      : `0px`;
    content.style.padding = content.show ? `10px 0` : `0`;
  
    const plus = e.currentTarget.plus;
    plus.style.transform = content.show ? `rotate(45deg)` : `none`;
  }
  
  // The Template Function for the FAQ
  faq.forEach(function (item, index) {
    const faqItem = document.createElement(`div`);
    faqItem.classList.add(`faq`);
    faqItem.innerHTML = `
            <div class="faq_title">
                <span style="z-index:100;">${item.question}</span>
                <div class="plusBtn">
                  <svg
                  class="plus"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="rgb(0, 212, 255, 1)"
                  viewBox="0 0 16 16"
                  stroke-width="2"
                  stroke="rgb(0, 212, 255, 1)"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 0a.75.75 0 01.75.75v6.5h6.5a.75.75 0 010 1.5h-6.5v6.5a.75.75 0 01-1.5 0v-6.5H.75a.75.75 0 010-1.5h6.5V.75A.75.75 0 018 0z"
                    />
                  </svg>
                <div>
            </div>
        `;
  
    faqItem.plus = faqItem.querySelector(`.plus`);
  
    const faqContent = document.createElement(`div`);
    faqContent.classList.add(`faq_content`);
    faqContent.innerHTML = item.answer;
    faqItem.appendChild(faqContent);
  
    faqItem.faqContent = faqContent;
  
    faqItem.addEventListener(`click`, toggleContent);
    document.querySelectorAll(`.faqs_container`)[index % 2].appendChild(faqItem);
  });
  