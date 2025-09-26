document.addEventListener("DOMContentLoaded", function () {
  const numberSelectionSection = document.getElementById("number-selection");
  const quizPageSection = document.getElementById("quiz-page");
  const numbersContainer = document.getElementById("numbers");
  const quizTitle = document.getElementById("quiz-title");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const nextBtn = document.getElementById("next-btn");
  const result = document.getElementById("result");

  let selectedNumbers = [];
  let selectedOption = null;
  let correctAnswer = "";
  const optionLabels = ["A", "B", "C", "D"];
  
  // Generate all 20 questions in random order
  let randomQuestionIds = [];
  while (randomQuestionIds.length < 20) {
    const randomId = Math.floor(Math.random() * 20) + 1;
    if (!randomQuestionIds.includes(randomId)) {
      randomQuestionIds.push(randomId);
    }
  }

  // ✅ Local quiz data (10 random questions)
  const quizData = {
    1: {
      question: "You receive an email saying you’ve won a free phone. It asks for your credit card number to “verify your identity.” What should you do?",
      options: [
        "Provide the details immediately",
        "Reply asking for more info",
        "Delete the email",
        "Forward to your friends"
      ],
      answer: "Delete the email",
    },
    2: {
      question: "Which of these is the safest password?",
      options: ["Password123", "MyBirthday1995", "G#7tP@9sK!q", "football2025"],
      answer: "G#7tP@9sK!q",
    },
    3: {
      question: "You’re at a café and the only Wi-Fi available is public and unsecured. What’s the safest step?",
      options: ["Connect and log in to your bank", "Connect but use a VPN", "Connect without protection", "Share files with others"],
      answer: "Connect but use a VPN",
    },
    4: {
      question: "Which sign is a clear indicator of phishing?",
      options: ["An email from your bank with your full name and account number", "An email with poor grammar and urgent threats", "An SMS from a registered service with a verification code", "A login notification you triggered"],
      answer: "An email with poor grammar and urgent threats",
    },
    5: {
      question: "You get a phone call from “Microsoft Support” saying your PC is infected and they need remote access.",
      options: ["Real support", "Vulnerability patching", "Software update", "Social engineering scam"],
      answer: "Social engineering scam",
    },
    6: {
      question: "Which of the following attacks involves overwhelming a system with traffic to make it unavailable?",
      options: ["SQL Injection", "MITM", "Phishing", "DoS"],
      answer: "DoS",
    },
    7: {
      question: "Which port does HTTPS typically use?",
      options: ["20", "21", "80", "443"],
      answer: "443",
    },
    8: {
      question: "What is the main purpose of a firewall?",
      options: ["Encrypt data", "Block unauthorized access", "Detect phishing", "Backup files"],
      answer: "Block unauthorized access",
    },
    9: {
      question: "Which layer of the OSI model is responsible for encryption and session management?",
      options: ["Session & Presentation", "Transport", "Network", "Application"],
      answer: "Session & Presentation",
    },
    10: {
      question: "Which hashing algorithm is considered obsolete for cryptographic security?",
      options: ["SHA-256", "MD5", "AES", "SHA-512"],
      answer: "MD5",
    },
    11: {
      question: "Which of the following is an example of a social engineering attack?",
      options: ["Brute-force attack", "DDoS attack", "Buffer overflow", "Phishing email"],
      answer: "Phishing email",
    },
    12: {
      question: "In PKI, what role does a Certificate Authority (CA) play?",
      options: ["Managing firewalls", "Encrypting data at rest", "Creating cryptographic algorithms", "Issuing and verifying digital certificates"],
      answer: "Issuing and verifying digital certificates",
    },
    13: {
      question: "A zero-day attack refers to?",
      options: ["An attack launched on the first day of the month", "An attack that exploits a vulnerability unknown to the vendor", "An attack targeting password resets", "An attack that lasts less than a day"],
      answer: "An attack that exploits a vulnerability unknown to the vendor",
    },
    14: {
      question: "Which protocol secures remote login over a network?",
      options: ["SNMP", "Telnet", "SSH", "FTP"],
      answer: "SSH",
    },
    15: {
      question: "What is the primary difference between symmetric and asymmetric encryption?",
      options: ["Symmetric uses two keys; asymmetric uses one", "Symmetric uses one key; asymmetric uses two keys", "Symmetric is slower than asymmetric", "Asymmetric cannot be used for digital signatures"],
      answer: "Symmetric uses one key; asymmetric uses two keys",
    },
    16: {
      question: "Which security concept ensures that data is not modified during transmission?",
      options: ["Integrity", "Confidentiality", "Availability", "Accountability"],
      answer: "Integrity",
    },
    17: {
      question: "Which type of malware encrypts files and demands payment to unlock them?",
      options: ["Ransomware", "Trojan", "Worm", "Spyware"],
      answer: "Ransomware",
    },
    18: {
      question: "Which attack exploits the trust relationship between a user and a website by tricking the browser into sending unauthorized requests?",
      options: ["SQL Injection", "CSRF (Cross-Site Request Forgery)", "XSS (Cross-Site Scripting)", "PlatinumCSRF (Cross-Site Request Forgery)"],
      answer: "CSRF (Cross-Site Request Forgery)",
    },
    19: {
      question: "Which cryptographic algorithm is most commonly used in blockchain technology?",
      options: ["MD5", "RSA", "SHA-256", "AES"],
      answer: "SHA-256",
    },
    20: {
      question: "A SIEM (Security Information and Event Management) system is primarily used for:",
      options: ["Monitoring and analyzing security events", "Password management", "Encrypting network traffic", "Users authentication"],
      answer: "Monitoring and analyzing security events",
    },
  };

  // Popup styling
  const resultPopup = document.createElement("div");
  resultPopup.className =
    "hidden fixed top-20 right-5 bg-white text-gray-900 px-4 py-2 rounded-md shadow-md text-center text-lg font-bold transition-all duration-300";
  document.body.appendChild(resultPopup);

  // Generate number buttons
  for (let i = 1; i <= 20; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className =
      "w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold bg-green-600 hover:bg-green-700 text-white transition shadow-lg";
    btn.dataset.number = i;
    btn.addEventListener("click", function () {
      if (!selectedNumbers.includes(i)) {
        selectedNumbers.push(i);
        loadQuiz(i, randomQuestionIds[i-1]);
        btn.disabled = true;
        btn.classList.replace("bg-green-600", "bg-gray-400");
        btn.classList.add("cursor-not-allowed");
      }
    });
    numbersContainer.appendChild(btn);
  }

  // Check Button
  const checkBtn = document.createElement("button");
  checkBtn.textContent = "Reveal Answer";
  checkBtn.className =
    "hidden mt-6 px-6 py-2 border border-2 border-yellow-500 text-yellow-500 rounded-full hover:bg-yellow-900";
  checkBtn.addEventListener("click", function () {
    if (selectedOption) {
      let isCorrect = selectedOption.lastChild.textContent === correctAnswer;
      resultPopup.innerHTML = isCorrect ? 
        "Correct!" : 
        `Wrong!<br><small class="text-sm">Correct answer: ${correctAnswer}</small>`;
      resultPopup.className = `fixed top-20 right-5 px-4 py-2 rounded-md shadow-md text-center text-lg font-bold transition-all duration-300 ${
        isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`;
      resultPopup.classList.remove("hidden");

      // Also display result in the quiz area
      result.innerHTML = isCorrect ? 
        '<span class="text-green-400">✓ Correct!</span>' : 
        `<span class="text-red-400">✗ Wrong!</span><br><span class="text-yellow-400">Correct answer: ${correctAnswer}</span>`;

      setTimeout(() => {
        resultPopup.classList.add("hidden");
      }, 3000);

      quizOptions.classList.add("pointer-events-none");

      selectedOption.classList.add(
        isCorrect ? "bg-green-600" : "bg-red-600",
        "text-white"
      );
      Array.from(quizOptions.children).forEach((btn) => {
        if (btn.lastChild.textContent === correctAnswer) {
          btn.classList.add("bg-green-600", "text-white");
        }
      });

      nextBtn.classList.remove("hidden");
      checkBtn.classList.add("hidden");
    }
  });
  quizPageSection.appendChild(checkBtn);

  // Next button
  nextBtn.addEventListener("click", function () {
    quizOptions.innerHTML = "";
    resultPopup.classList.add("hidden");
    result.innerHTML = "";
    selectedOption = null;
    correctAnswer = "";
    quizOptions.classList.remove("pointer-events-none");
    nextBtn.classList.add("hidden");
    checkBtn.classList.add("hidden");

    if (selectedNumbers.length === 20) {
      alert("🎉 You have completed all questions!");
      window.location.reload();
    } else {
      quizPageSection.classList.add("hidden");
      numberSelectionSection.classList.remove("hidden");
    }
  });

  // Load quiz
  function loadQuiz(displayNumber, actualQuestionId) {
    numberSelectionSection.classList.add("hidden");
    quizPageSection.classList.remove("hidden");
    quizTitle.textContent = "Question " + displayNumber;
    nextBtn.classList.add("hidden");
    checkBtn.classList.add("hidden");
    result.innerHTML = "";
    quizOptions.classList.remove("pointer-events-none");

    const data = quizData[actualQuestionId];
    if (data) {
      quizQuestion.textContent = data.question;
      quizOptions.innerHTML = "";
      correctAnswer = data.answer;

      data.options.forEach((option, index) => {
        const optionBtn = document.createElement("button");
        optionBtn.className =
          "flex items-center w-full py-2 px-2 my-2 rounded-full border font-semibold bg-white text-gray-800 hover:bg-gray-300 transition duration-200 shadow text-left";

        const optionLabel = document.createElement("span");
        optionLabel.textContent = optionLabels[index];
        optionLabel.className =
          "w-8 h-8 flex items-center justify-center text-green-700 font-bold border border-2 border-green-600 rounded-full mr-3";

        const optionText = document.createElement("span");
        optionText.textContent = option;

        optionBtn.appendChild(optionLabel);
        optionBtn.appendChild(optionText);

        optionBtn.addEventListener("click", function () {
          if (!quizOptions.classList.contains("pointer-events-none")) {
            selectedOption = optionBtn;
            checkBtn.classList.remove("hidden");
            Array.from(quizOptions.children).forEach((btn) => {
              btn.classList.remove("bg-gray-500", "text-white");
            });
            optionBtn.classList.add("bg-gray-500", "text-white");
          }
        });
        quizOptions.appendChild(optionBtn);
      });
    } else {
      quizQuestion.textContent = "No question found for this ID.";
    }
  }
});
