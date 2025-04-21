import qaPairs from "./data";

export function getAnswer(userInput) {
    const input = userInput.toLowerCase().trim();

    const found = qaPairs.find((pair) => input.includes(pair.question));

    return found ? found.answer : "Sorry, I don't know the answer to that.";
}
