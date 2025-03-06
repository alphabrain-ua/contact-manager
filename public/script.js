document.addEventListener('DOMContentLoaded', () => {
	fetchContacts();

	document.getElementById('form-add-contact').addEventListener('submit', e => {
		e.preventDefault();
		if (checkInputValues()) {
			addContact();
		}
	});

	const phoneInput = document.getElementById('contact-tel');
	phoneInput.addEventListener('input', maskPhoneNumber);

	const emailInput = document.getElementById('contact-email');
	emailInput.addEventListener('input', maskEmail);
});

function fetchContacts() {
	fetch('/api/contacts')
		.then(response => response.json())
		.then(contacts => {
			let tableContactsBody = document.getElementById('table-contacts-body');
			tableContactsBody.innerHTML = '';
			contacts.forEach(contact => {
				let row = `<tr class="table-contacts-row">
                            <td class="table-contacts-data">${contact.name}</td>
                            <td class="table-contacts-data">
                              <a class="table-contacts-link table-contacts-tel-link" href="tel:+${contact.phone}">${contact.phone}</a>
                            </td>
                            <td class="table-contacts-data">
                              <a class="table-contacts-link table-contacts-email-link" href="mailto:${contact.email}">${contact.email}</a>  
                            </td>
                            <td class="table-contacts-data">
                              <button class="table-contacts-data-button" type="button" onclick="deleteContact(${contact.id})">
                                <svg class="table-contacts-button-icon" width="15" height="15">
												          <use href="./icons.svg#icon-cross"></use>
											          </svg>
                              </button>
                            </td>
                        </tr>`;
				tableContactsBody.innerHTML += row;
			});
		});
}

function addContact() {
	const name = document.getElementById('contact-name').value;
	const phone = document.getElementById('contact-tel').value;
	const email = document.getElementById('contact-email').value;

	fetch('/api/contacts', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, phone, email }),
	})
		.then(response => response.json())
		.then(() => {
			fetchContacts();
			clearForm();
		});
}

function deleteContact(id) {
	fetch(`/api/contacts/${id}`, {
		method: 'DELETE',
	}).then(() => {
		fetchContacts();
	});
}

function clearForm() {
	document.getElementById('contact-name').value = '';
	document.getElementById('contact-tel').value = '';
	document.getElementById('contact-email').value = '';
}

function searchFunction() {
	const nameInput = document.getElementById('search-input-name').value.toUpperCase();
	const phoneInput = document.getElementById('search-input-tel').value.toUpperCase();
	const emailInput = document.getElementById('search-input-email').value.toUpperCase();
	const rows = document.getElementById('table-contacts-body').getElementsByTagName('tr');

	Array.from(rows).forEach(row => {
		const nameTd = row.getElementsByTagName('td')[0];
		const phoneTd = row.getElementsByTagName('td')[1];
		const emailTd = row.getElementsByTagName('td')[2];

		if (nameTd && phoneTd && emailTd) {
			const nameTxt = nameTd.textContent || nameTd.innerText;
			const phoneTxt = phoneTd.textContent || phoneTd.innerText;
			const emailTxt = emailTd.textContent || emailTd.innerText;

			if ((nameInput === '' || nameTxt.toUpperCase().indexOf(nameInput) > -1) && (phoneInput === '' || phoneTxt.toUpperCase().indexOf(phoneInput) > -1) && (emailInput === '' || emailTxt.toUpperCase().indexOf(emailInput) > -1)) {
				row.style.display = '';
			} else {
				row.style.display = 'none';
			}
		}
	});
}

function maskPhoneNumber(event) {
	const input = event.target;
	let value = input.value.replace(/\D/g, '');

	if (value.length > 12) {
		value = value.slice(0, 12);
	}

	const formattedValue = value.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1$2$3$4$5');
	input.value = formattedValue;
}

function validateEmail(email) {
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	if (!emailPattern.test(email)) {
		showCustomAlert('Некоректна пошта');
		return false;
	}
	return true;
}

function checkInputValues() {
	const name = document.getElementById('contact-name').value.trim();
	const phone = document.getElementById('contact-tel').value.trim();
	const email = document.getElementById('contact-email').value.trim();

	if (!name) {
		showCustomAlert(`Некоректне ім'я`);
		return false;
	}

	if (!phone || phone.length !== 13) {
		showCustomAlert('Некоректний номер телефону');
		return false;
	}

	if (!validateEmail(email)) {
		return false;
	}

	return true;
}

function showCustomAlert(message) {
	const alertBox = document.createElement('div');
	alertBox.className = 'custom-alert';
	alertBox.innerText = message;

	document.body.appendChild(alertBox);

	setTimeout(() => {
		alertBox.remove();
	}, 3000);
}
