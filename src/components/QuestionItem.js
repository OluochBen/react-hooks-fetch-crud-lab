import React from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleCorrectAnswerChange(e) {
    const newIndex = Number(e.target.value);

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newIndex }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => {
        onUpdate(updatedQuestion);
      })
      .catch((err) => {
        console.error("Failed to update answer:", err);
      });
  }

  function handleDeleteClick() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => onDelete(id))
      .catch((err) => {
        console.error("Failed to delete question:", err);
      });
  }

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>
        <span>Prompt:</span> <span>{prompt}</span>
      </h5>
      <label>
        Correct Answer:
        <select
          aria-label="Correct Answer"
          value={String(correctIndex)}
          onChange={handleCorrectAnswerChange}
        >
          {options}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;