var data_handler = {
    set(obj, prop, value) {
        if (prop === 'question_number') {
            window.question_number.innerHTML = value;
            return Reflect.set(...arguments);
        }
        else if (prop === 'question') {
            window.question.innerHTML = value.question;

            let img = (value.img != '') ? `<img src="${value.img}">` : '';
            window.options.innerHTML = `
                ${img}
                <div class="option-wrapper">
                    <div id="option_A" class="option" onclick="answer('A')">[A] ${value.options.A}</div>
                    <div id="option_B" class="option" onclick="answer('B')">[B] ${value.options.B}</div>
                    <div id="option_C" class="option" onclick="answer('C')">[C] ${value.options.C}</div>
                </div>
            `;
            return Reflect.set(...arguments);
        }
        else if (prop === 'score') {
            window.score.innerHTML = value;
            return Reflect.set(...arguments);
        }
        else {
            return Reflect.set(...arguments);
        }
    },
};

var data = new Proxy({
    questions_indexes: Array.from(Array(window.questions.length).keys()),
    questions: window.questions,
    question_number: 0,
    question: {},
    answered: false,
    score: 0,
}, data_handler);

window.onload = function() {
    window.question_total.innerHTML = data.questions.length;
    data.score = 0;
    displayQuestion();
};

function displayQuestion() {
    data.question_number += 1;
    data.answered = false;

    let randomized_index = Math.floor(Math.random() * data.questions_indexes.length);
    let question_index = data.questions_indexes[randomized_index];
    
    //Displays the question in UI when data.question prop is set
    data.question = data.questions[question_index];

    //Remove the selected question index from the list
    data.questions_indexes.splice(randomized_index, 1);
}

function next() {
    if (!data.answered) {
        alert('Select your answer before clicking Next');
        return;
    }

    if (data.questions_indexes.length == 0) {
        alert('You have answered the last question. There is no next question.');
        return;
    }

    displayQuestion();
}

function answer(selected_option) {
    if (data.answered) return;

    if (data.question.answer == selected_option) {
        data.score += 1;
    }
    else {
        wrong_option_id = `option_${selected_option}`;
        window[wrong_option_id].classList.add('wrong');
    }

    let correct_option_id = `option_${data.question.answer}`;
    window[correct_option_id].classList.add('correct');

    data.answered = true;
}

function finish() {
    //TODO
}