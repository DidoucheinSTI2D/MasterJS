const form = document.getElementById('form');
const error = document.getElementById('error');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const input = document.getElementById('text');
    const inputValue = input.value.trim();

    error.innerHTML = '';

    if (inputValue === '') {
        showError('Le champ ne doit pas être vide.');
    } else if (!/^[a-zA-Z\s]+$/.test(inputValue)) {
        showError('Le champ ne doit contenir que des lettres.');
    } else if (/(\s){2,}/.test(inputValue)) {
        showError('Un seul espace est autorisé entre les mots.');
    } else if (!/^[A-Z][a-z]*(\s+[A-Z][a-z]*)*$/.test(inputValue)) {
        showError('Chaque mot doit commencer par une majuscule, les autres caractères en minuscule.');
    } else {
        alert('Tout est carré.');
    }
});

function showError(message) {
    error.textContent = message;
}
